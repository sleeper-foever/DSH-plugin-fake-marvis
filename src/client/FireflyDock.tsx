import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import type { KeyboardEvent, PointerEvent } from 'react'
import { MarkdownText } from '@deepseek-ai/dsh-client-ui-primitives'
import type { DockProps } from './contracts.ts'
import type { FireflyKey } from './locales.ts'
import { clampPosition, type Position } from './position.ts'
import { TransformDevice } from './TransformDevice.tsx'
import { StudioScene } from './StudioScene.tsx'

interface Drag { pointerId: number; x: number; y: number; start: Position; latest: Position; moved: boolean }

function Icon({ name }: { name: 'close' | 'arrow' | 'new' | 'refresh' | 'grip' }) {
  const paths = { close: 'm4 4 8 8M12 4l-8 8', arrow: 'M8 13V3m-4 4 4-4 4 4',
    new: 'M8 3v10M3 8h10', refresh: 'M13 7a5 5 0 1 0-1 4M13 2v5H8',
    grip: 'M5 4h.01M11 4h.01M5 8h.01M11 8h.01M5 12h.01M11 12h.01' }
  return <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={name === 'grip' ? 2 : 1.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name]} /></svg>
}

/** Independent conversation and device launcher; all session facts are passed as props. */
export function FireflyDock(props: DockProps) {
  const { t, preferences, assistant, expanded, setExpanded, draft, editDraft,
    setPosition, startChat, sendMessage, reveal, refresh, loadOlder, resetChat, selectWorkspace } = props
  const [dragPosition, setDragPosition] = useState<Position | null>(null)
  const [confirmNew, setConfirmNew] = useState(false)
  const [atBottom, setAtBottom] = useState(true)
  const dock = useRef<HTMLDivElement>(null)
  const launcher = useRef<HTMLButtonElement>(null)
  const input = useRef<HTMLTextAreaElement>(null)
  const scroll = useRef<HTMLDivElement>(null)
  const follow = useRef(true)
  const olderAnchor = useRef<{ height: number; top: number } | null>(null)
  const drag = useRef<Drag | null>(null)
  const suppressClick = useRef(false)
  const panelId = useId()
  const titleId = useId()
  const workspaceSelectId = useId()
  const position = dragPosition ?? preferences.values
  const ready = assistant.phase === 'ready'
  const choosing = assistant.phase === 'empty'
  const busy = assistant.phase === 'creating' || assistant.phase === 'restoring'
  const status = assistant.status
  const studioMode = assistant.pendingCount > 0 ? 'waiting'
    : ['failed', 'unavailable'].includes(status) ? 'error'
      : assistant.running || assistant.sending || busy ? 'working' : 'idle'
  const workspaceId = assistant.workspaceId ?? assistant.workspaces[0]?.workspaceId
  const canSubmit = !assistant.sending && !busy && draft.text.trim() !== ''
    && ((choosing && workspaceId !== undefined) || (ready && assistant.canSend))
  function send(): void {
    if (!canSubmit) return
    follow.current = true
    if (choosing && workspaceId !== undefined) void startChat(workspaceId, draft)
    else void sendMessage(draft)
  }
  useLayoutEffect(() => {
    const el = scroll.current
    if (!el) return
    if (assistant.messages.length === 0) { el.scrollTop = 0; return }
    if (olderAnchor.current && !assistant.loadingOlder) {
      el.scrollTop = olderAnchor.current.top + Math.max(0, el.scrollHeight - olderAnchor.current.height)
      olderAnchor.current = null
    } else if (follow.current) el.scrollTop = el.scrollHeight
  }, [assistant.messages, assistant.loadingOlder, expanded])
  useEffect(() => { follow.current = true; setAtBottom(true) }, [assistant.sessionId])

  const constrain = (candidate: Position): Position => {
    const rect = dock.current?.getBoundingClientRect()
    return clampPosition(candidate, { width: window.innerWidth, height: window.innerHeight },
      { width: rect?.width ?? 84, height: rect?.height ?? 84 })
  }

  useLayoutEffect(() => {
    const fit = () => {
      const rect = dock.current?.getBoundingClientRect()
      if (!rect) return
      const fitted = clampPosition(preferences.values, { width: window.innerWidth, height: window.innerHeight }, rect)
      if (fitted.right !== preferences.values.right || fitted.bottom !== preferences.values.bottom) setPosition(fitted)
    }
    fit()
    window.addEventListener('resize', fit)
    const observer = new ResizeObserver(fit)
    if (dock.current) observer.observe(dock.current)
    return () => { window.removeEventListener('resize', fit); observer.disconnect() }
  }, [expanded, preferences.values.right, preferences.values.bottom, setPosition])

  const wasExpanded = useRef(expanded)
  useEffect(() => {
    if (expanded && !wasExpanded.current) input.current?.focus({ preventScroll: true })
    wasExpanded.current = expanded
  }, [expanded])

  function close(): void {
    setExpanded(false)
    launcher.current?.focus({ preventScroll: true })
  }

  function startDrag(event: PointerEvent<HTMLButtonElement>): void {
    if (!event.isPrimary || event.button !== 0) return
    event.currentTarget.focus({ preventScroll: true })
    event.currentTarget.setPointerCapture(event.pointerId)
    suppressClick.current = false
    drag.current = { pointerId: event.pointerId, x: event.clientX, y: event.clientY,
      start: preferences.values, latest: preferences.values, moved: false }
  }

  function moveDrag(event: PointerEvent<HTMLButtonElement>): void {
    const current = drag.current
    if (current === null || current.pointerId !== event.pointerId) return
    const dx = event.clientX - current.x
    const dy = event.clientY - current.y
    if (!current.moved && Math.hypot(dx, dy) < 5) return
    current.moved = true
    suppressClick.current = true
    current.latest = constrain({ right: current.start.right - dx, bottom: current.start.bottom - dy })
    setDragPosition(current.latest)
  }

  function endDrag(event: PointerEvent<HTMLButtonElement>, cancelled = false): void {
    const current = drag.current
    if (current === null || current.pointerId !== event.pointerId) return
    drag.current = null
    if (current.moved && !cancelled) setPosition(current.latest)
    setDragPosition(null)
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
  }

  function moveWithKeyboard(event: KeyboardEvent<HTMLButtonElement>): void {
    const step = event.shiftKey ? 32 : 12
    const offsets: Record<string, Position> = {
      ArrowLeft: { right: step, bottom: 0 }, ArrowRight: { right: -step, bottom: 0 },
      ArrowUp: { right: 0, bottom: step }, ArrowDown: { right: 0, bottom: -step },
    }
    const offset = offsets[event.key]
    if (!offset) return
    event.preventDefault()
    setPosition(constrain({ right: preferences.values.right + offset.right, bottom: preferences.values.bottom + offset.bottom }))
  }

  const dragHandlers = { onPointerDown: startDrag, onPointerMove: moveDrag,
    onPointerUp: (event: PointerEvent<HTMLButtonElement>) => { endDrag(event) },
    onPointerCancel: (event: PointerEvent<HTMLButtonElement>) => { endDrag(event, true) },
    onLostPointerCapture: (event: PointerEvent<HTMLButtonElement>) => { endDrag(event, true) },
    onKeyDown: moveWithKeyboard }

  return (
    <div ref={dock} data-firefly-root data-state={status} data-expanded={expanded || undefined}
      className="dsh-firefly-assistant-dock" style={{ right: position.right, bottom: position.bottom }}
      onPointerDown={event => { event.stopPropagation() }}
      onPointerMove={event => { event.stopPropagation() }}
      onKeyDown={event => { if (event.key === 'Escape' && expanded) { event.preventDefault(); event.stopPropagation(); setConfirmNew(false); close() } }}>
      {expanded && <section id={panelId} className="ff-panel" role="dialog" aria-modal="false" aria-labelledby={titleId}>
        <header className="ff-header">
          <div className="ff-wordmark"><span className="ff-header-device"><TransformDevice size={40} /></span>
            <div><h2 id={titleId}>FIREFLY <span lang="zh">流萤</span></h2><p className="ff-subtitle">{t('studio.subtitle')}</p></div>
          </div>
          <div className="ff-header-actions">
            {assistant.sessionId && <button type="button" className="ff-icon" aria-label={t('chat.new')} title={t('chat.new')}
              disabled={assistant.running || assistant.sending || busy} onClick={() => { setConfirmNew(value => !value) }}><Icon name="new" /></button>}
            <button type="button" className="ff-icon ff-grip" aria-label={t('drag')} title={t('drag')} {...dragHandlers}><Icon name="grip" /></button>
            <button type="button" className="ff-icon" aria-label={t('close')} title={t('close')} onClick={close}><Icon name="close" /></button>
          </div>
        </header>
        <div className="ff-context"><span className="ff-status" role="status"><span className="ff-status-dot" aria-hidden="true" />{t(('status.' + status) as FireflyKey)}</span>
          {assistant.workspace && <><span className="ff-context-divider">/</span><span className="ff-context-path" title={assistant.workspace.path}>{assistant.workspace.title}</span></>}
          {assistant.model && <><span className="ff-context-divider">/</span><span className="ff-context-path" title={assistant.model}>{assistant.model}</span></>}
        </div>
        <div className="ff-studio-area">
          <StudioScene mode={studioMode} label={t('studio.description')} />
          <div className="ff-studio-caption"><span>{t(('studio.' + studioMode) as FireflyKey)}</span><span title={t('studio.description')}>{t('studio.visual')}</span></div>
        </div>
        {confirmNew && <div className="ff-confirm" role="group" aria-label={t('chat.new')}>
          <p>{t('chat.newConfirm')}</p><div className="ff-confirm-actions">
            <button type="button" onClick={() => { resetChat(); editDraft(''); setConfirmNew(false) }}>{t('chat.confirm')}</button>
            <button type="button" onClick={() => { setConfirmNew(false) }}>{t('chat.cancel')}</button>
          </div>
        </div>}
        <div ref={scroll} className="ff-scroll" data-firefly-transcript onScroll={event => {
          const el = event.currentTarget; follow.current = el.scrollHeight - el.scrollTop - el.clientHeight < 64; setAtBottom(follow.current)
        }}>
          {assistant.hasMore && <button type="button" className="ff-load-more" disabled={assistant.loadingOlder}
            onClick={() => { const el = scroll.current; if (el) olderAnchor.current = { height: el.scrollHeight, top: el.scrollTop }; follow.current = false; loadOlder() }}>{t('chat.older')}</button>}
          {assistant.messages.length === 0 && <div className="ff-welcome">
            <h3>{t('studio.welcome')}</h3><p>{t('studio.intro')}</p>
            {choosing && <div className="ff-setup">
              <label htmlFor={workspaceSelectId}>{t('chat.workspace')}</label>
              <select id={workspaceSelectId} value={workspaceId ?? ''} disabled={assistant.workspaces.length === 0}
                onChange={event => { const workspace = assistant.workspaces.find(w => w.workspaceId === event.currentTarget.value); if (workspace) selectWorkspace(workspace.workspaceId) }}>
                {assistant.workspaces.length === 0 && <option value="">{t('chat.emptyWorkspace')}</option>}
                {assistant.workspaces.map(workspace => <option value={workspace.workspaceId} key={workspace.workspaceId}>{workspace.title} · {workspace.path}</option>)}
              </select><p className="ff-setup-note">{t('chat.setupNote')}</p>
            </div>}
            {ready && <div className="ff-suggestions">
              {(['analyze', 'test', 'summary'] as const).map(key => <button key={key} type="button"
                onClick={() => { editDraft(t(('prompt.' + key) as FireflyKey)); input.current?.focus() }}>{t(('suggest.' + key) as FireflyKey)}</button>)}
            </div>}
            {busy && <div className="ff-activity"><span data-spinner />{t(assistant.phase === 'creating' ? 'chat.starting' : 'chat.restoring')}</div>}
          </div>}
          {assistant.messages.map(message => <article key={message.id} className={message.role === 'user' ? 'ff-message ff-user' : 'ff-message ff-assistant'} data-firefly-message={message.role}>
            {message.role === 'user' ? <div className="ff-user-text">{message.text}</div> : <>
              <div className="ff-message-author"><TransformDevice size={20} /><span>{t('chat.assistant')}</span></div>
              <div className="ff-message-body"><MarkdownText text={message.text} streaming={message.streaming} /></div>
            </>}
          </article>)}
          {assistant.running && <div className="ff-activity" role="status"><span data-spinner />{assistant.messages.at(-1)?.streaming ? t('chat.thinking') : t('chat.toolRunning')}</div>}
        </div>
        <div className="ff-compose-area">
          {!atBottom && assistant.messages.length > 0 && <button type="button" className="ff-load-more" onClick={() => { follow.current = true; if (scroll.current) scroll.current.scrollTop = scroll.current.scrollHeight; setAtBottom(true) }}>{t('chat.latest')}</button>}
          {assistant.phase === 'unavailable' && <div className="ff-notice">
            <div>{t(assistant.error?.code === 'missing-session' ? 'chat.missing' : 'chat.error')}</div><button type="button" className="ff-chat-link" disabled={assistant.sending || busy} onClick={() => { resetChat(); editDraft('') }}>{t('chat.reset')}</button>
          </div>}
          {assistant.pendingCount > 0 && <div className="ff-notice" role="status">{t('chat.pending')} <button type="button" className="ff-chat-link" onClick={reveal}>{t('reveal')} ↗</button></div>}
          {ready && !assistant.canSend && !assistant.sending && assistant.pendingCount === 0 && assistant.blockedReason && <div className="ff-notice" role="status">{assistant.blockedReason}</div>}
          {assistant.error && <div className="ff-notice" data-error role="alert">{assistant.error.code === 'slash' ? t('block.slash') : assistant.error.code === 'empty' ? t('block.empty') : assistant.error.message}
            {assistant.sessionId && <button type="button" className="ff-chat-link" onClick={refresh} title={t('chat.refresh')} aria-label={t('chat.refresh')}><Icon name="refresh" /></button>}
          </div>}
          {(preferences.storageUnavailable || assistant.storageError) && <div className="ff-notice" role="status">{t('storage')}</div>}
          <form className="ff-compose" onSubmit={event => { event.preventDefault(); send() }}>
            <textarea ref={input} aria-label={t('input')} placeholder={t('placeholder')} value={draft.text}
              disabled={busy || (!choosing && !ready)} rows={2} onChange={event => { editDraft(event.currentTarget.value) }}
              onKeyDown={event => {
                if (event.key !== 'Enter' || event.shiftKey || event.nativeEvent.isComposing || event.keyCode === 229 || event.repeat) return
                event.preventDefault(); send()
              }} />
            <div className="ff-compose-footer"><span className="ff-compose-hint">{choosing ? t('chat.start') : t('shortcut')}</span>
              <button type="submit" className="ff-send" aria-label={t(assistant.sending ? 'sending' : choosing ? 'chat.start' : 'send')}
                title={t(choosing ? 'chat.start' : 'send')} disabled={!canSubmit}><Icon name="arrow" /></button>
            </div>
          </form>
          <div className="ff-footer-line"><span title={t('chat.setupNote')}>{assistant.permissionLabel.startsWith('Host session') || !assistant.permissionLabel ? t('chat.defaultPolicy') : assistant.permissionLabel}</span>
            {assistant.sessionId ? <button type="button" className="ff-chat-link" onClick={reveal}>{t('reveal')} ↗</button> : <span>{t('chat.isolated')}</span>}
          </div>
        </div>
      </section>}
      <button ref={launcher} type="button" className="ff-launcher" aria-label={t(expanded ? 'close' : 'open')}
        title={t(('status.' + status) as FireflyKey)} aria-expanded={expanded} aria-controls={expanded ? panelId : undefined}
        {...dragHandlers} onClick={() => {
          if (suppressClick.current) { suppressClick.current = false; return }
          if (expanded) close(); else setExpanded(true)
        }}><TransformDevice size={82} /><span className="ff-orb-dot" aria-hidden="true" /></button>
    </div>
  )
}
