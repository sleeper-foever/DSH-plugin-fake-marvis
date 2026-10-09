import { defineStore } from '@deepseek-ai/dsh-client-runtime/client'

/** Versioned in-memory draft, independent of the main conversation composer. */
export interface Draft { text: string; revision: number }

/** @returns The root-owned panel state; message history belongs to DSH, never this store. */
export function createViewStore() {
  return defineStore({
    init: () => ({ expanded: false, draft: { text: '', revision: 0 } as Draft }),
    actions: {
      expand(state, expanded: boolean) { state.expanded = expanded },
      editDraft(state, text: string) { state.draft = { text, revision: state.draft.revision + 1 } },
      accepted(state, revision: number) {
        if (state.draft.revision === revision) state.draft = { text: '', revision: revision + 1 }
      },
    },
  })
}
