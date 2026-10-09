import type { ConversationSnapshot, SessionSummary } from '@deepseek-ai/dsh-client-runtime/client';
/** Current-session status, not a completion assertion about one Firefly request. */
export type FireflyStatus = 'noSession' | 'loading' | 'unavailable' | 'question' | 'approval' | 'review' | 'running' | 'queued' | 'idle' | 'completed' | 'failed' | 'stopped' | 'limited' | 'blocked';
/**
 * Prefer live work and interactions over any earlier turn outcome.
 * @param session - Current session history snapshot.
 * @param summary - Selected row, including its pending-interaction indicator.
 * @returns The status to display on the launcher and panel.
 */
export declare function sessionStatus(session: ConversationSnapshot | undefined, summary: SessionSummary | undefined): FireflyStatus;
