import { afterEach, describe, expect, it, vi } from 'vitest'
import type { ObservableSnapshot, SessionFace, SessionId, SessionListState, WorkspaceId, WorkspaceListState } from '@deepseek-ai/dsh-client-runtime/client'
import type { RpcId, HistoryEntry, HostDescription, MessageId } from '@deepseek-ai/dsh-client-connection/client'
import { AssistantController, ASSISTANT_STORAGE_KEY } from '../src/client/assistant-controller.ts'
import type { AssistantServices, AssistantStorage } from '../src/client/assistant-controller.ts'
import { snapshot } from './fixtures.ts'

const MAIN = 'main-session' as SessionId
const DEDICATED = 'dedicated-session' as SessionId
const WS = 'chosen-workspace' as WorkspaceId
const rpcId = 'rpc-test' as RpcId
const controllers: AssistantController[] = []
afterEach(() => { for (const controller of controllers.splice(0)) controller.dispose(); vi.useRealTimers() })
function user(seq: number, text: string): HistoryEntry {
  return { event: { type: 'user/message', seq, time: seq, surfaceOp: 'append', data: { id: ('u' + seq) as MessageId, role: 'user', content: [{ type: 'text', text }], source: { kind: 'user' } } } }
}
function assistant(seq: number, text: string): HistoryEntry {
  return { event: { type: 'assistant/message', seq, time: seq, surfaceOp: 'append', data: { turn: 1, step: 1, message: { id: ('a' + seq) as MessageId, role: 'assistant', content: [{ type: 'text', text }], source: { kind: 'model', provider: 'configured', model: 'default-model' } } } } }
}
function chunk(seq: number, text: string, step = 1): HistoryEntry {
  return { event: { type: 'assistant/chunk', seq, time: seq, data: { turn: 1, step, chunk: { type: 'text-delta', index: 0, text } } } }
}
function handshake(): HostDescription { return { version: 'test', cwd: '/project', attachedSessions: 1, home: '/home/test', canOpenPath: false } }
function cell<T>(initial: T): ObservableSnapshot<T> & { set(value: T): void; listeners: Set<() => void> } {
  let value = initial
  const listeners = new Set<() => void>()
  return { getSnapshot: () => value, listeners, subscribe: listener => { listeners.add(listener); return () => { listeners.delete(listener) } },
    set: next => { value = next; for (const listener of [...listeners]) listener() } }
}
function bench(saved?: string) {
  const list = cell<SessionListState>({ ids: [MAIN], byId: { [MAIN]: {
    id: MAIN, displayTitle: 'Main', cwd: '/project', running: false, blank: true, updatedAt: 1,
  } }, current: MAIN, currentAddress: undefined, phase: 'ready', jobsBySession: {}, subagentsByParent: {} })
  const workspaces = cell<WorkspaceListState>({ items: [{ workspaceId: WS, path: '/project', title: 'Project', sessionIds: [MAIN], createdAt: '0', updatedAt: '0' }],
    archivedSessionIds: [], state: 'idle', phase: 'ready', error: null, baselinesReady: true, recentWorkspaceId: WS })
  const session = cell(snapshot({ sessionId: DEDICATED, blank: true, openState: 'cold' }))
  const block = cell<{ readonly reason: string } | undefined>(undefined)
  const prompt = vi.fn<SessionFace['prompt']>(async () => ({ ok: true, value: { accepted: true } }))
  const loadOlder = vi.fn<SessionFace['loadOlder']>(async () => {})
  const face: SessionFace = {
    ...session, sessionId: DEDICATED, prompt, loadOlder, projections: { faceOf: () => cell(undefined) },
    rename: async title => ({ ok: true, value: { title, seq: 1 } }),
    cancel: async () => ({ ok: true, value: { accepted: true } }),
    updateQueue: async () => ({ ok: true, value: { accepted: true } }),
    command: async () => ({ ok: true, value: { matched: false } }),
    readAttachment: async () => ({ ok: false, error: { code: 'internal', message: 'not part of this test' } }),
  }
  function publishCreated(title = 'Firefly Assistant · ' + DEDICATED) {
    list.set({ ...list.getSnapshot(), ids: [MAIN, DEDICATED], byId: { ...list.getSnapshot().byId, [DEDICATED]: {
      id: DEDICATED, title, displayTitle: title, cwd: '/project', running: false, blank: true, updatedAt: 2, agentPreset: 'host-default',
    } } })
    workspaces.set({ ...workspaces.getSnapshot(), items: workspaces.getSnapshot().items.map(item => ({ ...item, sessionIds: [MAIN, DEDICATED] })) })
  }
  const log = { events: [] as HistoryEntry[], hasMore: false }
  const hostDescription = cell<HostDescription | undefined>(handshake())
  const history = vi.fn<AssistantServices['connection']['api']['sessions']['history']>(async () => ({ rpcId, result: { ok: true, value: { ...log } } }))
  const create = vi.fn<AssistantServices['connection']['api']['sessions']['create']>(async () => ({ rpcId, result: { ok: true, value: { sessionId: DEDICATED } } }))
  const rename = vi.fn<AssistantServices['connection']['api']['sessions']['rename']>(async ({ title }) => {
    publishCreated(title)
    return { rpcId, result: { ok: true, value: { title, seq: 1 } } }
  })
  const open = vi.fn((id: SessionId) => {
    list.set({ ...list.getSnapshot(), current: id })
    session.set({ ...session.getSnapshot(), openState: 'open' })
  })
  const firstPrompt = vi.fn<AssistantServices['connection']['api']['sessions']['prompt']>(async () => ({ rpcId, result: { ok: true, value: { accepted: true } } }))
  const services: AssistantServices = {
    sessions: { list, binding: id => id === DEDICATED ? { session: face } : undefined, open },
    workspaces: { list: workspaces }, connection: { hostDescription, api: { sessions: { create, rename, history, prompt: firstPrompt } } },
    conversation: { blocks: { storeFor: () => block } },
  }
  const data = new Map<string, string>()
  if (saved) data.set(ASSISTANT_STORAGE_KEY, saved)
  const storage: AssistantStorage = { getItem: key => data.get(key) ?? null, setItem: (key, value) => { data.set(key, value) }, removeItem: key => { data.delete(key) } }
  const controller = () => { const c = new AssistantController(services, storage); controllers.push(c); return c }
  return { list, workspaces, session, block, services, storage, data, controller, create, rename, open, prompt, loadOlder, publishCreated, history, log, hostDescription, firstPrompt }
}
const savedAddress = JSON.stringify({ sessionId: DEDICATED, workspaceKey: '/project' })
async function ready() {
  const b = bench()
  const c = b.controller()
  await c.start(WS)
  await c.retryRestore()
  return { ...b, c }
}

