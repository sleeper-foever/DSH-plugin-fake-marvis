import type {
  ClientContext, ObservableSnapshot,
  SessionFace, SessionId, WorkspaceId, WorkspaceView,
} from '@deepseek-ai/dsh-client-runtime/client'
import type {} from '@deepseek-ai/dsh-client-ui-conversation/client'
import type { ConnectionHandle, HistoryEntry } from '@deepseek-ai/dsh-client-connection/client'
import type { FireflyStatus } from './status.ts'
import { projectAssistantHistory, type AssistantHistoryView } from './assistant-history.ts'

/** Browser persistence contains addresses only; conversation content remains on the host. */
export const ASSISTANT_STORAGE_KEY = 'dsh.firefly.assistant.session.v1'

/** Host and local failures share a plain-text diagnostic without losing host details. */
export interface AssistantError { code: string; message: string; details?: unknown }
/** Acceptance is queue admission, not completion of an assistant turn. */
export type AssistantResult = { ok: true; sessionId?: SessionId } | { ok: false; error: AssistantError }
/** Plain text projected from authoritative user/assistant nodes; never an optimistic history. */
export interface AssistantMessage { id: string; role: 'user' | 'assistant'; text: string; streaming: boolean; pending?: boolean }
/** UI state for one independently addressed host session. */
export interface AssistantSnapshot {
  phase: 'empty' | 'restoring' | 'creating' | 'ready' | 'unavailable'
  status: FireflyStatus
  canSend: boolean
  blockedReason: string | undefined
  needsReveal: boolean
  workspacePath: string | undefined
  modelLabel: string | undefined
  permissionLabel: string
  workspaceId: WorkspaceId | undefined
  workspace: WorkspaceView | undefined
  workspaces: readonly WorkspaceView[]
  sessionId: SessionId | undefined
  messages: readonly AssistantMessage[]
  running: boolean
  sending: boolean
  pendingCount: number
  queuedCount: number
  hasMore: boolean
  loadingOlder: boolean
  preset: string | undefined
  model: string | undefined
  /** The plugin never copies or overrides the main session's permissions. */
  permissions: 'host-session-settings'
  error: AssistantError | undefined
  storageError: boolean
}
/** Only the public host operations used by the controller, suitable for typed fixtures. */
export interface AssistantServices {
  sessions: Pick<ClientContext['sessions'], 'list' | 'open'> & {
    binding(id: SessionId): { session: SessionFace } | undefined
  }
  workspaces: Pick<ClientContext['workspaces'], 'list'>
  connection: Pick<ConnectionHandle, 'hostDescription'> & { api: { sessions: Pick<ConnectionHandle['api']['sessions'], 'create' | 'rename' | 'history' | 'prompt'> } }
  conversation: { blocks: { storeFor(id: SessionId): ObservableSnapshot<{ readonly reason: string } | undefined> } }
}
/** Storage access can be unavailable under browser privacy policies. */
export type AssistantStorage = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>
/** Running-session log refresh interval; each read is serialized and never invokes the model. */
export interface AssistantOptions { historyRefreshMs?: number; publicationTimeoutMs?: number }
interface SavedAddress { sessionId: SessionId; workspaceKey: string }

function titleFor(id: SessionId): string { return 'Firefly Assistant · ' + id }
function failure(error: unknown): AssistantError {
  return { code: 'internal', message: error instanceof Error ? error.message : String(error) }
}

/**
 * Owns an independent session address, not the main selection or composer. History
 * uses the public host history API, including while the runtime SessionFace is cold.
 * One serialized log refresh timer runs only while this assistant is running.
 */
export class AssistantController implements ObservableSnapshot<AssistantSnapshot> {
  private readonly listeners = new Set<() => void>()
  private readonly disposers: (() => void)[] = []
  private sessionDispose: (() => void) | undefined
  private blockDispose: (() => void) | undefined
  private face: SessionFace | undefined
  private address: SavedAddress | undefined
  private selected: WorkspaceId | undefined
  private disposed = false
  private active = true
  private starting = false
  private sending = false
  private loadingOlder = false
  private invalid = false
  private awaitingPublication = false
  private publicationTimer: ReturnType<typeof setTimeout> | undefined
  private historyError: AssistantError | undefined
  private error: AssistantError | undefined
  private storageError = false
  private snapshot: AssistantSnapshot
  private entries: HistoryEntry[] = []
  private history: AssistantHistoryView = { messages: [], status: 'idle' }
  private historyReady = false
  private historyFailed = false
  private historyHasMore = false
  private historyRead: Promise<AssistantResult> | undefined
  private historyAbort: AbortController | undefined
  private generation = 0
  private refreshQueued = false
  private refreshTimer: ReturnType<typeof setTimeout> | undefined
  private signature = ''
  private permissionLabel: string | undefined
  private readonly refreshMs: number
  private readonly publicationTimeoutMs: number

