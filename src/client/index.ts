import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client'
import type { ConnectionHandle } from '@deepseek-ai/dsh-client-connection/client'
import type {} from '@deepseek-ai/dsh-client-locale/client'
import type {} from '@deepseek-ai/dsh-client-ui-conversation/client'
import type {} from '@deepseek-ai/dsh-client-ui-layout/client'
import type {} from '@deepseek-ai/dsh-client-ui-settings/client'
import { Config, type Config as FireflyConfig } from '../config.ts'
import { FireflyOverlay } from './FireflyOverlay.tsx'
import { FireflySettings } from './FireflySettings.tsx'
import { AssistantController, type AssistantStorage } from './assistant-controller.ts'
import { createViewStore } from './view-store.ts'
import { PreferencesStore } from './preferences.ts'
import type { AssistantInjected, PreferencesInjected } from './contracts.ts'
import { en, zh } from './locales.ts'
import stylesheet from './firefly.css?inline'

export { Config }

/** Existing DSH services; the assistant owns neither a transport nor a model provider. */
export const inject = ['slots', 'sessions', 'conversation', 'workspaces', 'locale', 'connection']

/**
 * Register the independent assistant and its browser-local visibility controls.
 * @param ctx - Browser plugin context supplied by DSH.
 * @param config - Validated browser defaults.
 */
export function apply(ctx: ClientContext, config: FireflyConfig): void {
  let storage: AssistantStorage | null
  try { storage = window.localStorage }
  catch { storage = null /* Browser privacy policy can deny the storage accessor. */ }
  const preferences = new PreferencesStore(storage, {
    enabled: config.enabled, right: config.defaultRight, bottom: config.defaultBottom,
  })
  const controller = new AssistantController({
    sessions: ctx.sessions, workspaces: ctx.workspaces, conversation: ctx.conversation,
    connection: ctx.get('connection') as ConnectionHandle,
  }, storage, { historyRefreshMs: config.historyRefreshMs, publicationTimeoutMs: config.publicationTimeoutMs })
  ctx.effect(() => {
    controller.setActive(preferences.getSnapshot().values.enabled)
    return preferences.subscribe(() => { controller.setActive(preferences.getSnapshot().values.enabled) })
  }, 'firefly: visibility lifetime')
  const viewStore = createViewStore()
  let active = true
  let submitting = false
  const preferenceFace: PreferencesInjected = {
    hooks: { preferences },
    setEnabled: enabled => { preferences.update({ enabled }) },
    setPosition: position => { preferences.update(position) },
    resetPosition: () => { preferences.resetPosition() },
  }
  ctx.effect(() => {
    const style = document.createElement('style')
    style.dataset.plugin = 'dsh-firefly-assistant'
    style.textContent = stylesheet
    document.head.appendChild(style)
    return () => { active = false; controller.dispose(); style.remove() }
  }, 'firefly: controller and styles')
  ctx.effect(() => {
    const zhDispose = ctx.locale.register('firefly-assistant', 'zh', zh)
    const enDispose = ctx.locale.register('firefly-assistant', 'en', en)
    return () => { enDispose(); zhDispose() }
  }, 'firefly: locale dictionaries')
  ctx.slots.inject('shell.overlay', () => ctx.slots.register({
    name: 'shell.overlay', id: 'firefly-assistant', order: 60,
    locale: 'firefly-assistant', store: viewStore,
    inject: (actions): AssistantInjected => ({
      ...preferenceFace,
      hooks: { ...preferenceFace.hooks, assistant: controller },
      startChat: async (workspaceId, draft) => {
        if (!active || submitting || !preferences.getSnapshot().values.enabled) return
        submitting = true
        try {
          const result = await controller.start(workspaceId, draft.text)
          if (active && result.ok) actions.accepted(draft.revision)
        } finally { submitting = false }
      },
      sendMessage: async draft => {
        if (!active || submitting || !preferences.getSnapshot().values.enabled) return
        submitting = true
        try {
          const result = await controller.send(draft.text)
          if (active && result.ok) actions.accepted(draft.revision)
        } finally { submitting = false }
      },
      reveal: () => { if (active) controller.reveal() },
      refresh: () => { if (active) void controller.refresh() },
      loadOlder: () => { if (active) void controller.loadOlder() },
      resetChat: () => { if (active && !submitting) controller.reset() },
      selectWorkspace: id => { if (active) controller.selectWorkspace(id) },
    }),
  }, FireflyOverlay))
  ctx.slots.inject('settings.general.item', () => ctx.slots.register({
    name: 'settings.general.item', id: 'firefly-assistant', order: 65,
    locale: 'firefly-assistant', inject: () => preferenceFace,
  }, FireflySettings))
}