describe('independently addressed Firefly controller', () => {
  it('requires explicit start and creates fresh with only workspace/default host configuration', async () => {
    const b = bench()
    const c = b.controller()
    c.selectWorkspace(WS)
    expect(b.create).not.toHaveBeenCalled()
    expect(await c.start(WS)).toEqual({ ok: true, sessionId: DEDICATED })
    expect(b.create).toHaveBeenCalledExactlyOnceWith({ workspaceId: WS })
    expect(b.rename).toHaveBeenCalledExactlyOnceWith({ sessionId: DEDICATED, title: 'Firefly Assistant · ' + DEDICATED })
    expect(b.list.getSnapshot().current).toBe(MAIN)
    expect(b.open).not.toHaveBeenCalled()
    expect(c.getSnapshot()).toMatchObject({ sessionId: DEDICATED, phase: 'ready', preset: 'host-default' })
    expect(JSON.parse(b.data.get(ASSISTANT_STORAGE_KEY)!)).toEqual({ sessionId: DEDICATED, workspaceKey: '/project' })
    expect(await c.start(WS)).toMatchObject({ ok: false, error: { code: 'already-started' } })
  })

  it('loads cold history independently and sends without selecting the main session', async () => {
    const b = bench()
    const c = b.controller()
    await c.start(WS)
    await c.retryRestore()
    expect(b.session.getSnapshot().openState).toBe('cold')
    expect(await c.send('hello')).toMatchObject({ ok: true })
    expect(b.open).not.toHaveBeenCalled()
    expect(b.list.getSnapshot().current).toBe(MAIN)
    c.reveal()
    expect(b.open).toHaveBeenCalledExactlyOnceWith(DEDICATED)
    expect(c.getSnapshot().phase).toBe('ready')
  })

  it('restores only a matching owned host row and leaves main selection untouched', async () => {
    const b = bench(savedAddress)
    b.publishCreated()
    const c = b.controller()
    await c.retryRestore()
    expect(c.getSnapshot()).toMatchObject({ sessionId: DEDICATED, phase: 'ready' })
    expect(b.create).not.toHaveBeenCalled()
    expect(b.open).not.toHaveBeenCalled()
    expect(b.list.getSnapshot().current).toBe(MAIN)
  })

  it.each(['deleted', 'title', 'workspace', 'origin', 'main-address'] as const)('rejects %s saved ownership without silent replacement', async mode => {
    const b = bench(mode === 'main-address' ? JSON.stringify({ sessionId: MAIN, workspaceKey: '/project' }) : savedAddress)
    if (mode !== 'deleted') b.publishCreated(mode === 'title' ? 'Renamed by human' : undefined)
    if (mode === 'workspace') b.workspaces.set({ ...b.workspaces.getSnapshot(), items: [] })
    if (mode === 'origin') {
      const rows = b.list.getSnapshot()
      b.list.set({ ...rows, byId: { ...rows.byId, [DEDICATED]: { ...rows.byId[DEDICATED]!, origin: 'subagent' } } })
    }
    const c = b.controller()
    expect(c.getSnapshot().phase).toBe('unavailable')
    expect(await c.send('do not forward')).toMatchObject({ ok: false })
    expect(b.prompt).not.toHaveBeenCalled()
    expect(b.create).not.toHaveBeenCalled()
    c.reveal()
    expect(b.open).not.toHaveBeenCalled()
  })

  it('waits for both baselines before rejecting a stored address', async () => {
    const b = bench(savedAddress)
    b.list.set({ ...b.list.getSnapshot(), phase: 'pending' })
    b.workspaces.set({ ...b.workspaces.getSnapshot(), baselinesReady: false })
    const c = b.controller()
    expect(c.getSnapshot().phase).toBe('restoring')
    b.publishCreated()
    b.list.set({ ...b.list.getSnapshot(), phase: 'ready' })
    b.workspaces.set({ ...b.workspaces.getSnapshot(), baselinesReady: true })
    await c.retryRestore()
    expect(c.getSnapshot().phase).toBe('ready')
  })

  it('waits for independent host publications after create and rename receipts', async () => {
    const b = bench()
    b.rename.mockImplementationOnce(async ({ title }) => ({ rpcId, result: { ok: true, value: { title, seq: 1 } } }))
    const c = b.controller()
    await c.start(WS)
    expect(c.getSnapshot().phase).toBe('restoring')
    b.publishCreated()
    await c.retryRestore()
    expect(c.getSnapshot().phase).toBe('ready')
  })

  it('queues only to the dedicated face and does not optimistically echo conversation text', async () => {
    const b = await ready()
    expect(await b.c.send('  hello\nworld  ')).toEqual({ ok: true, sessionId: DEDICATED })
    expect(b.prompt).toHaveBeenCalledExactlyOnceWith([{ type: 'text', text: '  hello\nworld  ' }], 'queue')
    expect(b.list.getSnapshot().current).toBe(MAIN)
    expect(b.c.getSnapshot().messages).toEqual([])
    await b.c.retryRestore()
    b.log.events = [user(1, 'hello'), assistant(2, 'answer'), chunk(3, 'partial', 2)]
    await b.c.retryRestore()
    expect(b.c.getSnapshot().messages.map(message => [message.role, message.text, message.streaming])).toEqual([
      ['user', 'hello', false], ['assistant', 'answer', false], ['assistant', 'partial', true],
    ])
  })

  it('retains a send lock across duplicate attempts, preserving host errors without retries', async () => {
    const b = await ready()
    let settle!: (value: Awaited<ReturnType<SessionFace['prompt']>>) => void
    b.prompt.mockImplementationOnce(() => new Promise(resolve => { settle = resolve }))
    const request = b.c.send('first')
    expect(b.c.getSnapshot().sending).toBe(true)
    expect(await b.c.send('duplicate')).toMatchObject({ ok: false, error: { code: 'busy' } })
    expect(await b.c.send('duplicate again')).toMatchObject({ ok: false, error: { code: 'busy' } })
    const error = { code: 'agent-busy' as const, message: 'busy', details: { reason: 'host ownership' } }
    settle({ ok: false, error })
    expect(await request).toEqual({ ok: false, error })
    expect(b.prompt).toHaveBeenCalledTimes(1)
    expect(b.c.getSnapshot().sending).toBe(false)
    expect(b.c.getSnapshot().error).toEqual(error)
  })

  it('surfaces pending interactions and composer refusal without granting approval', async () => {
    const b = await ready()
    const rows = b.list.getSnapshot()
    b.list.set({ ...rows, byId: { ...rows.byId, [DEDICATED]: { ...rows.byId[DEDICATED]!, pendingInteraction: 'approval' } } })
    expect(b.c.getSnapshot().pendingCount).toBe(1)
    expect(await b.c.send('task')).toMatchObject({ ok: false, error: { code: 'interaction' } })
    b.list.set(rows)
    b.block.set({ reason: 'Select a model' })
    expect(await b.c.send('task')).toMatchObject({ ok: false, error: { code: 'composer-blocked', message: 'Select a model' } })
    expect(b.prompt).not.toHaveBeenCalled()
  })

  it('invalidates a removed session and allows only deliberate replacement', async () => {
    const b = await ready()
    b.list.set({ ...b.list.getSnapshot(), ids: [MAIN], byId: { [MAIN]: b.list.getSnapshot().byId[MAIN]! } })
    expect(b.c.getSnapshot().phase).toBe('unavailable')
    expect(await b.c.send('task')).toMatchObject({ ok: false })
    expect(b.create).toHaveBeenCalledTimes(1)
    expect(await b.c.start(WS)).toMatchObject({ ok: true })
    expect(b.create).toHaveBeenCalledTimes(2)
  })

  it('paginates through public history RPC and removes all listeners on disposal', async () => {
    const b = await ready()
    b.log.events = [assistant(2, 'answer')]
    b.log.hasMore = true
    await b.c.retryRestore()
    b.history.mockResolvedValueOnce({ rpcId, result: { ok: true, value: { events: [user(1, 'older')], hasMore: false } } })
    await b.c.loadOlder()
    expect(b.history).toHaveBeenLastCalledWith({ sessionId: DEDICATED, beforeSeq: 2 }, expect.any(AbortSignal))
    expect(b.loadOlder).not.toHaveBeenCalled()
    expect(b.c.getSnapshot().messages.map(message => message.text)).toEqual(['older', 'answer'])
    const notify = vi.fn()
    b.c.subscribe(notify)
    b.c.dispose()
    for (const store of [b.list, b.workspaces, b.session, b.block, b.hostDescription]) expect(store.listeners.size).toBe(0)
    b.session.set({ ...b.session.getSnapshot(), running: true })
    expect(notify).not.toHaveBeenCalled()
    expect(await b.c.send('task')).toMatchObject({ ok: false, error: { code: 'disposed' } })
  })

  it('keeps unavailable storage optional and never persists message content', async () => {
    const b = bench()
    const storage: AssistantStorage = { getItem: () => { throw new Error('blocked') }, setItem: () => { throw new Error('blocked') }, removeItem: () => { throw new Error('blocked') } }
    const c = new AssistantController(b.services, storage)
    expect(c.getSnapshot()).toMatchObject({ phase: 'unavailable', storageError: true })
    expect(await c.start(WS)).toMatchObject({ ok: true })
    c.reveal()
    expect(await c.send('private prompt')).toMatchObject({ ok: true })
    expect(c.getSnapshot().storageError).toBe(true)
  })

  it('surfaces failed creation once without renaming or attaching another session', async () => {
    const b = bench()
    const error = { code: 'internal' as const, message: 'create failed', details: {} }
    b.create.mockResolvedValueOnce({ rpcId, result: { ok: false, error } })
    const c = b.controller()
    expect(await c.start(WS)).toEqual({ ok: false, error })
    expect(c.getSnapshot()).toMatchObject({ phase: 'unavailable', error })
    expect(b.create).toHaveBeenCalledOnce()
    expect(b.rename).not.toHaveBeenCalled()
    expect(b.data.size).toBe(0)
  })

  it('refuses an existing main session returned from create without marking it owned', async () => {
    const b = bench()
    b.create.mockResolvedValueOnce({ rpcId, result: { ok: true, value: { sessionId: MAIN } } })
    const c = b.controller()
    expect(await c.start(WS)).toMatchObject({ ok: false, error: { code: 'session-conflict' } })
    expect(b.rename).not.toHaveBeenCalled()
    expect(b.data.size).toBe(0)
  })

  it('reset forgets only browser identity and does not create or delete host history', async () => {
    const b = await ready()
    b.c.reset()
    expect(b.c.getSnapshot()).toMatchObject({ phase: 'empty', sessionId: undefined, messages: [] })
    expect(b.data.size).toBe(0)
    expect(b.list.getSnapshot().byId[DEDICATED]).toBeDefined()
    expect(b.create).toHaveBeenCalledOnce()
    expect(b.session.listeners.size).toBe(0)
  })

  it('shows authoritative asynchronous agent errors', async () => {
    const b = await ready()
    b.session.set({ ...b.session.getSnapshot(), lastAgentError: 'Provider refused the model' })
    expect(b.c.getSnapshot().error).toEqual({ code: 'agent-error', message: 'Provider refused the model' })
  })

  it('publishes root-dock sendability and explicit reveal status', async () => {
    const b = bench()
    const c = b.controller()
    expect(c.getSnapshot()).toMatchObject({ phase: 'empty', canSend: false, status: 'noSession' })
    await c.start(WS)
    expect(c.getSnapshot()).toMatchObject({ phase: 'ready', canSend: true, needsReveal: false, workspacePath: '/project' })
    expect(b.open).not.toHaveBeenCalled()
    expect(c.getSnapshot()).toMatchObject({ phase: 'ready', canSend: true, needsReveal: false })
    b.block.set({ reason: 'No model' })
    expect(c.getSnapshot()).toMatchObject({ canSend: false, blockedReason: 'No model' })
  })

  it('restore retry rechecks host identity without creating or selecting', async () => {
    const b = bench(savedAddress)
    const c = b.controller()
    expect(c.getSnapshot().phase).toBe('unavailable')
    b.publishCreated()
    expect(await c.retryRestore()).toEqual({ ok: true, sessionId: DEDICATED })
    expect(c.getSnapshot().needsReveal).toBe(false)
    expect(b.create).not.toHaveBeenCalled()
    expect(b.open).not.toHaveBeenCalled()
  })

  it('requires confirmation before forgetting the existing conversation', async () => {
    const b = await ready()
    expect(await b.c.newConversation(WS, false)).toMatchObject({ ok: false, error: { code: 'confirmation-required' } })
    expect(b.c.getSnapshot().sessionId).toBe(DEDICATED)
    expect(b.create).toHaveBeenCalledOnce()
    expect(b.data.get(ASSISTANT_STORAGE_KEY)).toBeDefined()
  })

  it('refreshes log chunks automatically only while its own session runs', async () => {
    vi.useFakeTimers()
    const b = await ready()
    const idleCalls = b.history.mock.calls.length
    await vi.advanceTimersByTimeAsync(5000)
    expect(b.history).toHaveBeenCalledTimes(idleCalls)
    b.log.events = [user(1, 'question'), chunk(2, 'par')]
    b.session.set({ ...b.session.getSnapshot(), running: true })
    await b.c.retryRestore()
    expect(b.c.getSnapshot().messages.at(-1)).toMatchObject({ text: 'par', streaming: true })
    b.log.events.push(chunk(3, 'tial'))
    await vi.advanceTimersByTimeAsync(1200)
    expect(b.c.getSnapshot().messages.at(-1)).toMatchObject({ text: 'partial', streaming: true })
    b.log.events.push(assistant(4, 'complete'), { event: { type: 'turn/end', seq: 5, time: 5, data: { turn: 1, reason: { kind: 'completed' } } } })
    b.session.set({ ...b.session.getSnapshot(), running: false })
    await b.c.retryRestore()
    expect(b.c.getSnapshot()).toMatchObject({ status: 'completed', messages: [expect.objectContaining({ text: 'question' }), expect.objectContaining({ text: 'complete', streaming: false })] })
    const doneCalls = b.history.mock.calls.length
    await vi.advanceTimersByTimeAsync(6000)
    expect(b.history).toHaveBeenCalledTimes(doneCalls)
    expect(b.open).not.toHaveBeenCalled()
    expect(b.list.getSnapshot().current).toBe(MAIN)
  })

  it('serializes concurrent refresh triggers and deduplicates repeated page events', async () => {
    vi.useFakeTimers()
    const b = await ready()
    let settle!: (value: Awaited<ReturnType<typeof b.history>>) => void
    b.history.mockImplementationOnce(() => new Promise(resolve => { settle = resolve }))
    const request = b.c.retryRestore()
    await Promise.resolve()
    const count = b.history.mock.calls.length
    b.session.set({ ...b.session.getSnapshot(), running: true })
    b.list.set({ ...b.list.getSnapshot(), byId: { ...b.list.getSnapshot().byId, [DEDICATED]: { ...b.list.getSnapshot().byId[DEDICATED]!, updatedAt: 22 } } })
    await vi.advanceTimersByTimeAsync(5000)
    expect(b.history).toHaveBeenCalledTimes(count)
    b.log.events = [user(1, 'one'), chunk(2, 'partial')]
    settle({ rpcId, result: { ok: true, value: { ...b.log } } })
    await request
    await Promise.resolve()
    expect(b.history).toHaveBeenCalledTimes(count + 1)
    expect(b.c.getSnapshot().messages.map(message => message.text)).toEqual(['one', 'partial'])
    await vi.advanceTimersByTimeAsync(1200)
    expect(b.c.getSnapshot().messages.map(message => message.text)).toEqual(['one', 'partial'])
  })

  it('refreshes on reconnect and bridges an older retained prefix without losing messages', async () => {
    const b = await ready()
    b.log.events = [user(1, 'old')]
    await b.c.retryRestore()
    b.history.mockResolvedValueOnce({ rpcId, result: { ok: true, value: { events: [assistant(4, 'new')], hasMore: true } } })
    b.history.mockResolvedValueOnce({ rpcId, result: { ok: true, value: { events: [chunk(2, 'ne'), chunk(3, 'w')], hasMore: true } } })
    b.hostDescription.set(handshake())
    await b.c.retryRestore()
    expect(b.history).toHaveBeenLastCalledWith({ sessionId: DEDICATED, beforeSeq: 4 }, expect.any(AbortSignal))
    expect(b.c.getSnapshot().messages.map(message => message.text)).toEqual(['old', 'new'])
    expect(b.open).not.toHaveBeenCalled()
  })

  it('stops automatic refresh after history failure until deliberate retry', async () => {
    vi.useFakeTimers()
    const b = await ready()
    b.session.set({ ...b.session.getSnapshot(), running: true })
    await b.c.retryRestore()
    const error = { code: 'internal' as const, message: 'history unavailable', details: {} }
    b.history.mockResolvedValueOnce({ rpcId, result: { ok: false, error } })
    expect(await b.c.retryRestore()).toEqual({ ok: false, error })
    expect(b.c.getSnapshot()).toMatchObject({ phase: 'unavailable', canSend: false, error })
    const calls = b.history.mock.calls.length
    await vi.advanceTimersByTimeAsync(6000)
    expect(b.history).toHaveBeenCalledTimes(calls)
    expect(await b.c.retryRestore()).toMatchObject({ ok: true })
    expect(b.c.getSnapshot()).toMatchObject({ phase: 'ready', canSend: true })
  })

  it('disposal aborts only its log read and ignores late read completion', async () => {
    const b = await ready()
    let settle!: (value: Awaited<ReturnType<typeof b.history>>) => void
    let signal: AbortSignal | undefined
    b.history.mockImplementationOnce((_payload, abort) => { signal = abort; return new Promise(resolve => { settle = resolve }) })
    const request = b.c.retryRestore()
    await Promise.resolve()
    const notify = vi.fn()
    b.c.subscribe(notify)
    b.c.dispose()
    expect(signal?.aborted).toBe(true)
    settle({ rpcId, result: { ok: true, value: { events: [user(1, 'late')], hasMore: false } } })
    await request
    expect(notify).not.toHaveBeenCalled()
    expect(b.c.getSnapshot().messages).toEqual([])
    expect(b.prompt).not.toHaveBeenCalled()
  })

  it('pauses the running log timer while disabled without changing host navigation', async () => {
    vi.useFakeTimers()
    const b = await ready()
    b.session.set({ ...b.session.getSnapshot(), running: true })
    await b.c.retryRestore()
    b.c.setActive(false)
    const calls = b.history.mock.calls.length
    await vi.advanceTimersByTimeAsync(6000)
    expect(b.history).toHaveBeenCalledTimes(calls)
    expect(await b.c.send('no')).toMatchObject({ ok: false, error: { code: 'disabled' } })
    b.c.setActive(true)
    await b.c.retryRestore()
    expect(b.history.mock.calls.length).toBeGreaterThan(calls)
    expect(b.open).not.toHaveBeenCalled()
  })

  it('excludes replacement copies and injected context while preserving interrupted text', async () => {
    const b = await ready()
    const replaced = user(2, 'model-only replacement')
    if (replaced.event.type === 'user/message') replaced.event.surfaceOp = { op: 'replace', start: 0, end: 1 }
    const context = user(3, 'private system context')
    if (context.event.type === 'user/message') context.event.data = { ...context.event.data, source: { kind: 'plugin', plugin: 'test' } }
    b.log.events = [user(1, 'human'), replaced, context, chunk(4, 'prefix'), { event: { type: 'turn/end', seq: 5, time: 5, data: { turn: 1, reason: { kind: 'aborted', reason: { kind: 'user' } } } } }]
    await b.c.retryRestore()
    expect(b.c.getSnapshot().messages.map(message => [message.text, message.streaming])).toEqual([['human', false], ['prefix', false]])
    expect(b.c.getSnapshot().status).toBe('stopped')
  })

  it('releases the history lock when the public provider throws synchronously', async () => {
    const b = await ready()
    b.history.mockImplementationOnce(() => { throw new Error('synchronous transport failure') })
    expect(await b.c.retryRestore()).toMatchObject({ ok: false, error: { message: 'synchronous transport failure' } })
    expect(await b.c.retryRestore()).toMatchObject({ ok: true })
    expect(b.c.getSnapshot().phase).toBe('ready')
  })

  it('pauses on connection loss and rereads before admitting another message', async () => {
    vi.useFakeTimers()
    const b = await ready()
    b.session.set({ ...b.session.getSnapshot(), running: true })
    await b.c.retryRestore()
    b.hostDescription.set(undefined)
    expect(b.c.getSnapshot()).toMatchObject({ phase: 'restoring', canSend: false })
    const calls = b.history.mock.calls.length
    await vi.advanceTimersByTimeAsync(5000)
    expect(b.history).toHaveBeenCalledTimes(calls)
    b.hostDescription.set(handshake())
    await b.c.retryRestore()
    expect(b.c.getSnapshot()).toMatchObject({ phase: 'ready', canSend: true })
    expect(b.open).not.toHaveBeenCalled()
  })

  it('does not continue creation side effects after disposal', async () => {
    const b = bench()
    let settle!: (value: Awaited<ReturnType<typeof b.create>>) => void
    b.create.mockImplementationOnce(() => new Promise(resolve => { settle = resolve }))
    const c = b.controller()
    const create = c.start(WS)
    expect(await c.start(WS)).toMatchObject({ ok: false, error: { code: 'busy' } })
    c.dispose()
    settle({ rpcId, result: { ok: true, value: { sessionId: DEDICATED } } })
    expect(await create).toMatchObject({ ok: false, error: { code: 'disposed' } })
    expect(b.rename).not.toHaveBeenCalled()
    expect(b.data.size).toBe(0)
  })
})

