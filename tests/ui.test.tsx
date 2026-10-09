import { createElement, useSyncExternalStore } from 'react'
import { act, cleanup, createEvent, fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createSnapshotStore } from '@deepseek-ai/dsh-client-runtime/client'
import type { ObservableSnapshot, SessionId, WorkspaceId, WorkspaceView } from '@deepseek-ai/dsh-client-runtime/client'
import type { SnapshotSelectorHook } from '@deepseek-ai/dsh-client-ui-slots'

// Do not materialize the built primitives barrel/CSS in component-only jsdom tests.
vi.mock('@deepseek-ai/dsh-client-ui-primitives', () => ({
  MarkdownText: ({ text, streaming }: { text: string; streaming?: boolean }) =>
    createElement('div', { 'data-testid': 'markdown', 'data-streaming': String(streaming) }, text),
}))

import { FireflyOverlay } from '../src/client/FireflyOverlay.tsx'
import { FireflySettings } from '../src/client/FireflySettings.tsx'
import type { OverlayProps } from '../src/client/contracts.ts'
import type { AssistantSnapshot } from '../src/client/assistant-controller.ts'
import { PreferencesStore } from '../src/client/preferences.ts'
import { createViewStore } from '../src/client/view-store.ts'
import { en } from '../src/client/locales.ts'

function bind<T>(source: ObservableSnapshot<T>): SnapshotSelectorHook<T> {
  return function useBound(select) {
    return select(useSyncExternalStore(listener => source.subscribe(listener), () => source.getSnapshot()))
  }
}
const WS = 'assistant-workspace' as WorkspaceId
const OTHER_WS = 'other-workspace' as WorkspaceId
const DEDICATED = 'dedicated-chat' as SessionId
const workspace: WorkspaceView = { workspaceId: WS, path: '/assistant', title: 'Assistant project', sessionIds: [DEDICATED], createdAt: '0', updatedAt: '0' }
const otherWorkspace: WorkspaceView = { ...workspace, workspaceId: OTHER_WS, path: '/other', title: 'Other project', sessionIds: [] }
function assistantSnapshot(patch: Partial<AssistantSnapshot> = {}): AssistantSnapshot {
  const phase = patch.phase ?? 'ready'
  const ready = phase === 'ready'
  const status = ready ? 'idle' : phase === 'empty' ? 'noSession' : phase === 'unavailable' ? 'unavailable' : 'loading'
  return { phase, status, canSend: ready, blockedReason: ready ? undefined : 'Assistant session is not ready.', needsReveal: false,
    workspacePath: workspace.path, modelLabel: 'host-model', permissionLabel: 'Host permissions',
    workspaceId: WS, workspace, workspaces: [workspace, otherWorkspace], sessionId: phase === 'empty' ? undefined : DEDICATED,
    messages: [], running: false, sending: false, pendingCount: 0, queuedCount: 0, hasMore: false,
    loadingOlder: false, preset: 'host-default', model: 'host-model', permissions: 'host-session-settings',
    error: undefined, storageError: false, ...patch }
}
const observers: TestResizeObserver[] = []
class TestResizeObserver {
  readonly observe = vi.fn()
  readonly disconnect = vi.fn()
  constructor() { observers.push(this) }
}
beforeEach(() => {
  localStorage.clear()
  observers.length = 0
  vi.stubGlobal('ResizeObserver', TestResizeObserver)
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(() => ({
    x: 0, y: 0, top: 0, left: 0, right: 56, bottom: 56, width: 56, height: 56, toJSON: () => ({}),
  }))
})
afterEach(() => { cleanup(); vi.unstubAllGlobals() })

