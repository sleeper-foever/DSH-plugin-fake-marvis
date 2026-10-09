import type { HistoryEntry, SessionEvent } from '@deepseek-ai/dsh-client-connection/client'
import type { AssistantMessage } from './assistant-controller.ts'
import type { FireflyStatus } from './status.ts'

/** Plain chat and latest durable outcome from a seq-deduplicated host log window. */
export interface AssistantHistoryView { messages: readonly AssistantMessage[]; status: FireflyStatus; error?: string; model?: string }

/**
 * Project plain human/assistant text only. Replacement copies and injected context
 * are model material, not extra human messages. Chunk text is superseded by its commit.
 * @param entries - Authoritative history pages merged by event seq.
 * @returns Chat text and durable turn outcome; no model requests or optimistic messages.
 */
export function projectAssistantHistory(entries: readonly HistoryEntry[]): AssistantHistoryView {
  const rows = new Map<string, AssistantMessage & { seq: number; turn?: number; blocks?: Map<number, string> }>()
  let status: FireflyStatus = 'idle'
  let error: string | undefined
  let model: string | undefined
  for (const { event } of entries) {
    switch (event.type) {
      case 'user/message':
        if (event.surfaceOp === 'append' && event.data.source.kind === 'user') rows.set('user:' + event.data.id, {
          id: 'user:' + event.data.id, seq: event.seq, role: 'user', streaming: false,
          text: event.data.content.flatMap(block => block.type === 'text' ? [block.text] : []).join(''),
        })
        break
      case 'assistant/chunk': {
        const key = 'assistant:' + event.data.turn + ':' + event.data.step
        let row = rows.get(key)
        if (!row) { row = { id: key, seq: event.seq, turn: event.data.turn, role: 'assistant', text: '', streaming: true, pending: true, blocks: new Map() }; rows.set(key, row) }
        const chunk = event.data.chunk
        if (chunk.type === 'block-start') row.blocks?.set(chunk.index, '')
        if (chunk.type === 'text-delta') row.blocks?.set(chunk.index, (row.blocks.get(chunk.index) ?? '') + chunk.text)
        if (chunk.type === 'block-end') row.blocks?.set(chunk.index, chunk.block.type === 'text' ? chunk.block.text : '')
        row.text = [...(row.blocks ?? [])].sort(([a], [b]) => a - b).map(([, text]) => text).join('')
        break
      }
      case 'assistant/message': {
        if (event.surfaceOp !== 'append') break
        model = event.data.message.source.model
        const key = 'assistant:' + event.data.turn + ':' + event.data.step
        rows.set(key, { id: key, seq: event.seq, turn: event.data.turn, role: 'assistant', streaming: false,
          text: event.data.message.content.flatMap(block => block.type === 'text' ? [block.text] : []).join('') })
        break
      }
      case 'llm/retry':
        rows.delete('assistant:' + event.data.turn + ':' + event.data.step)
        break
      case 'turn/start':
        status = 'running'
        error = undefined
        break
      case 'turn/end':
        for (const row of rows.values()) if (row.turn === event.data.turn) { row.streaming = false; row.pending = false }
        status = endStatus(event.data.reason)
        if (event.data.reason.kind === 'error') error = event.data.reason.error.message
        break
      default:
        // Tool activity, reasoning, context, and extension events stay in the main transcript.
        break
    }
  }
  return { messages: [...rows.values()].sort((a, b) => a.seq - b.seq)
    .filter(row => row.text !== '').map(({ id, role, text, streaming, pending }) => ({ id, role, text, streaming, pending })), status, error, model }
}
function endStatus(reason: SessionEvent<'turn/end'>['data']['reason']): FireflyStatus {
  switch (reason.kind) {
    case 'completed': return 'completed'
    case 'error': return 'failed'
    case 'aborted': case 'interrupted': return 'stopped'
    case 'max-tokens': return 'limited'
    case 'blocked': return 'blocked'
    default: return 'idle'
  }
}
