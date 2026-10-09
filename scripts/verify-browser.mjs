import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

const project = new URL('../', import.meta.url)
const origin = new URL(process.argv[2] ?? 'http://127.0.0.1:3080').origin
if (!['127.0.0.1', 'localhost', '[::1]'].includes(new URL(origin).hostname)) throw new Error('Browser verification requires a local DSH URL')
const client = await readFile(new URL('lib/client.js', project), 'utf8')
const pkg = JSON.parse(await readFile(new URL('package.json', project), 'utf8'))
const rev = createHash('sha256').update(client).digest('hex').slice(0, 16)
const bundlePath = '/__firefly-test__/client.js'
const artifacts = new URL('artifacts/', project)
await mkdir(artifacts, { recursive: true })
const browser = await chromium.launch({ headless: true })
const pageErrors = []
const checks = []

try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 960 }, locale: 'zh-CN' })
  await context.route('**/*', async route => {
    const url = new URL(route.request().url())
    if (url.origin !== origin || !['GET', 'HEAD'].includes(route.request().method())
      || url.pathname.startsWith('/api/') || url.pathname.startsWith('/_dsh/')) {
      await route.abort('blockedbyclient')
    } else if (url.pathname === bundlePath) {
      await route.fulfill({ status: 200, contentType: 'text/javascript', body: client })
    } else await route.continue()
  })
  await context.routeWebSocket('**/*', socket => { socket.close() })
  await context.addInitScript(({ entry }) => {
    let boot
    Object.defineProperty(window, '__DSH_BOOT__', {
      configurable: true,
      get: () => boot,
      set(value) {
        // The fixture has no credential/settings backend; leave provider onboarding out of this test composition.
        boot = { ...value, entries: value.entries.filter(row => row.id.startsWith('@deepseek-ai/')
          && row.id !== '@deepseek-ai/dsh-client-ui-settings-models').concat(entry) }
      },
    })
  }, { entry: { id: pkg.name, url: bundlePath, rev, inject: pkg.dsh.client.inject } })
  const page = await context.newPage()
  page.on('pageerror', error => { pageErrors.push(error.message) })
  await page.goto(origin + '/?fixture', { waitUntil: 'domcontentloaded' })
  await page.locator('[data-firefly-root] .ff-launcher').waitFor({ timeout: 25000 })
  checks.push('Built bundle mounted through the real DSH boot loader and shell.overlay')
  const themeDockCss = await readFile(new URL('tests/fixtures/theme-dock.css', project), 'utf8')
  const themeStyle = await page.addStyleTag({ content: themeDockCss })
  async function assertTransparentDock(phase) {
    const actual = await page.locator('[data-firefly-root]').evaluate(el => {
      const s = getComputedStyle(el)
      return { background: s.backgroundColor, border: s.borderTopWidth, radius: s.borderTopLeftRadius,
        padding: s.paddingTop, shadow: s.boxShadow, blur: s.backdropFilter, matchesTheme: el.matches('.ff-dock') }
    })
    assert.deepEqual(actual, { background: 'rgba(0, 0, 0, 0)', border: '0px', radius: '0px', padding: '0px', shadow: 'none', blur: 'none', matchesTheme: false }, phase)
  }
  await assertTransparentDock('collapsed assistant must not inherit the theme dock')
  const initialDialogs = await page.getByRole('dialog').allTextContents()
  if (initialDialogs.length) {
    console.log(JSON.stringify({ initialDialogs, buttons: await page.getByRole('dialog').getByRole('button').allTextContents() }))
    await page.screenshot({ path: fileURLToPath(new URL('firefly-initial.png', artifacts)) })
    throw new Error('Fixture onboarding is open; inspect its documented dismissal')
  }
  const deviceButton = page.locator('[data-firefly-root] .ff-launcher')
  const wings = deviceButton.locator('[data-wing-pair]')
  assert.equal(await wings.count(), 4)
  assert.equal(await deviceButton.locator('[data-wing-state]').getAttribute('data-wing-state'), 'closed')
  assert.equal(await deviceButton.locator('.ff-device-core').evaluate(el => getComputedStyle(el).animationName), 'none')
  assert.equal(await deviceButton.locator('.dshfa-wing-fire').count(), 4)
  assert.equal(await deviceButton.locator('.dshfa-wing-fire').first().evaluate(el => getComputedStyle(el).opacity), '0')
  assert.equal(await deviceButton.locator('.dshfa-fire-stream').first().evaluate(el => getComputedStyle(el).animationName), 'none')
  const folded = await wings.evaluateAll(elements => elements.map(el => getComputedStyle(el).transform))
  assert.ok(folded.every(matrix => matrix !== 'none' && matrix !== 'matrix(1, 0, 0, 1, 0, 0)'))
  await deviceButton.screenshot({ path: fileURLToPath(new URL('device-closed.png', artifacts)) })
  await deviceButton.hover()
  assert.equal(await deviceButton.locator('.ff-device-core').evaluate(el => getComputedStyle(el).animationName), 'dshfa-device-breathe')
  assert.equal(await deviceButton.locator('.dshfa-wing-fire').first().evaluate(el => getComputedStyle(el).opacity), '1')
  assert.equal(await deviceButton.locator('.dshfa-flame-tongue').first().evaluate(el => getComputedStyle(el).animationName), 'dshfa-wing-burn')
  const trail = deviceButton.locator('.dshfa-fire-stream').first()
  const travel = await trail.evaluate(async el => {
    const animation = el.getAnimations()[0]
    if (!animation) throw new Error('Wing light has no active animation')
    animation.pause(); animation.currentTime = 200
    await new Promise(requestAnimationFrame)
    const first = getComputedStyle(el).strokeDashoffset
    animation.currentTime = 900
    await new Promise(requestAnimationFrame)
    const second = getComputedStyle(el).strokeDashoffset
    animation.play()
    return { first, second }
  })
  assert.notEqual(travel.first, travel.second)
  await deviceButton.screenshot({ path: fileURLToPath(new URL('device-hover-fire.png', artifacts)) })
  checks.push('Hover ignites four shaped wing flames and light streaks visibly travel along their paths')
  assert.equal(await deviceButton.locator('[data-wing-state]').getAttribute('data-wing-state'), 'closed')
  assert.deepEqual(await wings.evaluateAll(elements => elements.map(el => getComputedStyle(el).transform)), folded)
  await deviceButton.click()
  await page.waitForFunction(() => [...document.querySelectorAll('.ff-launcher [data-wing-pair]')].every(el => getComputedStyle(el).transform === 'matrix(1, 0, 0, 1, 0, 0)'))
  assert.equal(await deviceButton.locator('[data-wing-state]').getAttribute('data-wing-state'), 'open')
  await deviceButton.screenshot({ path: fileURLToPath(new URL('device-open.png', artifacts)) })
  checks.push('Four wings stay folded at rest and on hover; hover breathes light; click smoothly unfolds both pairs')
  const panel = page.getByRole('dialog', { name: 'FIREFLY 流萤' })
  await panel.waitFor()
  await assertTransparentDock('expanded assistant must not inherit the theme dock')
  await themeStyle.evaluate(el => { document.head.prepend(el) })
  await assertTransparentDock('theme-first stylesheet order must also be isolated')
  const themeProbe = await page.evaluate(() => {
    const el = document.createElement('div'); el.className = 'ff-dock'; el.style.visibility = 'hidden'; document.body.append(el)
    const s = getComputedStyle(el); const result = { radius: s.borderTopLeftRadius, border: s.borderTopWidth }; el.remove(); return result
  })
  assert.deepEqual(themeProbe, { radius: '999px', border: '1px' })
  checks.push('Installed theme dock rule stays intact while collapsed/expanded assistant remains transparent in either load order')
  const input = page.getByRole('textbox', { name: '和流萤对话' })
  assert.equal(await input.isEnabled(), true)
  const focusTheme = await page.addStyleTag({ content: 'html[data-dsh-skin] :focus-visible { outline: 2px solid var(--dsw-alias-state-business-primary); outline-offset: 2px; }' })
  await input.focus()
  for (const order of ['theme-last', 'theme-first']) {
    if (order === 'theme-first') await focusTheme.evaluate(el => document.head.prepend(el))
    assert.deepEqual(await input.evaluate(el => {
      const s = getComputedStyle(el)
      return { focused: document.activeElement === el, outline: s.outlineStyle, border: s.borderTopWidth, shadow: s.boxShadow }
    }), { focused: true, outline: 'none', border: '0px', shadow: 'none' }, order)
  }
  checks.push('Theme focus rules cannot add a rectangular frame to the focused Firefly textarea')
  assert.match(await panel.evaluate(el => getComputedStyle(el).backdropFilter), /blur[(]20px[)]/)
  const glass = await panel.evaluate(el => {
    const s = getComputedStyle(el)
    return { background: s.backgroundImage, opacity: s.opacity, filter: s.filter, highlight: s.boxShadow,
      textFilter: getComputedStyle(el.querySelector('textarea')).filter }
  })
  assert.match(glass.background, /0[.]62/)
  assert.match(glass.background, /0[.]72/)
  assert.equal(glass.opacity, '1')
  assert.equal(glass.filter, 'none')
  assert.equal(glass.textFilter, 'none')
  assert.match(glass.highlight, /inset/)
  assert.equal(await panel.locator('[data-crystal-face]').count(), 96)
  assert.equal(await panel.locator('[data-crystal-bevel]').count(), 288)
  assert.equal(await panel.locator('[data-crystal-frost]').count(), 1)
  assert.notEqual(await panel.locator('[data-crystal-frost]').evaluate(el => getComputedStyle(el).filter), 'none')
  assert.equal(await panel.locator('[data-crystal-facets]').getAttribute('aria-hidden'), 'true')
  assert.equal(await panel.locator('[data-crystal-facets]').evaluate(el => getComputedStyle(el).pointerEvents), 'none')
  checks.push('Faceted crystal has 96 reflective triangles beneath content, with lighter tint and no pointer interception')
  checks.push('Crystal panel uses translucent paint and background-only blur; text remains fully opaque and unblurred')
  assert.equal(await page.locator('.ff-launcher .ff-device-wing').count(), 1)
  assert.equal(await page.locator('.ff-launcher .ff-device-core').count(), 1)
  checks.push('Device icon, three-workstation studio and independent chat render through the DSH loader')
  await page.screenshot({ path: fileURLToPath(new URL('firefly-v2-welcome.png', artifacts)) })
  await page.locator('[data-firefly-root]').screenshot({ path: fileURLToPath(new URL('firefly-v2-panel.png', artifacts)) })
  assert.equal(await page.locator('[data-firefly-studio] [data-worker]').count(), 3)
  assert.equal(await page.locator('[data-firefly-studio]').getAttribute('data-scene-theme'), 'neon-gaming')
  for (const [selector, name] of [
    ['.ff-room-traces', 'dshfa-room-flow'], ['.ff-pc-rotor', 'dshfa-fan-spin'],
    ['.ff-screen-stars', 'dshfa-star-breathe'], ['.ff-screen-scan', 'dshfa-screen-scan'],
    ['.ff-screen-train', 'dshfa-train-cruise'], ['.ff-worker-body', 'dshfa-avatar-breathe'],
  ]) assert.equal(await page.locator(selector).first().evaluate(el => getComputedStyle(el).animationName), name)
  for (const [selector, property] of [['.ff-room-traces', 'strokeDashoffset'], ['.ff-screen-scan', 'transform'], ['.ff-pc-rotor', 'transform']]) {
    const values = await page.locator(selector).first().evaluate(async (el, property) => {
      const animation = el.getAnimations()[0]
      if (!animation) throw new Error('Missing studio animation')
      animation.pause(); animation.currentTime = 100
      await new Promise(requestAnimationFrame)
      const before = getComputedStyle(el)[property]
      animation.currentTime = 2100
      await new Promise(requestAnimationFrame)
      const after = getComputedStyle(el)[property]
      animation.play()
      return { before, after }
    }, property)
    assert.notEqual(values.before, values.after, selector + ' must visibly change over time')
  }
  checks.push('Dark gaming scene animates character breathing, RGB traces, PC fans, stars, train and screen scanning')
  assert.deepEqual(await page.locator('[data-pixel-character]').evaluateAll(elements => elements.map(el => el.getAttribute('data-pixel-character'))), ['silver-wolf', 'firefly', 'stelle'])
  assert.deepEqual(await page.locator('[data-pixel-character]').evaluateAll(elements => elements.map(el => el.getAttribute('data-pose'))), ['typing', 'reading', 'sketching'])
  assert.equal(await page.locator('[data-monitor-screen=star-rail-login]').count(), 3)
  assert.ok((await page.locator('[data-monitor-screen]').allTextContents()).every(text => text.includes('星穹铁道') && text.includes('点击进入')))
  await page.locator('[data-firefly-studio]').screenshot({ path: fileURLToPath(new URL('firefly-pixel-studio.png', artifacts)) })
  checks.push('Reference-inspired Silver Wolf, Firefly and Stelle occupy distinct desks with Star Rail login miniatures')
  assert.equal(await page.locator('[data-firefly-studio]').getAttribute('data-mode'), 'idle')
  assert.equal(await page.locator('.ff-launcher').evaluate(el => getComputedStyle(el, '::before').content), 'none')
  const initialAria = await panel.ariaSnapshot()
  await page.evaluate(() => { window.__fireflyPointerCount = 0; window.addEventListener('pointermove', () => { window.__fireflyPointerCount++ }); window.addEventListener('pointerdown', () => { window.__fireflyPointerCount++ }) })
  const launcherBox = await page.locator('.ff-launcher').boundingBox()
  await page.mouse.move(launcherBox.x + launcherBox.width / 2, launcherBox.y + launcherBox.height / 2)
  assert.equal(await page.evaluate(() => window.__fireflyPointerCount), 0)
  checks.push('Firefly has no circular backdrop and pointer events do not trigger shell cursor effects')
  await writeFile(new URL('studio-panel.aria.txt', artifacts), initialAria)
  const expectedAria = await readFile(new URL('tests/snapshots/firefly-panel.zh.aria.txt', project), 'utf8')
  assert.equal(initialAria.trim(), expectedAria.trim())
  await writeFile(new URL('firefly-v2-panel.aria.txt', artifacts), initialAria)
  const mainComposer = page.locator('textarea:not([aria-label="和流萤对话"])').first()
  const selected = page.locator('[role="treeitem"][aria-selected="true"]')
  const beforeSelection = await selected.innerText()
  await mainComposer.fill('主会话草稿：不能被助手修改')
  await input.fill('你好，请简短介绍一下你可以如何帮助我。')
  await input.press('Enter')
  await page.locator('[data-firefly-studio][data-mode=working]').waitFor()
  assert.equal(await page.locator('.ff-worker-arms').first().evaluate(el => getComputedStyle(el).animationName), 'ff-office-type')
  assert.equal(await page.locator('[data-pixel-character=firefly] .ff-worker-arms').evaluate(el => getComputedStyle(el).animationName), 'ff-office-read')
  assert.equal(await page.locator('[data-pixel-character=stelle] .ff-worker-arms').evaluate(el => getComputedStyle(el).animationName), 'ff-office-sketch')
  await page.screenshot({ path: fileURLToPath(new URL('firefly-studio-working.png', artifacts)) })
  checks.push('Coworker typing animation follows an actual running fixture session')
  await page.waitForFunction(() => document.querySelectorAll('[data-firefly-message="assistant"]').length > 0, { timeout: 25000 })
  assert.equal(await input.inputValue(), '')
  assert.equal(await mainComposer.inputValue(), '主会话草稿：不能被助手修改')
  assert.equal(await selected.innerText(), beforeSelection)
  assert.equal(await panel.locator('[data-firefly-message="user"]').count(), 1)
  assert.ok((await panel.locator('[data-firefly-message="assistant"]').innerText()).includes('你好'))
  const address = await page.evaluate(() => JSON.parse(localStorage.getItem('dsh.firefly.assistant.session.v1')))
  assert.ok(address.sessionId)
  assert.ok(address.workspaceKey)
  checks.push('First message creates a dedicated host fixture session and shows its reply without selecting it')
  checks.push('Main selection, draft and context remain untouched')
  await input.fill('第二条消息，仅属于助手对话。')
  await input.press('Enter')
  await page.waitForFunction(() => document.querySelectorAll('[data-firefly-message="user"]').length === 2)
  await page.waitForFunction(() => document.querySelectorAll('[data-firefly-message="assistant"]').length === 2)
  assert.equal(await selected.innerText(), beforeSelection)
  checks.push('Follow-up messages continue in the same independent conversation')
  await page.screenshot({ path: fileURLToPath(new URL('firefly-v2-conversation.png', artifacts)) })
  await page.locator('[data-firefly-root]').screenshot({ path: fileURLToPath(new URL('firefly-v2-chat-panel.png', artifacts)) })
  const other = page.locator('[role="treeitem"][aria-selected="false"]').filter({ hasText: /^fixture/ }).last()
  await other.click()
  assert.equal(await panel.locator('[data-firefly-message="user"]').count(), 2)
  await input.fill('保留这条助手草稿')
  await input.press('Escape')
  assert.equal(await deviceButton.locator('[data-wing-state]').getAttribute('data-wing-state'), 'closed')
  await page.mouse.move(0, 0)
  await deviceButton.evaluate(el => el.blur())
  await page.waitForFunction(() => [...document.querySelectorAll('.ff-launcher [data-wing-pair]')].every(el => getComputedStyle(el).transform !== 'matrix(1, 0, 0, 1, 0, 0)'))
  assert.equal(await deviceButton.locator('.ff-device-core').evaluate(el => getComputedStyle(el).animationName), 'none')
  await page.locator('.ff-launcher').click()
  assert.equal(await input.inputValue(), '保留这条助手草稿')
  checks.push('Main-session switching and collapse preserve assistant context and draft')
  await input.fill('/permission unsafe')
  await input.press('Enter')
  await panel.getByRole('alert').waitFor()
  assert.equal(await input.inputValue(), '/permission unsafe')
  assert.equal(await panel.locator('[data-firefly-message="user"]').count(), 2)
  checks.push('Slash commands are refused rather than used to alter permissions')
  await input.fill('IME and newline remain in draft')
  await input.dispatchEvent('keydown', { key: 'Enter', isComposing: true })
  await input.press('Shift+Enter')
  assert.equal(await input.inputValue(), "IME and newline remain in draft\n")
  checks.push('IME confirmation and Shift+Enter do not submit')
  await input.fill('')
  await page.getByRole('button', { name: '设置', exact: true }).click()
  const toggle = page.getByRole('switch', { name: '显示 Firefly 助手' })
  await toggle.uncheck()
  assert.equal(await page.locator('[data-firefly-root]').count(), 0)
  await toggle.check()
  await page.getByRole('button', { name: '恢复默认位置' }).click()
  await page.getByRole('dialog').filter({ has: toggle }).getByRole('button', { name: /关闭/ }).first().click()
  assert.equal(await panel.locator('[data-firefly-message="user"]').count(), 2)
  const grip = page.getByRole('button', { name: '拖动助手；方向键微调位置' })
  await grip.press('ArrowLeft')
  const handle = await grip.boundingBox()
  await page.mouse.move(handle.x + 8, handle.y + 8)
  await page.mouse.down()
  await page.mouse.move(handle.x - 80, handle.y - 45, { steps: 6 })
  await page.mouse.up()
  await page.setViewportSize({ width: 390, height: 720 })
  await page.waitForFunction(() => {
    const b = document.querySelector('[data-firefly-root]').getBoundingClientRect()
    return b.x >= 0 && b.y >= 0 && b.right <= innerWidth && b.bottom <= innerHeight
  })
  await page.screenshot({ path: fileURLToPath(new URL('firefly-v2-mobile.png', artifacts)) })
  await page.setViewportSize({ width: 390, height: 400 })
  await page.waitForFunction(() => {
    const b = document.querySelector('[data-firefly-root]').getBoundingClientRect()
    return b.x >= 0 && b.y >= 0 && b.right <= innerWidth && b.bottom <= innerHeight
  })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  assert.equal(await wings.first().evaluate(el => getComputedStyle(el).transitionDuration), '0s')
  await page.locator('.ff-launcher').click()
  assert.equal(await deviceButton.locator('[data-wing-state]').getAttribute('data-wing-state'), 'closed')
  await page.locator('.ff-launcher').click()
  assert.equal(await deviceButton.locator('[data-wing-state]').getAttribute('data-wing-state'), 'open')
  assert.equal(await page.locator('.ff-launcher .ff-device-core').evaluate(el => getComputedStyle(el).animationName), 'none')
  assert.equal(await page.locator('.ff-worker-head').first().evaluate(el => getComputedStyle(el).animationName), 'none')
  for (const selector of ['.ff-room-traces', '.ff-room-pulse', '.ff-desk-aura', '.ff-pc-rotor', '.ff-screen-stars', '.ff-screen-scan', '.ff-screen-train', '.ff-worker-body']) {
    assert.equal(await page.locator(selector).first().evaluate(el => getComputedStyle(el).animationName), 'none', selector + ' respects reduced motion')
  }
  assert.equal(await deviceButton.locator('.dshfa-fire-stream').first().evaluate(el => getComputedStyle(el).animationName), 'none')
  assert.equal(await deviceButton.locator('.dshfa-flame-tongue').first().evaluate(el => getComputedStyle(el).animationName), 'none')
  checks.push('Hide/re-enable, keyboard/pointer movement, short/mobile viewports and reduced-motion work')
  await page.setViewportSize({ width: 1440, height: 960 })
  // The official fixture is in-memory per page, so reload intentionally makes the saved server identity unavailable.
  await page.reload({ waitUntil: 'domcontentloaded' })
  await page.locator('.ff-launcher').waitFor()
  await page.locator('.ff-launcher').click()
  await panel.getByText('原会话已不可用，不会自动创建或改发到主会话。').waitFor()
  assert.equal(await panel.locator('[data-firefly-message]').count(), 0)
  checks.push('Missing saved host session fails closed after refresh; never redirects to main')
  assert.deepEqual(pageErrors, [])
  console.log(JSON.stringify({ rev, checks, pageErrors }, null, 2))
  await writeFile(new URL('browser-report.json', artifacts), JSON.stringify({ mode: 'isolated DSH fixture; no real host calls', url: origin + '/?fixture', rev, checks, pageErrors }, null, 2) + "\n")
} finally { await browser.close() }
