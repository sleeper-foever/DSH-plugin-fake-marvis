import type { ClientContext, ObservableSnapshot, SessionFace, SessionId, WorkspaceId, WorkspaceView } from '@deepseek-ai/dsh-client-runtime/client';
import type { ConnectionHandle } from '@deepseek-ai/dsh-client-connection/client';
import type { FireflyStatus } from './status.ts';
/** Browser persistence contains addresses only; conversation content remains on the host. */
export declare const ASSISTANT_STORAGE_KEY = "dsh.firefly.assistant.session.v1";
/** Host and local failures share a plain-text diagnostic without losing host details. */
export interface AssistantError {
    code: string;
    message: string;
    details?: unknown;
}
/** Acceptance is queue admission, not completion of an assistant turn. */
export type AssistantResult = {
    ok: true;
    sessionId?: SessionId;
} | {
    ok: false;
    error: AssistantError;
};
/** Plain text projected from authoritative user/assistant nodes; never an optimistic history. */
export interface AssistantMessage {
    id: string;
    role: 'user' | 'assistant';
    text: string;
    streaming: boolean;
    pending?: boolean;
}
/** UI state for one independently addressed host session. */
export interface AssistantSnapshot {
    phase: 'empty' | 'restoring' | 'creating' | 'ready' | 'unavailable';
    status: FireflyStatus;
    canSend: boolean;
    blockedReason: string | undefined;
    needsReveal: boolean;
    workspacePath: string | undefined;
    modelLabel: string | undefined;
    permissionLabel: string;
    workspaceId: WorkspaceId | undefined;
    workspace: WorkspaceView | undefined;
    workspaces: readonly WorkspaceView[];
    sessionId: SessionId | undefined;
    messages: readonly AssistantMessage[];
    running: boolean;
    sending: boolean;
    pendingCount: number;
    queuedCount: number;
    hasMore: boolean;
    loadingOlder: boolean;
    preset: string | undefined;
    model: string | undefined;
    /** The plugin never copies or overrides the main session's permissions. */
    permissions: 'host-session-settings';
    error: AssistantError | undefined;
    storageError: boolean;
}
/** Only the public host operations used by the controller, suitable for typed fixtures. */
export interface AssistantServices {
    sessions: Pick<ClientContext['sessions'], 'list' | 'open'> & {
        binding(id: SessionId): {
            session: SessionFace;
        } | undefined;
    };
    workspaces: Pick<ClientContext['workspaces'], 'list'>;
    connection: Pick<ConnectionHandle, 'hostDescription'> & {
        api: {
            sessions: Pick<ConnectionHandle['api']['sessions'], 'create' | 'rename' | 'history' | 'prompt'>;
        };
    };
    conversation: {
        blocks: {
            storeFor(id: SessionId): ObservableSnapshot<{
                readonly reason: string;
            } | undefined>;
        };
    };
}
/** Storage access can be unavailable under browser privacy policies. */
export type AssistantStorage = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;
/** Running-session log refresh interval; each read is serialized and never invokes the model. */
export interface AssistantOptions {
    historyRefreshMs?: number;
    publicationTimeoutMs?: number;
}
/**
 * Owns an independent session address, not the main selection or composer. History
 * uses the public host history API, including while the runtime SessionFace is cold.
 * One serialized log refresh timer runs only while this assistant is running.
 */
export declare class AssistantController implements ObservableSnapshot<AssistantSnapshot> {
    private readonly services;
    private readonly storage;
    private readonly listeners;
    private readonly disposers;
    private sessionDispose;
    private blockDispose;
    private face;
    private address;
    private selected;
    private disposed;
    private active;
    private starting;
    private sending;
    private loadingOlder;
    private invalid;
    private awaitingPublication;
    private publicationTimer;
    private historyError;
    private error;
    private storageError;
    private snapshot;
    private entries;
    private history;
    private historyReady;
    private historyFailed;
    private historyHasMore;
    private historyRead;
    private historyAbort;
    private generation;
    private refreshQueued;
    private refreshTimer;
    private signature;
    private permissionLabel;
    private readonly refreshMs;
    private readonly publicationTimeoutMs;
    /** @param services - Existing host services; no connection pump is started. @param storage - Browser address storage, or null. */
    constructor(services: AssistantServices, storage: AssistantStorage | null, options?: AssistantOptions);
    getSnapshot: () => AssistantSnapshot;
    subscribe: (listener: () => void) => (() => void);
    /** Pause background log reads while the plugin is disabled; accepted host work is never cancelled. @param active - Whether Firefly is enabled. */
    setActive(active: boolean): void;
    /** Choose a workspace without creating a host session or changing main navigation. @param id - Explicit workspace choice. */
    selectWorkspace(id: WorkspaceId): void;
    /** Create a fresh real host session using host defaults, never a reusable blank. @param workspaceId - Explicit workspace. @returns Creation result without automatic retries. */
    start(workspaceId: WorkspaceId, firstMessage?: string): Promise<AssistantResult>;
    private startOperation;
    /** Revalidate the saved identity against the current host baseline, without reconnecting or creating. @returns Address validation result. */
    /** Explicit log reload; does not create sessions or retry prompts. */
    refresh(): Promise<AssistantResult>;
    retryRestore(): Promise<AssistantResult>;
    private restoreOperation;
    /** Replace the browser attachment only after the caller confirms; existing host history is retained. @param workspaceId - Explicit workspace. @param confirmed - User confirmed creating another conversation. @returns New session creation result. */
    newConversation(workspaceId: WorkspaceId, confirmed: boolean): Promise<AssistantResult>;
    /** Forget the browser address without deleting host history; a new start still needs a user action. */
    reset(): void;
    /** Enqueue verbatim plain text via SessionFace.prompt. @param text - User draft, never copied from the main composer. @returns Queue receipt or structured refusal. */
    send(text: string): Promise<AssistantResult>;
    private sendOperation;
    /** Extend the dedicated session's authoritative history window. @returns Completion or refusal; no polling or retries. */
    loadOlder(): Promise<AssistantResult>;
    private olderOperation;
    /** Explicit user navigation is the only action allowed to change the main selection. */
    reveal(): void;
    /** Detach listeners; host history and accepted agent work remain owned by DSH. */
    dispose(): void;
    private workspace;
    private baselinesReady;
    private sync;
    private reconcile;
    private clearHistory;
    private isRunning;
    private scheduleRefresh;
    private requestRefresh;
    private readHistory;
    private buildSnapshot;
    private publish;
    private refuse;
    private fail;
}
