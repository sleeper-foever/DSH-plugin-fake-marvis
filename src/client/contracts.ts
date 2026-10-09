import type { ObservableSnapshot, WorkspaceId } from '@deepseek-ai/dsh-client-runtime/client'
import type { InjectFace, PropsLocale, PropsRuntime, PropsStore } from '@deepseek-ai/dsh-client-ui-slots'
import type {} from '@deepseek-ai/dsh-client-ui-layout/client'
import type {} from '@deepseek-ai/dsh-client-ui-settings/client'
import type { PreferencesSnapshot } from './preferences.ts'
import type { Position } from './position.ts'
import type { AssistantSnapshot } from './assistant-controller.ts'
import type { createViewStore, Draft } from './view-store.ts'
import type {} from './locales.ts'

/** Browser-only preferences; no DSH permission mutation is exposed. */
export interface PreferencesInjected {
  hooks: { preferences: ObservableSnapshot<PreferencesSnapshot> }
  setEnabled: (enabled: boolean) => void
  setPosition: (position: Position) => void
  resetPosition: () => void
}

/** Only explicit gestures create a session or submit a message. */
export interface AssistantActions {
  startChat: (workspaceId: WorkspaceId, draft: Draft) => Promise<void>
  sendMessage: (draft: Draft) => Promise<void>
  reveal: () => void
  refresh: () => void
  loadOlder: () => void
  resetChat: () => void
  selectWorkspace: (id: WorkspaceId) => void
}

/** Root-scoped hooks stay bound to the dedicated assistant regardless of main navigation. */
export interface AssistantInjected extends PreferencesInjected, AssistantActions {
  hooks: PreferencesInjected['hooks'] & { assistant: ObservableSnapshot<AssistantSnapshot> }
}

/** Framework-owned root store and private observable hook seats. */
export type OverlayProps = PropsRuntime<'shell.overlay'> & PropsLocale<'firefly-assistant'>
  & PropsStore<ReturnType<typeof createViewStore>> & InjectFace<AssistantInjected>

/** Pure presentation input; no global/session contexts or service objects reach the dock. */
export type DockProps = PropsLocale<'firefly-assistant'> & AssistantActions & {
  assistant: AssistantSnapshot
  preferences: PreferencesSnapshot
  expanded: boolean
  draft: Draft
  setExpanded: (expanded: boolean) => void
  editDraft: (text: string) => void
  setPosition: (position: Position) => void
}

/** Settings remain available when the floating interface is hidden. */
export type SettingsProps = PropsRuntime<'settings.general.item'> & PropsLocale<'firefly-assistant'> & InjectFace<PreferencesInjected>
