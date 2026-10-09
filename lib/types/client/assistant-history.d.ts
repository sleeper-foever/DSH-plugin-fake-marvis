import type { HistoryEntry } from '@deepseek-ai/dsh-client-connection/client';
import type { AssistantMessage } from './assistant-controller.ts';
import type { FireflyStatus } from './status.ts';
/** Plain chat and latest durable outcome from a seq-deduplicated host log window. */
export interface AssistantHistoryView {
    messages: readonly AssistantMessage[];
    status: FireflyStatus;
    error?: string;
    model?: string;
}
/**
 * Project plain human/assistant text only. Replacement copies and injected context
 * are model material, not extra human messages. Chunk text is superseded by its commit.
 * @param entries - Authoritative history pages merged by event seq.
 * @returns Chat text and durable turn outcome; no model requests or optimistic messages.
 */
export declare function projectAssistantHistory(entries: readonly HistoryEntry[]): AssistantHistoryView;