function mount(initial?: { enabled?: boolean; right?: number; bottom?: number; assistant?: Partial<AssistantSnapshot> }) {
  const preferences = new PreferencesStore(localStorage, { enabled: initial?.enabled ?? true, right: 24, bottom: 80 })
  preferences.update({ right: initial?.right ?? 24, bottom: initial?.bottom ?? 80 })
  const assistant = createSnapshotStore(assistantSnapshot(initial?.assistant))
  const view = createViewStore().create()
  const startChat = vi.fn<OverlayProps['startChat']>(async () => {})
  const sendMessage = vi.fn<OverlayProps['sendMessage']>(async () => {})
  const reveal = vi.fn()
  const refresh = vi.fn()
  const loadOlder = vi.fn()
  const resetChat = vi.fn()
  const selectWorkspace = vi.fn((id: WorkspaceId) => { assistant.update(state => { state.workspaceId = id }) })
  const setPosition = vi.fn((position: { right: number; bottom: number }) => { preferences.update(position) })
  const setEnabled = vi.fn((enabled: boolean) => { preferences.update({ enabled }) })
  const resetPosition = vi.fn(() => { preferences.resetPosition() })
  const forbiddenMainRead = vi.fn((): never => { throw new Error('Independent UI read main-session state') })
  const t: OverlayProps['t'] = (key, params) => {
    let text = key in en ? en[key as keyof typeof en] : key
    for (const [name, value] of Object.entries(params ?? {})) text = text.replace('{' + name + '}', String(value))
    return text
  }
  const shared = { t, usePreferences: bind(preferences), setEnabled, setPosition, resetPosition,
    useSessions: forbiddenMainRead, useWorkspaces: forbiddenMainRead }
  const rendered = render(<>
    <FireflyOverlay {...shared} useStore={bind(view)} actions={view.actions} useAssistant={bind(assistant)}
      startChat={startChat} sendMessage={sendMessage} reveal={reveal} refresh={refresh} loadOlder={loadOlder}
      resetChat={resetChat} selectWorkspace={selectWorkspace} />
    <FireflySettings {...shared} />
  </>)
  return { ...rendered, preferences, assistant, view, startChat, sendMessage, reveal, refresh, loadOlder,
    resetChat, selectWorkspace, setPosition, setEnabled, resetPosition, forbiddenMainRead }
}
function open() { fireEvent.click(screen.getByRole('button', { name: en.open })) }
function input() { return screen.getByRole<HTMLTextAreaElement>('textbox', { name: en.input }) }
function toggle() { return screen.getByRole<HTMLInputElement>('switch', { name: en['settings.enabled'] }) }