  /** @param services - Existing host services; no connection pump is started. @param storage - Browser address storage, or null. */
  constructor(private readonly services: AssistantServices, private readonly storage: AssistantStorage | null, options: AssistantOptions = {}) {
    this.refreshMs = options.historyRefreshMs ?? 1200
    this.publicationTimeoutMs = options.publicationTimeoutMs ?? 10000
    if (!Number.isFinite(this.publicationTimeoutMs) || this.publicationTimeoutMs <= 0) throw new Error('publicationTimeoutMs must be positive')
    if (!Number.isFinite(this.refreshMs) || this.refreshMs <= 0) throw new Error('historyRefreshMs must be positive')
    try {
      const raw = storage?.getItem(ASSISTANT_STORAGE_KEY)
      if (raw) {
        const saved: unknown = JSON.parse(raw)
        if (typeof saved === 'object' && saved !== null && 'sessionId' in saved && 'workspaceKey' in saved
          && typeof saved.sessionId === 'string' && saved.sessionId !== ''
          && typeof saved.workspaceKey === 'string' && saved.workspaceKey !== '') {
          this.address = { sessionId: saved.sessionId as SessionId, workspaceKey: saved.workspaceKey }
        } else {
          this.invalid = true
          this.error = { code: 'invalid-address', message: 'Saved assistant address is invalid. Choose a workspace and explicitly start a new session.' }
        }
      }
    } catch {
      this.storageError = true
      this.invalid = true
      this.error = { code: 'storage', message: 'Saved assistant address could not be read. Explicitly start a new session.' }
    }
    this.snapshot = this.buildSnapshot()
    this.disposers.push(services.sessions.list.subscribe(() => this.sync()), services.workspaces.list.subscribe(() => this.sync()),
      services.connection.hostDescription.subscribe(() => {
        if (services.connection.hostDescription.getSnapshot() !== undefined) {
          this.historyFailed = false
          this.error = undefined
          this.requestRefresh()
        } else {
          this.generation++
          this.historyAbort?.abort()
          this.historyReady = false
          this.refreshQueued = false
          this.scheduleRefresh()
          this.publish()
        }
      }))
    this.sync()
  }

  getSnapshot = (): AssistantSnapshot => this.snapshot
  subscribe = (listener: () => void): (() => void) => {
    if (this.disposed) return () => {}
    this.listeners.add(listener)
    return () => { this.listeners.delete(listener) }
  }

  /** Pause background log reads while the plugin is disabled; accepted host work is never cancelled. @param active - Whether Firefly is enabled. */
  setActive(active: boolean): void {
    if (this.disposed || this.active === active) return
    this.active = active
    if (!active) {
      this.generation++
      this.historyAbort?.abort()
      this.refreshQueued = false
    } else this.requestRefresh()
    this.scheduleRefresh()
    this.publish()
  }

  /** Choose a workspace without creating a host session or changing main navigation. @param id - Explicit workspace choice. */
  selectWorkspace(id: WorkspaceId): void {
    if (this.disposed || this.starting || this.sending) return
    if (this.selected === id) return
    this.selected = id
    if (this.address?.workspaceKey !== this.workspace()?.path) this.address = undefined
    this.invalid = false
    this.error = undefined
    this.sync()
  }

