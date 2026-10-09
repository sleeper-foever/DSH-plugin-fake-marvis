import type { Position } from './position.ts'

/** Browser-local preferences; task text and session data are never persisted here. */
export interface Preferences extends Position {
  enabled: boolean
}

/** Immutable preference snapshot consumed by React. */
export interface PreferencesSnapshot {
  values: Readonly<Preferences>
  storageUnavailable: boolean
}

/** Storage key scoped to this plugin and origin. */
export const STORAGE_KEY = 'dsh.firefly-assistant.v1'

/** Minimal storage interface for browser persistence and keyless tests. */
export interface PreferenceStorage {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
}

function decode(raw: string | null, defaults: Preferences): Preferences {
  if (raw === null) return { ...defaults }
  const value: unknown = JSON.parse(raw)
  if (typeof value !== 'object' || value === null || Array.isArray(value)) throw new Error('Invalid Firefly preferences')
  const record = value as Record<string, unknown>
  if (record.version !== 1 || typeof record.enabled !== 'boolean'
    || typeof record.right !== 'number' || !Number.isFinite(record.right) || record.right < 0
    || typeof record.bottom !== 'number' || !Number.isFinite(record.bottom) || record.bottom < 0) {
    throw new Error('Invalid Firefly preferences')
  }
  return { enabled: record.enabled, right: record.right, bottom: record.bottom }
}

/**
 * Preference store with an in-memory fallback for denied or corrupt browser storage.
 * @param storage - Browser storage, or null when the browser denies access.
 * @param defaults - Validated deployment defaults.
 */
export class PreferencesStore {
  private snapshot: PreferencesSnapshot
  private readonly listeners = new Set<() => void>()

  constructor(private readonly storage: PreferenceStorage | null, private readonly defaults: Preferences) {
    let values = { ...defaults }
    let storageUnavailable = storage === null
    if (storage !== null) {
      try {
        values = decode(storage.getItem(STORAGE_KEY), defaults)
      } catch {
        // Browser policy, quota, or invalid persisted JSON must not hide the launcher.
        storageUnavailable = true
      }
    }
    this.snapshot = { values, storageUnavailable }
  }

  /** @returns The cached snapshot; identity changes only when preferences change. */
  getSnapshot = (): PreferencesSnapshot => this.snapshot

  /**
   * Subscribe to preference changes.
   * @param listener - Synchronous render notification.
   * @returns The listener disposer.
   */
  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener)
    return () => { this.listeners.delete(listener) }
  }

  /**
   * Persist a partial preference edit without changing task permissions.
   * @param patch - New visibility or position values.
   */
  update(patch: Partial<Preferences>): void {
    const values = { ...this.snapshot.values, ...patch }
    if (values.enabled === this.snapshot.values.enabled && values.right === this.snapshot.values.right
      && values.bottom === this.snapshot.values.bottom) return
    let storageUnavailable = this.storage === null
    if (this.storage !== null) {
      try {
        this.storage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, ...values }))
      } catch {
        // A blocked or full localStorage leaves this tab usable without persistence.
        storageUnavailable = true
      }
    }
    this.snapshot = { values, storageUnavailable }
    for (const listener of this.listeners) listener()
  }

  /** Restore the configured position without changing the visibility preference. */
  resetPosition(): void {
    this.update({ right: this.defaults.right, bottom: this.defaults.bottom })
  }
}
