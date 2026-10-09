import { describe, expect, it, vi } from 'vitest'
import { createViewStore } from '../src/client/view-store.ts'

describe('independent root view state', () => {
  it('holds only one memory-only draft and panel expansion, never history or session addresses', () => {
    const write = vi.spyOn(Storage.prototype, 'setItem')
    const store = createViewStore().create()
    expect(store.getSnapshot()).toEqual({ expanded: false, draft: { text: '', revision: 0 } })
    store.actions.editDraft('private message')
    store.actions.expand(true)
    store.actions.expand(false)
    expect(store.getSnapshot()).toEqual({ expanded: false, draft: { text: 'private message', revision: 1 } })
    expect(createViewStore().spec.persist).toBeUndefined()
    expect(write).not.toHaveBeenCalled()
  })
  it('clears only the exact accepted revision and ignores stale or duplicate receipts', () => {
    const store = createViewStore().create()
    store.actions.editDraft('first')
    store.actions.editDraft('newer text')
    store.actions.accepted(1)
    expect(store.getSnapshot().draft).toEqual({ text: 'newer text', revision: 2 })
    store.actions.accepted(2)
    expect(store.getSnapshot().draft).toEqual({ text: '', revision: 3 })
    store.actions.accepted(2)
    expect(store.getSnapshot().draft.revision).toBe(3)
    store.actions.editDraft('next message')
    store.actions.accepted(3)
    expect(store.getSnapshot().draft).toEqual({ text: 'next message', revision: 4 })
  })
  it('does not share draft or expansion between plugin instances', () => {
    const one = createViewStore().create()
    const two = createViewStore().create()
    one.actions.editDraft('private draft')
    one.actions.expand(true)
    expect(two.getSnapshot()).toEqual({ expanded: false, draft: { text: '', revision: 0 } })
  })
})