  /** Create a fresh real host session using host defaults, never a reusable blank. @param workspaceId - Explicit workspace. @returns Creation result without automatic retries. */
  async start(workspaceId: WorkspaceId, firstMessage?: string): Promise<AssistantResult> {
    try { return await this.startOperation(workspaceId, firstMessage) }
    catch (error) { return this.fail(failure(error)) }
  }
  private async startOperation(workspaceId: WorkspaceId, firstMessage?: string): Promise<AssistantResult> {
    if (firstMessage !== undefined && !firstMessage.trim()) return this.refuse('empty', 'Enter a message.')
    if (firstMessage?.trimStart().startsWith('/')) return this.refuse('slash', 'Use the dedicated full conversation for slash commands.')
    if (this.disposed) return this.refuse('disposed', 'Assistant is closed.')
    if (this.starting || this.sending) return this.refuse('busy', 'An assistant request is already pending.')
    const workspace = this.services.workspaces.list.getSnapshot().items.find(item => item.workspaceId === workspaceId)
    if (!workspace || !this.baselinesReady()) return this.refuse('workspace', 'Wait for the host workspace list, then choose a workspace.')
    if (this.address && !this.invalid) return this.refuse('already-started', 'An assistant session is already attached.')
    this.selected = workspaceId
    this.awaitingPublication = false
    this.address = undefined
    this.invalid = false
    this.starting = true
    this.error = undefined
    try {
      this.sync()
      const before = new Set(this.services.sessions.list.getSnapshot().ids)
      const created = (await this.services.connection.api.sessions.create({ workspaceId })).result
      if (!created.ok) return this.fail(created.error)
      const id = created.value.sessionId
      if (before.has(id)) return this.fail({ code: 'session-conflict', message: 'Host did not return a new dedicated session.' })
      // Creation may settle after disposal; do not rename, attach, or send from a dead controller.
      if (this.disposed) return { ok: false, error: { code: 'disposed', message: 'Assistant closed during creation; the new host session was left untouched.', details: { sessionId: id } } }
      const renamed = (await this.services.connection.api.sessions.rename({ sessionId: id, title: titleFor(id) })).result
      if (!renamed.ok) return this.fail({ ...renamed.error, details: { cause: renamed.error.details, sessionId: id } })
      if (this.disposed) return { ok: false, error: { code: 'disposed', message: 'Assistant closed during creation.', details: { sessionId: id } } }
      this.error = undefined
      this.address = { sessionId: id, workspaceKey: workspace.path }
      this.awaitingPublication = true
      if (this.publicationTimer !== undefined) clearTimeout(this.publicationTimer)
      this.publicationTimer = setTimeout(() => {
        if (this.disposed || !this.awaitingPublication || this.address?.sessionId !== id) return
        this.awaitingPublication = false
        this.invalid = true
        this.error = { code: 'publication-timeout', message: 'The new conversation did not appear in the host list. Reload history or explicitly start again; the first message will not be retried.' }
        this.sync()
      }, this.publicationTimeoutMs)
      try { this.storage?.setItem(ASSISTANT_STORAGE_KEY, JSON.stringify(this.address)) }
      catch { this.storageError = true }
      if (firstMessage !== undefined) {
        if (!this.active || this.disposed) return this.refuse('disabled', 'Assistant was closed before the first message was submitted.')
        const receipt = (await this.services.connection.api.sessions.prompt({ sessionId: id, content: [{ type: 'text', text: firstMessage }], mode: 'queue' })).result
        if (!receipt.ok) return this.fail(receipt.error)
      }
      return { ok: true, sessionId: id }
    } catch (error) {
      return this.fail(failure(error))
    } finally {
      this.starting = false
      this.sync()
      if (this.historyRead) await this.historyRead
    }
  }

  /** Revalidate the saved identity against the current host baseline, without reconnecting or creating. @returns Address validation result. */
  /** Explicit log reload; does not create sessions or retry prompts. */
  refresh(): Promise<AssistantResult> { return this.retryRestore() }

  async retryRestore(): Promise<AssistantResult> {
    try { return await this.restoreOperation() }
    catch (error) { return this.fail(failure(error)) }
  }
  private async restoreOperation(): Promise<AssistantResult> {
    if (this.disposed) return this.refuse('disposed', 'Assistant is closed.')
    if (this.starting || this.sending) return this.refuse('busy', 'An assistant request is already pending.')
    this.invalid = false
    this.awaitingPublication = false
    this.error = undefined
    this.historyFailed = false
    this.sync()
    if (this.face && !this.invalid) return this.readHistory()
    return this.invalid ? { ok: false, error: this.error ?? { code: 'missing-session', message: 'Dedicated session is unavailable.' } }
      : { ok: true, sessionId: this.address?.sessionId }
  }

