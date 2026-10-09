import type { ConversationSnapshot, SessionId, SessionListState, SessionSummary, WorkspaceListState } from '@deepseek-ai/dsh-client-runtime/client'

export const A = 'firefly-session-a' as SessionId
export const B = 'firefly-session-b' as SessionId

export function snapshot(patch: Partial<ConversationSnapshot> = {}): ConversationSnapshot {
  return {
    sessionId: A, views: { get: () => undefined },
    chat: { order: [], nodes: { get: () => undefined, values: () => [] },
      locations: { getTurn: () => [], getStep: () => [] }, timeline: { turnOrder: [], turns: new Map() },
      legacy: { nodes: [], turnTimings: new Map(), turnEnds: new Map(), partial: null, runningCalls: [] } },
    nodes: [], turnTimings: new Map(), turnEnds: new Map(), partial: null, runningCalls: [],
    pending: [], queue: [], running: false, composerPhase: 'active', removed: false,
    openState: 'open', openError: null, hasMore: false, loadingOlder: false, promptError: null,
    blank: false, subagent: null, lastAgentError: null, ...patch,
  }
}

export function summary(id = A): SessionSummary {
  return { id, displayTitle: id === A ? 'Firefly MVP' : 'Second conversation', cwd: '/workspace/firefly', running: false, blank: false, updatedAt: 1 }
}

export function listState(): SessionListState {
  return { ids: [A, B], byId: { [A]: summary(A), [B]: summary(B) }, current: A, phase: 'ready',
    subagentsByParent: {}, jobsBySession: {}, currentAddress: undefined }
}

export function workspaceState(): WorkspaceListState {
  return { items: [], archivedSessionIds: [], state: 'idle', phase: 'ready', error: null,
    baselinesReady: true, recentWorkspaceId: undefined }
}
