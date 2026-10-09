import { describe, expect, it, vi } from 'vitest'
import { PreferencesStore, STORAGE_KEY } from '../src/client/preferences.ts'

const defaults = { enabled: true, right: 24, bottom: 80 }

function storage(raw: string | null = null) {
  return { getItem: vi.fn(() => raw), setItem: vi.fn() }
}

describe('browser preferences', () => {
  it('uses defaults without writing merely on startup', () => {
    const disk = storage()
    const store = new PreferencesStore(disk, defaults)
    expect(store.getSnapshot().values).toEqual(defaults)
    expect(store.getSnapshot()).toBe(store.getSnapshot())
    expect(disk.setItem).not.toHaveBeenCalled()
  })
  it('restores position and hidden state from this plugin key', () => {
    const saved = { enabled: false, right: 1954, bottom: 65 }
    const disk = storage(JSON.stringify({ version: 1, ...saved }))
    expect(new PreferencesStore(disk, defaults).getSnapshot().values).toEqual(saved)
    expect(disk.getItem).toHaveBeenCalledWith(STORAGE_KEY)
  })
  it.each(['bad-json', 'null', '[]', '{}', '{"version":2}', '{"version":1,"enabled":true,"right":-1,"bottom":8}', '{"version":1,"enabled":true,"right":1e400,"bottom":8}'])('ignores invalid local preferences: %s', raw => {
    const snapshot = new PreferencesStore(storage(raw), defaults).getSnapshot()
    expect(snapshot.values).toEqual(defaults)
    expect(snapshot.storageUnavailable).toBe(true)
  })
  it('continues in memory if browser storage is unavailable', () => {
    const store = new PreferencesStore(null, defaults)
    store.update({ enabled: false })
    expect(store.getSnapshot().values.enabled).toBe(false)
    expect(store.getSnapshot().storageUnavailable).toBe(true)
  })
  it('notifies once per change and releases subscribers', () => {
    const disk = storage()
    const store = new PreferencesStore(disk, defaults)
    const listener = vi.fn()
    const unsubscribe = store.subscribe(listener)
    store.update({ right: 40 })
    store.update({ right: 40 })
    expect(listener).toHaveBeenCalledTimes(1)
    expect(disk.setItem).toHaveBeenCalledWith(STORAGE_KEY, JSON.stringify({ version: 1, enabled: true, right: 40, bottom: 80 }))
    unsubscribe()
    store.update({ bottom: 30 })
    expect(listener).toHaveBeenCalledTimes(1)
  })
  it('reset restores deployment position while retaining visibility', () => {
    const store = new PreferencesStore(storage(), defaults)
    store.update({ enabled: false, right: 1954, bottom: 120 })
    store.resetPosition()
    expect(store.getSnapshot().values).toEqual({ ...defaults, enabled: false })
  })
  it('reports write failure and recovers on a later successful save', () => {
    const disk = storage()
    disk.setItem.mockImplementationOnce(() => { throw new Error('QuotaExceededError') })
    const store = new PreferencesStore(disk, defaults)
    store.update({ right: 40 })
    expect(store.getSnapshot().storageUnavailable).toBe(true)
    store.update({ right: 48 })
    expect(store.getSnapshot().storageUnavailable).toBe(false)
  })
  it('handles a read denied by browser policy', () => {
    const disk = storage()
    disk.getItem.mockImplementation(() => { throw new Error('SecurityError') })
    expect(new PreferencesStore(disk, defaults).getSnapshot().storageUnavailable).toBe(true)
  })
})