  /** Replace the browser attachment only after the caller confirms; existing host history is retained. @param workspaceId - Explicit workspace. @param confirmed - User confirmed creating another conversation. @returns New session creation result. */
  async newConversation(workspaceId: WorkspaceId, confirmed: boolean): Promise<AssistantResult> {
    if (!confirmed) return this.refuse('confirmation-required', 'Confirm before starting another conversation.')
    if (this.disposed) return this.refuse('disposed', 'Assistant is closed.')
    if (this.starting || this.sending) return this.refuse('busy', 'An assistant request is already pending.')
    this.reset()
    return this.start(workspaceId)
  }

  /** Forget the browser address without deleting host history; a new start still needs a user action. */
  reset(): void {
    if (this.disposed || this.starting || this.sending) return
    if (this.publicationTimer !== undefined) clearTimeout(this.publicationTimer)
    this.publicationTimer = undefined
    this.clearHistory()
    this.address = undefined
    this.awaitingPublication = false
    this.invalid = false
    this.error = undefined
    try { this.storage?.removeItem(ASSISTANT_STORAGE_KEY) }
    catch { this.storageError = true }
    this.sync()
  }

  /** Enqueue verbatim plain text via SessionFace.prompt. @param text - User draft, never copied from the main composer. @returns Queue receipt or structured refusal. */
  async send(text: string): Promise<AssistantResult> {
    try { return await this.sendOperation(text) }
    catch (error) { return this.fail(failure(error)) }
  }
  private async sendOperation(text: string): Promise<AssistantResult> {
    if (this.disposed) return this.refuse('disposed', 'Assistant is closed.')
    if (this.sending || this.starting) return this.refuse('busy', 'An assistant request is already pending.')
    if (!this.active) return this.refuse('disabled', 'Assistant is disabled.')
    if (!text.trim()) return this.refuse('empty', 'Enter a message.')
    if (text.trimStart().startsWith('/')) return this.refuse('slash', 'Use the main session for slash commands.')
    if (this.services.connection.hostDescription.getSnapshot() === undefined) return this.refuse('disconnected', 'Disconnected from DSH.')
    this.sync()
    if (this.snapshot.phase !== 'ready' || !this.face || !this.address) return this.refuse('not-ready', 'Open the dedicated session history before sending.')
    if (this.snapshot.pendingCount > 0) return this.refuse('interaction', 'Resolve the pending interaction in the main session view.')
    const block = this.services.conversation.blocks.storeFor(this.address.sessionId).getSnapshot()
    if (block) return this.refuse('composer-blocked', block.reason)
    const face = this.face
    this.sending = true
    this.error = undefined
    this.publish()
    try {
      const result = await face.prompt([{ type: 'text', text }], 'queue')
      if (result.ok) { this.error = undefined; this.requestRefresh(); return { ok: true, sessionId: face.sessionId } }
      return this.fail(result.error)
    } catch (error) { return this.fail(failure(error)) }
    finally { this.sending = false; this.sync() }
  }

  /** Extend the dedicated session's authoritative history window. @returns Completion or refusal; no polling or retries. */
  async loadOlder(): Promise<AssistantResult> {
    try { return await this.olderOperation() }
    catch (error) { return this.fail(failure(error)) }
  }
  private async olderOperation(): Promise<AssistantResult> {
    if (this.disposed) return this.refuse('disposed', 'Assistant is closed.')
    this.sync()
    if (this.historyRead || this.loadingOlder || this.snapshot.loadingOlder) return { ok: false, error: { code: 'busy', message: 'History is already loading.' } }
    if (this.snapshot.phase !== 'ready' || !this.face) return this.refuse('not-ready', 'Open the dedicated session history first.')
    if (!this.historyHasMore || this.entries.length === 0) return { ok: true }
    return this.readHistory(this.entries[0]!.event.seq)
  }

  /** Explicit user navigation is the only action allowed to change the main selection. */
  reveal(): void {
    if (this.disposed) return
    this.sync()
    if (this.address && !this.invalid && this.face) {
      try { this.services.sessions.open(this.address.sessionId) }
      catch (error) { this.fail(failure(error)) }
    }
  }