describe('independent Firefly chat UI', () => {
  it('opens and collapses with focus recovery while retaining its private draft', () => {
    const b = mount()
    const launcher = screen.getByRole('button', { name: en.open })
    expect(screen.queryByRole('dialog')).toBeNull()
    open()
    expect(screen.getByRole('dialog').getAttribute('aria-modal')).toBe('false')
    expect(document.activeElement).toBe(input())
    expect(launcher.getAttribute('aria-controls')).toBe(screen.getByRole('dialog').id)
    fireEvent.change(input(), { target: { value: 'my private draft' } })
    fireEvent.keyDown(input(), { key: 'Escape' })
    expect(screen.queryByRole('dialog')).toBeNull()
    expect(document.activeElement).toBe(launcher)
    open()
    expect(input().value).toBe('my private draft')
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: en.close }))
    expect(screen.queryByRole('dialog')).toBeNull()
    expect(b.startChat).not.toHaveBeenCalled()
    expect(b.sendMessage).not.toHaveBeenCalled()
    expect(b.forbiddenMainRead).not.toHaveBeenCalled()
  })

  it('selects a workspace without creating, then starts only on the first message gesture', () => {
    const b = mount({ assistant: { phase: 'empty', status: 'noSession', sessionId: undefined, workspaceId: undefined, canSend: false } })
    open()
    const select = screen.getByRole<HTMLSelectElement>('combobox', { name: en['chat.workspace'] })
    expect(select.value).toBe(WS)
    fireEvent.change(select, { target: { value: OTHER_WS } })
    expect(b.selectWorkspace).toHaveBeenCalledExactlyOnceWith(OTHER_WS)
    expect(b.startChat).not.toHaveBeenCalled()
    fireEvent.change(input(), { target: { value: 'first independent message' } })
    fireEvent.click(screen.getByRole('button', { name: en['chat.start'] }))
    expect(b.startChat).toHaveBeenCalledExactlyOnceWith(OTHER_WS, { text: 'first independent message', revision: 1 })
    expect(b.sendMessage).not.toHaveBeenCalled()
    expect(b.reveal).not.toHaveBeenCalled()
    expect(b.forbiddenMainRead).not.toHaveBeenCalled()
  })

  it('does not start without a workspace or with an empty message', () => {
    const b = mount({ assistant: { phase: 'empty', status: 'noSession', sessionId: undefined, workspaceId: undefined, workspaces: [] } })
    open()
    const submit = screen.getByRole<HTMLButtonElement>('button', { name: en['chat.start'] })
    expect(submit.disabled).toBe(true)
    expect(screen.getByRole<HTMLSelectElement>('combobox').disabled).toBe(true)
    fireEvent.change(input(), { target: { value: 'task' } })
    fireEvent.keyDown(input(), { key: 'Enter' })
    expect(b.startChat).not.toHaveBeenCalled()
    act(() => { b.assistant.update(state => { state.workspaces = [workspace] }) })
    fireEvent.change(input(), { target: { value: '   ' } })
    expect(submit.disabled).toBe(true)
  })

  it('displays only dedicated transcript messages and sends through the independent callback', () => {
    const b = mount({ assistant: { messages: [
      { id: 'user-1', role: 'user', text: '<b>literal user text</b>', streaming: false },
      { id: 'assistant-1', role: 'assistant', text: '**Dedicated answer**', streaming: true },
    ] } })
    open()
    expect(screen.getByText('<b>literal user text</b>').closest('article')?.dataset.fireflyMessage).toBe('user')
    expect(screen.getByTestId('markdown').textContent).toBe('**Dedicated answer**')
    expect(screen.getByTestId('markdown').dataset.streaming).toBe('true')
    expect(screen.getByTestId('markdown').closest('article')?.dataset.fireflyMessage).toBe('assistant')
    fireEvent.change(input(), { target: { value: '  follow up  ' } })
    fireEvent.click(screen.getByRole('button', { name: en.send }))
    expect(b.sendMessage).toHaveBeenCalledExactlyOnceWith({ text: '  follow up  ', revision: 1 })
    expect(b.startChat).not.toHaveBeenCalled()
    expect(b.forbiddenMainRead).not.toHaveBeenCalled()
    expect(input().value).toBe('  follow up  ')
  })

  it('sends Enter but leaves Shift+Enter, composing Enter, keyCode 229 and repeats untouched', () => {
    const b = mount()
    open()
    fireEvent.change(input(), { target: { value: 'literal message' } })
    for (const extra of [{ shiftKey: true }, { isComposing: true }, { keyCode: 229 }, { repeat: true }]) {
      const event = createEvent.keyDown(input(), { key: 'Enter', bubbles: true, cancelable: true, ...extra })
      fireEvent(input(), event)
      expect(event.defaultPrevented).toBe(false)
    }
    expect(b.sendMessage).not.toHaveBeenCalled()
    const event = createEvent.keyDown(input(), { key: 'Enter', bubbles: true, cancelable: true })
    fireEvent(input(), event)
    expect(event.defaultPrevented).toBe(true)
    expect(b.sendMessage).toHaveBeenCalledExactlyOnceWith({ text: 'literal message', revision: 1 })
  })

  it.each(['restoring', 'creating', 'unavailable'] as const)('blocks submission while %s without falling back to main chat', phase => {
    const b = mount({ assistant: { phase, canSend: false } })
    act(() => { b.view.actions.editDraft('retained draft') })
    open()
    expect(input().disabled).toBe(true)
    expect(screen.getByRole<HTMLButtonElement>('button', { name: en.send }).disabled).toBe(true)
    expect(b.sendMessage).not.toHaveBeenCalled()
    expect(b.startChat).not.toHaveBeenCalled()
    expect(b.forbiddenMainRead).not.toHaveBeenCalled()
  })

  it('honors canSend and sending even for keyboard submission in a ready chat', () => {
    const b = mount({ assistant: { canSend: false } })
    open()
    fireEvent.change(input(), { target: { value: 'task' } })
    fireEvent.keyDown(input(), { key: 'Enter' })
    expect(b.sendMessage).not.toHaveBeenCalled()
    act(() => { b.assistant.update(state => { state.canSend = true; state.sending = true }) })
    fireEvent.keyDown(input(), { key: 'Enter' })
    expect(screen.getByRole<HTMLButtonElement>('button', { name: en.sending }).disabled).toBe(true)
    expect(b.sendMessage).not.toHaveBeenCalled()
  })

  it('requires confirmation for new chat and clears the draft only after confirmation', () => {
    const b = mount()
    open()
    fireEvent.change(input(), { target: { value: 'keep until confirmed' } })
    fireEvent.click(screen.getByRole('button', { name: en['chat.new'] }))
    expect(screen.getByRole('group', { name: en['chat.new'] })).toBeTruthy()
    expect(b.resetChat).not.toHaveBeenCalled()
    fireEvent.click(screen.getByRole('button', { name: en['chat.cancel'] }))
    expect(input().value).toBe('keep until confirmed')
    fireEvent.click(screen.getByRole('button', { name: en['chat.new'] }))
    fireEvent.click(screen.getByRole('button', { name: en['chat.confirm'] }))
    expect(b.resetChat).toHaveBeenCalledOnce()
    expect(input().value).toBe('')
    expect(b.startChat).not.toHaveBeenCalled()
    act(() => { b.assistant.update(state => { state.running = true }) })
    expect(screen.getByRole<HTMLButtonElement>('button', { name: en['chat.new'] }).disabled).toBe(true)
  })

  it('keeps Settings reachable while hidden and disposes listeners without losing the draft', () => {
    const added = vi.spyOn(window, 'addEventListener')
    const removed = vi.spyOn(window, 'removeEventListener')
    const b = mount({ enabled: false })
    expect(screen.queryByRole('button', { name: en.open })).toBeNull()
    expect(observers).toHaveLength(0)
    fireEvent.click(toggle())
    open()
    fireEvent.change(input(), { target: { value: 'retained while disabled' } })
    fireEvent.click(toggle())
    expect(screen.queryByRole('dialog')).toBeNull()
    expect(observers.every(observer => observer.disconnect.mock.calls.length === 1)).toBe(true)
    fireEvent.click(toggle())
    expect(input().value).toBe('retained while disabled')
    b.unmount()
    expect(observers.every(observer => observer.disconnect.mock.calls.length === 1)).toBe(true)
    expect(removed.mock.calls.filter(([name]) => name === 'resize').map(([, callback]) => callback))
      .toEqual(added.mock.calls.filter(([name]) => name === 'resize').map(([, callback]) => callback))
  })

  it('routes explicit reveal, refresh and older-history gestures to dedicated callbacks only', () => {
    const b = mount({ assistant: { hasMore: true, error: { code: 'offline', message: 'Host unavailable' } } })
    open()
    expect(screen.getByRole('alert').textContent).toContain('Host unavailable')
    fireEvent.click(screen.getByRole('button', { name: en['chat.older'] }))
    fireEvent.click(screen.getByRole('button', { name: en['chat.refresh'] }))
    fireEvent.click(screen.getByRole('button', { name: en.reveal + ' ↗' }))
    expect(b.loadOlder).toHaveBeenCalledExactlyOnceWith()
    expect(b.refresh).toHaveBeenCalledOnce()
    expect(b.reveal).toHaveBeenCalledOnce()
    expect(b.forbiddenMainRead).not.toHaveBeenCalled()
  })

  it('uses keyboard movement and Settings reset without changing visibility', () => {
    const b = mount()
    const launcher = screen.getByRole('button', { name: en.open })
    fireEvent.keyDown(launcher, { key: 'ArrowLeft' })
    expect(b.preferences.getSnapshot().values.right).toBe(36)
    fireEvent.keyDown(launcher, { key: 'ArrowUp', shiftKey: true })
    expect(b.preferences.getSnapshot().values.bottom).toBe(112)
    fireEvent.click(toggle())
    fireEvent.click(screen.getByRole('button', { name: en['settings.reset'] }))
    expect(b.preferences.getSnapshot().values).toEqual({ enabled: false, right: 24, bottom: 80 })
    expect(toggle().checked).toBe(false)
    expect(b.resetPosition).toHaveBeenCalledOnce()
  })

  it('commits pointer movement on release, cancels unfinished drags and suppresses the drag click', () => {
    const b = mount()
    const launcher = screen.getByRole('button', { name: en.open })
    const capture = new Set<number>()
    const release = vi.fn((id: number) => { capture.delete(id) })
    Object.defineProperties(launcher, {
      setPointerCapture: { value: (id: number) => { capture.add(id) } },
      hasPointerCapture: { value: (id: number) => capture.has(id) },
      releasePointerCapture: { value: release },
    })
    const pointer = { pointerId: 7, isPrimary: true, button: 0, clientX: 100, clientY: 100 }
    fireEvent.pointerDown(launcher, pointer)
    fireEvent.pointerMove(launcher, { ...pointer, clientX: 80, clientY: 80 })
    expect(b.preferences.getSnapshot().values).toMatchObject({ right: 24, bottom: 80 })
    fireEvent.pointerUp(launcher, { ...pointer, clientX: 80, clientY: 80 })
    expect(b.preferences.getSnapshot().values).toMatchObject({ right: 44, bottom: 100 })
    expect(release).toHaveBeenCalledWith(7)
    fireEvent.click(launcher)
    expect(screen.queryByRole('dialog')).toBeNull()
    fireEvent.pointerDown(launcher, pointer)
    fireEvent.pointerMove(launcher, { ...pointer, clientX: 50 })
    fireEvent.pointerCancel(launcher, pointer)
    expect(b.preferences.getSnapshot().values).toMatchObject({ right: 44, bottom: 100 })
    expect(capture.size).toBe(0)
    fireEvent.pointerDown(launcher, pointer)
    fireEvent.pointerUp(launcher, pointer)
    fireEvent.click(launcher)
    expect(screen.getByRole('dialog')).toBeTruthy()
  })

  it('clamps restored geometry and handles viewport resize without leaking a listener', () => {
    const b = mount({ right: 10000, bottom: 10000 })
    expect(b.preferences.getSnapshot().values.right).toBe(window.innerWidth - 56 - 8)
    expect(b.preferences.getSnapshot().values.bottom).toBe(window.innerHeight - 56 - 8)
    vi.stubGlobal('innerWidth', 320)
    vi.stubGlobal('innerHeight', 240)
    fireEvent(window, new Event('resize'))
    expect(b.preferences.getSnapshot().values).toMatchObject({ right: 256, bottom: 176 })
    b.unmount()
    b.setPosition.mockClear()
    fireEvent(window, new Event('resize'))
    expect(b.setPosition).not.toHaveBeenCalled()
  })

})