describe('independent integration regressions', () => {
  it('starts with a first prompt and reports rejection rather than erasing the draft', async () => {
    const b = bench()
    b.firstPrompt.mockResolvedValueOnce({ rpcId, result: { ok: false, error: { code: 'agent-busy', message: 'not accepted', details: { reason: 'fixture-refusal' } } } })
    const c = b.controller()
    expect(await c.start(WS, 'first independent message')).toMatchObject({ ok: false, error: { code: 'agent-busy' } })
    expect(b.firstPrompt).toHaveBeenCalledExactlyOnceWith({ sessionId: DEDICATED, content: [{ type: 'text', text: 'first independent message' }], mode: 'queue' })
    expect(b.list.getSnapshot().current).toBe(MAIN)
    expect(c.getSnapshot().sessionId).toBe(DEDICATED)
    expect(b.create).toHaveBeenCalledTimes(1)
  })
  it('does not create a session for a slash command or empty first message', async () => {
    const b = bench(); const c = b.controller()
    expect(await c.start(WS, '/permission')).toMatchObject({ ok: false, error: { code: 'slash' } })
    expect(await c.start(WS, '  ')).toMatchObject({ ok: false, error: { code: 'empty' } })
    expect(b.create).not.toHaveBeenCalled()
  })
  it('keeps its polling deadline through unrelated global activity', async () => {
    vi.useFakeTimers()
    const b = await ready()
    b.list.set({ ...b.list.getSnapshot(), byId: { ...b.list.getSnapshot().byId, [DEDICATED]: { ...b.list.getSnapshot().byId[DEDICATED]!, running: true } } })
    await b.c.refresh()
    const calls = b.history.mock.calls.length
    for (let i = 0; i < 4; i++) {
      await vi.advanceTimersByTimeAsync(300)
      b.workspaces.set({ ...b.workspaces.getSnapshot() })
    }
    expect(b.history.mock.calls.length).toBeGreaterThan(calls)
  })
  it('bounds missing creation publication instead of waiting forever', async () => {
    vi.useFakeTimers()
    const b = bench()
    b.rename.mockResolvedValue({ rpcId, result: { ok: true, value: { title: 'Firefly Assistant · ' + DEDICATED, seq: 1 } } })
    const c = b.controller()
    await c.start(WS, 'initial message')
    expect(c.getSnapshot().phase).toBe('restoring')
    await vi.advanceTimersByTimeAsync(10001)
    expect(c.getSnapshot()).toMatchObject({ phase: 'unavailable', error: { code: 'publication-timeout' } })
    expect(b.firstPrompt).toHaveBeenCalledTimes(1)
  })
  it('shows only authoritative list waits for an unopened cold session', async () => {
    const b = await ready()
    b.session.set({ ...b.session.getSnapshot(), pending: [{ kind: 'question' } as unknown as ReturnType<SessionFace['getSnapshot']>['pending'][number]] })
    expect(b.c.getSnapshot().pendingCount).toBe(0)
    expect(b.c.getSnapshot().canSend).toBe(true)
    b.list.set({ ...b.list.getSnapshot(), byId: { ...b.list.getSnapshot().byId, [DEDICATED]: { ...b.list.getSnapshot().byId[DEDICATED]!, pendingInteraction: 'question' } } })
    expect(b.c.getSnapshot().pendingCount).toBe(1)
    expect(b.c.getSnapshot().canSend).toBe(false)
  })
  it('normalizes preflight provider exceptions and allows explicit recovery', async () => {
    const b = bench(); const c = b.controller()
    const spy = vi.spyOn(b.workspaces, 'getSnapshot').mockImplementationOnce(() => { throw new Error('provider preflight failed') })
    expect(await c.start(WS, 'task')).toMatchObject({ ok: false, error: { message: 'provider preflight failed' } })
    spy.mockRestore()
    c.reset()
    expect(await c.start(WS, 'task')).toMatchObject({ ok: true })
  })
})
