import type { ConversationSnapshot, SessionSummary } from '@deepseek-ai/dsh-client-runtime/client'

/** Current-session status, not a completion assertion about one Firefly request. */
export type FireflyStatus = 'noSession' | 'loading' | 'unavailable' | 'question' | 'approval' | 'review'
  | 'running' | 'queued' | 'idle' | 'completed' | 'failed' | 'stopped' | 'limited' | 'blocked'

/**
 * Prefer live work and interactions over any earlier turn outcome.
 * @param session - Current session history snapshot.
 * @param summary - Selected row, including its pending-interaction indicator.
 * @returns The status to display on the launcher and panel.
 */
export function sessionStatus(session: ConversationSnapshot | undefined, summary: SessionSummary | undefined): FireflyStatus {
  if (summary === undefined) return 'noSession'
  if (session?.removed || session?.openState === 'error') return 'unavailable'
  if (session === undefined || session.openState !== 'open') return 'loading'
  if (summary.pendingInteraction === 'plan-review') return 'review'
  if (session.pending.some(wait => wait.kind === 'question') || summary.pendingInteraction === 'question') return 'question'
  if (session.pending.some(wait => wait.kind === 'approval') || summary.pendingInteraction === 'approval') return 'approval'
  if (session.running) return 'running'
  if (session.queue.length > 0) return 'queued'
  if (session.lastAgentError !== null) return 'failed'
  const timeline = session.chat.timeline
  const turn = timeline.turnOrder.at(-1)
  const reason = turn === undefined ? undefined : timeline.turns.get(turn)?.end?.data.reason
  switch (reason?.kind) {
    case 'completed': return 'completed'
    case 'error': return 'failed'
    case 'aborted':
    case 'interrupted': return 'stopped'
    case 'max-tokens': return 'limited'
    case 'blocked': return 'blocked'
    // Other plugins may add turn reasons; unknown reasons must not imply success.
    default: return 'idle'
  }
}