  /** Detach listeners; host history and accepted agent work remain owned by DSH. */
  dispose(): void {
    if (this.disposed) return
    this.disposed = true
    if (this.publicationTimer !== undefined) clearTimeout(this.publicationTimer)
    this.clearHistory()
    this.listeners.clear()
    this.sessionDispose?.()
    this.blockDispose?.()
    for (const dispose of this.disposers) dispose()
  }

  private workspace(): WorkspaceView | undefined {
    return this.services.workspaces.list.getSnapshot().items.find(item => this.selected === undefined
      ? item.path === this.address?.workspaceKey : item.workspaceId === this.selected)
  }
  private baselinesReady(): boolean {
    return this.services.sessions.list.getSnapshot().phase === 'ready' && this.services.workspaces.list.getSnapshot().baselinesReady
  }
  private sync(): void {
    if (this.disposed) return
    try { this.reconcile() }
    catch (error) { this.historyFailed = true; this.error = failure(error); this.publish() }
  }
  private reconcile(): void {
    if (this.disposed) return
    const workspace = this.workspace()
    if (workspace && this.selected === undefined) this.selected = workspace.workspaceId
    let face: SessionFace | undefined
    if (this.address && !this.invalid && this.baselinesReady()) {
      const row = this.services.sessions.list.getSnapshot().byId[this.address.sessionId]
      // A just-created host row may arrive after the RPC; only restoration/deletion fails closed.
      if (row && workspace?.sessionIds.includes(this.address.sessionId) && row.title === titleFor(this.address.sessionId)
        && !row.origin && !row.parentId && row.cwd === this.address.workspaceKey) {
        this.awaitingPublication = false
        if (this.publicationTimer !== undefined) clearTimeout(this.publicationTimer)
        this.publicationTimer = undefined
        face = this.services.sessions.binding(this.address.sessionId)?.session
        if (face?.getSnapshot().removed || face?.getSnapshot().subagent) {
          face = undefined
          this.invalid = true
        }
      } else if (!this.starting && (!this.awaitingPublication || !workspace || (row && (row.origin || row.parentId || row.cwd !== this.address.workspaceKey)))) {
        this.invalid = true
        this.error = { code: 'missing-session', message: 'Saved assistant session is missing or no longer dedicated to this workspace. Explicitly start a new session.' }
      }
    }
    if (face !== this.face) {
      this.sessionDispose?.()
      this.blockDispose?.()
      this.clearHistory()
      this.face = face
      this.sessionDispose = face?.subscribe(() => this.sync())
      this.blockDispose = face && this.services.conversation.blocks.storeFor(face.sessionId).subscribe(() => this.publish())
    }
    const row = this.address ? this.services.sessions.list.getSnapshot().byId[this.address.sessionId] : undefined
    const signature = face ? [face.sessionId, row?.updatedAt, row?.running, row?.pendingInteraction, face.getSnapshot().running, face.getSnapshot().queue.length].join(':') : ''
    if (signature !== this.signature) {
      this.signature = signature
      this.requestRefresh()
    }
    this.scheduleRefresh()
    this.publish()
  }
  private clearHistory(): void {
    this.generation++
    this.historyAbort?.abort()
    if (this.refreshTimer !== undefined) clearTimeout(this.refreshTimer)
    this.refreshTimer = undefined
    this.refreshQueued = false
    this.signature = ''
    this.entries = []
    this.permissionLabel = undefined
    this.history = { messages: [], status: 'idle' }
    this.historyReady = false
    this.historyFailed = false
    this.historyError = undefined
    this.historyHasMore = false
    this.loadingOlder = false
  }
  private isRunning(): boolean {
    const row = this.address ? this.services.sessions.list.getSnapshot().byId[this.address.sessionId] : undefined
    return !!(this.face?.getSnapshot().running || row?.running)
  }
  private scheduleRefresh(): void {
    const eligible = !this.disposed && this.active && this.face && !this.invalid && !this.historyFailed
      && this.isRunning() && this.services.connection.hostDescription.getSnapshot() !== undefined
    if (!eligible) {
      if (this.refreshTimer !== undefined) clearTimeout(this.refreshTimer)
      this.refreshTimer = undefined
      return
    }
    // Unrelated main-session notifications must not postpone an already scheduled log read.
    if (this.historyRead || this.refreshTimer !== undefined) return
    this.refreshTimer = setTimeout(() => { this.refreshTimer = undefined; this.requestRefresh() }, this.refreshMs)
  }
  private requestRefresh(): void {
    if (this.disposed || !this.active || !this.face || this.invalid || this.historyFailed || this.services.connection.hostDescription.getSnapshot() === undefined) return
    if (this.historyRead) { this.refreshQueued = true; return }
    void this.readHistory()
  }
  private readHistory(beforeSeq?: number): Promise<AssistantResult> {
    if (this.historyRead) return this.historyRead
    if (this.disposed || !this.active || !this.address || !this.face || this.invalid || this.services.connection.hostDescription.getSnapshot() === undefined) return Promise.resolve({ ok: false, error: { code: 'not-ready', message: 'Dedicated session is unavailable.' } })
    if (this.refreshTimer !== undefined) clearTimeout(this.refreshTimer)
    this.refreshTimer = undefined
    const sessionId = this.address.sessionId
    const generation = this.generation
    const abort = new AbortController()
    this.historyAbort = abort
    this.loadingOlder = beforeSeq !== undefined
    const work = Promise.resolve().then(async (): Promise<AssistantResult> => {
      try {
        if (generation !== this.generation || this.disposed) return { ok: false, error: { code: 'superseded', message: 'History request was superseded.' } }
        const result = (await this.services.connection.api.sessions.history({ sessionId, ...(beforeSeq === undefined ? {} : { beforeSeq }) }, abort.signal)).result
        if (generation !== this.generation || this.disposed) return { ok: false, error: { code: 'superseded', message: 'History request was superseded.' } }
        if (!result.ok) { this.historyFailed = true; this.historyError = result.error; return { ok: false, error: result.error } }
        if (beforeSeq === undefined) {
          const values: unknown = result.value.projections?.values
          const permission = typeof values === 'object' && values !== null && 'permissions' in values ? values.permissions : undefined
          this.permissionLabel = typeof permission === 'object' && permission !== null && 'currentValue' in permission && typeof permission.currentValue === 'string'
            ? permission.currentValue : undefined
        }
        let incoming = result.value.events
        let more = result.value.hasMore
        const oldTail = this.entries.at(-1)?.event.seq
        // A long disconnect can move the tail window beyond the retained prefix.
        // Page backwards serially until that gap is closed, instead of inventing continuity.
        while (beforeSeq === undefined && oldTail !== undefined && incoming[0] && incoming[0].event.seq > oldTail + 1 && more) {
          const cursor = incoming[0].event.seq
          const older = (await this.services.connection.api.sessions.history({ sessionId, beforeSeq: cursor }, abort.signal)).result
          if (generation !== this.generation || this.disposed) return { ok: false, error: { code: 'superseded', message: 'History request was superseded.' } }
          if (!older.ok) { this.historyFailed = true; this.historyError = older.error; return { ok: false, error: older.error } }
          if (!older.value.events.length || older.value.events[0]!.event.seq >= cursor) throw new Error('Host history did not advance its cursor.')
          incoming = [...older.value.events, ...incoming]
          more = older.value.hasMore
        }
        if (beforeSeq === undefined && oldTail !== undefined && incoming[0] && incoming[0].event.seq > oldTail + 1) throw new Error('Host history has an unrecoverable gap.')
        if (beforeSeq !== undefined && incoming.length && incoming.at(-1)!.event.seq + 1 !== beforeSeq) throw new Error('Host history page is not contiguous.')
        const oldFirst = this.entries[0]?.event.seq
        const merged = new Map(this.entries.map(entry => [entry.event.seq, entry]))
        for (const entry of incoming) merged.set(entry.event.seq, entry)
        this.entries = [...merged.values()].sort((a, b) => a.event.seq - b.event.seq)
        if (oldFirst === undefined || beforeSeq !== undefined || (incoming[0] && incoming[0].event.seq <= oldFirst)) this.historyHasMore = more
        this.history = projectAssistantHistory(this.entries)
        this.historyReady = true
        this.historyFailed = false
        this.historyError = undefined
        return { ok: true, sessionId }
      } catch (error) {
        if (generation !== this.generation || this.disposed) return { ok: false, error: { code: 'superseded', message: 'History request was superseded.' } }
        this.historyFailed = true
        this.historyError = failure(error)
        return { ok: false, error: this.historyError }
      } finally {
        this.historyRead = undefined
        this.historyAbort = undefined
        this.loadingOlder = false
        if (!this.disposed) {
          this.publish()
          if (this.refreshQueued && !this.historyFailed) { this.refreshQueued = false; this.requestRefresh() }
          else this.scheduleRefresh()
        }
      }
    })
    this.historyRead = work
    this.publish()
    return work
  }
  private buildSnapshot(): AssistantSnapshot {
    const state = this.face?.getSnapshot()
    const workspace = this.workspace()
    const row = this.address ? this.services.sessions.list.getSnapshot().byId[this.address.sessionId] : undefined
    const phase = this.starting ? 'creating' : this.invalid ? 'unavailable' : !this.address ? (this.error && !['empty', 'slash'].includes(this.error.code) ? 'unavailable' : 'empty')
      : this.historyFailed ? 'unavailable' : !this.baselinesReady() || !state || !this.historyReady ? 'restoring' : 'ready'
    // Cold faces are not resynchronized by DSH; their retained waits may be from an older connection.
    const pending = state?.openState === 'open' ? state.pending : []
    const pendingCount = Math.max(pending.length, row?.pendingInteraction ? 1 : 0)
    const composerBlock = this.face ? this.services.conversation.blocks.storeFor(this.face.sessionId).getSnapshot() : undefined
    const blockedReason = this.services.connection.hostDescription.getSnapshot() === undefined ? 'Disconnected from DSH.' : !this.active ? 'Assistant is disabled.' : phase !== 'ready' ? 'Assistant session is not ready.' : this.sending ? 'A message is being submitted.'
      : pendingCount > 0 ? 'Resolve the pending interaction in the main session view.' : composerBlock?.reason
    const lastAssistant = state?.nodes.filter(node => node.kind === 'assistant').at(-1)
    const model = this.history.model ?? lastAssistant?.provenance?.model ?? lastAssistant?.requestConfig?.model
    let status: FireflyStatus = this.history.status === 'running' ? 'idle' : this.history.status
    if (phase === 'empty') status = 'noSession'
    else if (phase === 'creating' || phase === 'restoring') status = 'loading'
    else if (phase === 'unavailable') status = 'unavailable'
    else if (row?.pendingInteraction === 'plan-review') status = 'review'
    else if (row?.pendingInteraction === 'question' || pending.some(wait => wait.kind === 'question')) status = 'question'
    else if (pendingCount > 0) status = 'approval'
    else if (this.isRunning()) status = 'running'
    else if (state?.queue.length) status = 'queued'
    else if (state?.lastAgentError && this.history.status !== 'completed') status = 'failed'
    return {
      phase, status, canSend: blockedReason === undefined, blockedReason, needsReveal: false,
      workspacePath: workspace?.path, modelLabel: model,
      permissionLabel: this.permissionLabel ?? 'Host session permissions (not overridden by Firefly)',
      workspaceId: this.selected, workspace, workspaces: this.services.workspaces.list.getSnapshot().items,
      sessionId: this.address?.sessionId, messages: this.history.messages, running: this.isRunning(),
      sending: this.sending, pendingCount, queuedCount: state?.queue.length ?? 0,
      hasMore: this.historyHasMore, loadingOlder: this.loadingOlder, preset: row?.agentPreset, model,
      permissions: 'host-session-settings', error: this.error ?? this.historyError ?? state?.promptError?.error
        ?? (state?.lastAgentError && this.history.status !== 'completed' ? { code: 'agent-error', message: state.lastAgentError } : undefined)
        ?? (this.history.error ? { code: 'turn-error', message: this.history.error } : undefined),
      storageError: this.storageError,
    }
  }
  private publish(): void {
    if (this.disposed) return
    try { this.snapshot = this.buildSnapshot() }
    catch (error) { this.snapshot = { ...this.snapshot, phase: 'unavailable', canSend: false, error: failure(error), blockedReason: 'Session provider is unavailable.' } }
    for (const listener of this.listeners) {
      try { listener() }
      catch (error) { console.error('[firefly-assistant] snapshot listener failed', error) }
    }
  }
  private refuse(code: string, message: string): AssistantResult { return this.fail({ code, message }) }
  private fail(error: AssistantError): AssistantResult {
    if (!this.disposed) { this.error = error; this.publish() }
    return { ok: false, error }
  }
}
