/** Versioned in-memory draft, independent of the main conversation composer. */
export interface Draft {
    text: string;
    revision: number;
}
/** @returns The root-owned panel state; message history belongs to DSH, never this store. */
export declare function createViewStore(): import("@deepseek-ai/dsh-client-runtime/client").EngineStoreHandle<{
    expanded: boolean;
    draft: Draft;
}, {
    expand(state: {
        expanded: boolean;
        draft: Draft;
    }, expanded: boolean): void;
    editDraft(state: {
        expanded: boolean;
        draft: Draft;
    }, text: string): void;
    accepted(state: {
        expanded: boolean;
        draft: Draft;
    }, revision: number): void;
}>;
