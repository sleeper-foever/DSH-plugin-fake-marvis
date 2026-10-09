import type { OverlayProps } from './contracts.ts'
import { FireflyDock } from './FireflyDock.tsx'

/**
 * Read framework hook seats once and retain draft state while the active dock is hidden.
 * @param props - Root-scoped assistant, locale and preference bindings.
 * @returns The independent chat dock or no floating UI when disabled.
 */
export function FireflyOverlay(props: OverlayProps) {
  const preferences = props.usePreferences(snapshot => snapshot)
  const assistant = props.useAssistant(snapshot => snapshot)
  const view = props.useStore(snapshot => snapshot)
  if (!preferences.values.enabled) return null
  return <FireflyDock t={props.t} preferences={preferences} assistant={assistant}
    expanded={view.expanded} draft={view.draft} setExpanded={props.actions.expand}
    editDraft={props.actions.editDraft} setPosition={props.setPosition}
    startChat={props.startChat} sendMessage={props.sendMessage} reveal={props.reveal}
    refresh={props.refresh} loadOlder={props.loadOlder} resetChat={props.resetChat}
    selectWorkspace={props.selectWorkspace} />
}