it('renders three decorative coworkers and follows the real assistant state', () => {
  const b = mount()
  open()
  const scene = screen.getByRole('img', { name: en['studio.description'] })
  expect(scene.querySelectorAll('[data-worker]')).toHaveLength(3)
  expect(scene.getAttribute('data-mode')).toBe('idle')
  act(() => { b.assistant.update(state => { state.running = true; state.status = 'running' }) })
  expect(scene.getAttribute('data-mode')).toBe('working')
  act(() => { b.assistant.update(state => { state.pendingCount = 1; state.status = 'approval' }) })
  expect(scene.getAttribute('data-mode')).toBe('waiting')
  act(() => { b.assistant.update(state => { state.pendingCount = 0; state.running = false; state.status = 'failed' }) })
  expect(scene.getAttribute('data-mode')).toBe('error')
  expect(b.startChat).not.toHaveBeenCalled()
  expect(b.sendMessage).not.toHaveBeenCalled()
})

it('does not bubble Firefly pointer effects to the shell canvas', () => {
  mount()
  const observed = vi.fn()
  window.addEventListener('pointerdown', observed)
  window.addEventListener('pointermove', observed)
  try {
    const launcher = screen.getByRole('button', { name: en.open })
    fireEvent.pointerDown(launcher, { pointerType: 'mouse', isPrimary: false })
    fireEvent.pointerMove(launcher, { pointerType: 'mouse' })
    expect(observed).not.toHaveBeenCalled()
    fireEvent.pointerDown(document.body, { pointerType: 'mouse' })
    expect(observed).toHaveBeenCalledTimes(1)
  } finally {
    window.removeEventListener('pointerdown', observed)
    window.removeEventListener('pointermove', observed)
  }
})
