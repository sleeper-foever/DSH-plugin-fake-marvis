import type { Position } from './position.ts';
/** Browser-local preferences; task text and session data are never persisted here. */
export interface Preferences extends Position {
    enabled: boolean;
}
/** Immutable preference snapshot consumed by React. */
export interface PreferencesSnapshot {
    values: Readonly<Preferences>;
    storageUnavailable: boolean;
}
/** Storage key scoped to this plugin and origin. */
export declare const STORAGE_KEY = "dsh.firefly-assistant.v1";
/** Minimal storage interface for browser persistence and keyless tests. */
export interface PreferenceStorage {
    getItem(key: string): string | null;
    setItem(key: string, value: string): void;
}
/**
 * Preference store with an in-memory fallback for denied or corrupt browser storage.
 * @param storage - Browser storage, or null when the browser denies access.
 * @param defaults - Validated deployment defaults.
 */
export declare class PreferencesStore {
    private readonly storage;
    private readonly defaults;
    private snapshot;
    private readonly listeners;
    constructor(storage: PreferenceStorage | null, defaults: Preferences);
    /** @returns The cached snapshot; identity changes only when preferences change. */
    getSnapshot: () => PreferencesSnapshot;
    /**
     * Subscribe to preference changes.
     * @param listener - Synchronous render notification.
     * @returns The listener disposer.
     */
    subscribe: (listener: () => void) => (() => void);
    /**
     * Persist a partial preference edit without changing task permissions.
     * @param patch - New visibility or position values.
     */
    update(patch: Partial<Preferences>): void;
    /** Restore the configured position without changing the visibility preference. */
    resetPosition(): void;
}
