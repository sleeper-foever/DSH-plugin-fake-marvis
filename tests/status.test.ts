import { describe, expect, it } from 'vitest'
import type { ConversationSnapshot, PendingInteraction, QueuedMessage, TurnLocation } from '@deepseek-ai/dsh-client-runtime/client'
import { sessionStatus } from '../src/client/status.ts'
import type { FireflyStatus } from '../src/client/status.ts'
import { snapshot, summary } from './fixtures.ts'

type Reason = NonNullable<TurnLocation['end']>['data']['reason']

function turn(number: number, reason?: Reason): TurnLocation {
  return { turn: number, start: undefined,
    end: reason === undefined ? undefined : { type: 'turn/end', seq: number, time: number, data: { turn: number, reason } },
    status: reason === undefined ? 'open' : 'closed', steps: [], data: { get: () => undefined } }
}

function history(...turns: TurnLocation[]): ConversationSnapshot {
  const base = snapshot()
  return { ...base, chat: { ...base.chat, timeline: { turnOrder: turns.map(item => item.turn), turns: new Map(turns.map(item => [item.turn, item])) } } }
}

const queued: QueuedMessage = {
  id: 'queued-1' as QueuedMessage['id'], messageId: 'message-1' as QueuedMessage['messageId'],
  placement: 'queued', content: [{ type: 'text', text: 'next task' }], preview: 'next task', text: 'next task',
}
// Status reads only the immutable kind; no response carrier or private PendingWait state is exercised.
const question = (): PendingInteraction => ({ kind: 'question' } as PendingInteraction)
const approval = (): PendingInteraction => ({ kind: 'approval' } as PendingInteraction)

describe('current-session status', () => {
  it('requires a selected summary and an open available history', () => {
    expect(sessionStatus(snapshot(), undefined)).toBe('noSession')
    expect(sessionStatus(undefined, summary())).toBe('loading')
    expect(sessionStatus(snapshot({ openState: 'loading' }), summary())).toBe('loading')
    expect(sessionStatus(snapshot({ removed: true }), summary())).toBe('unavailable')
    expect(sessionStatus(snapshot({ openState: 'error' }), summary())).toBe('unavailable')
  })

  it.each(['question', 'approval', 'plan-review'] as const)('prioritizes the %s summary over running, queue and old completion', kind => {
    const session = { ...history(turn(1, { kind: 'completed' })), running: true, queue: [queued] }
    expect(sessionStatus(session, { ...summary(), pendingInteraction: kind })).toBe(kind === 'plan-review' ? 'review' : kind)
  })

  it('prioritizes concrete pending questions over approval and live work', () => {
    const session = { ...history(turn(1, { kind: 'completed' })), running: true, queue: [queued], pending: [approval(), question()] }
    expect(sessionStatus(session, summary())).toBe('question')
    expect(sessionStatus({ ...session, pending: [approval()] }, summary())).toBe('approval')
    expect(sessionStatus(session, { ...summary(), pendingInteraction: 'plan-review' })).toBe('review')
  })

  it('prioritizes running then queued work over an earlier completed turn and stale error', () => {
    const session = { ...history(turn(1, { kind: 'completed' })), running: true, queue: [queued], lastAgentError: 'earlier error' }
    expect(sessionStatus(session, summary())).toBe('running')
    expect(sessionStatus({ ...session, running: false }, summary())).toBe('queued')
    expect(sessionStatus({ ...session, running: false, queue: [] }, summary())).toBe('failed')
  })

  const terminal: [Reason, FireflyStatus][] = [
    [{ kind: 'completed' }, 'completed'],
    [{ kind: 'error', error: { code: 'UNKNOWN', message: 'provider failed' } }, 'failed'],
    [{ kind: 'aborted', reason: { kind: 'legacy' } }, 'stopped'],
    [{ kind: 'interrupted' }, 'stopped'],
    [{ kind: 'max-tokens' }, 'limited'],
    [{ kind: 'blocked' }, 'blocked'],
  ]
  it.each(terminal)('maps actual terminal reason %j to %s', (reason, expected) => {
    expect(sessionStatus(history(turn(1, reason)), summary())).toBe(expected)
  })

  it('uses the last ordered turn rather than an older completion or map insertion order', () => {
    const base = history(turn(1, { kind: 'completed' }), turn(2, { kind: 'blocked' }))
    const turns = new Map([...base.chat.timeline.turns].reverse())
    expect(sessionStatus({ ...base, chat: { ...base.chat, timeline: { turnOrder: [1, 2], turns } } }, summary())).toBe('blocked')
    expect(sessionStatus(history(turn(1, { kind: 'completed' }), turn(2)), summary())).toBe('idle')
  })

  it('never infers completion from a summary flag or an unknown terminal reason', () => {
    const completedSummary = { ...summary(), completed: true }
    expect(sessionStatus(snapshot(), completedSummary)).toBe('idle')
    expect(sessionStatus(history(turn(1)), completedSummary)).toBe('idle')
    // Future plugin-defined reasons cross the merge-extensible event boundary.
    expect(sessionStatus(history(turn(1, { kind: 'future-plugin-reason' } as unknown as Reason)), completedSummary)).toBe('idle')
  })
})
