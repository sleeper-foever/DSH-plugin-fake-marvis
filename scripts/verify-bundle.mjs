/** Keyless smoke of the exact published browser artifact; no server or host composition. */
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { dirname, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { createContext, Script } from 'node:vm'
import { JSDOM } from 'jsdom'
import * as React from 'react'
import * as jsxRuntime from 'react/jsx-runtime'

const require = createRequire(import.meta.url)
const runtimeRoot = dirname(require.resolve('@deepseek-ai/dsh-client-runtime/package.json'))
// Use the real emitted snapshot-store engine without booting the transport-bearing runtime plugin.
const runtime = await import(pathToFileURL(resolve(runtimeRoot, 'lib/types/client/contract/store.js')).href)
const filename = new URL('../lib/client.js', import.meta.url)
const code = await readFile(filename, 'utf8')
const dom = new JSDOM('<!doctype html><html><head></head><body></body></html>', { url: 'https://firefly-smoke.invalid/' })
const { window } = dom
const { document } = window
const registrations = new Map()
const locales = new Map()
const declarations = new Set(['shell.overlay', 'settings.general.item'])
const waiting = new Set()
const factories = new Map()
const modules = new Map([
  ['react', React], ['react/jsx-runtime', jsxRuntime], ['@deepseek-ai/dsh-client-runtime/client', runtime],
  // This smoke exercises registration, not Markdown rendering or the primitives CSS bundle.
  ['@deepseek-ai/dsh-client-ui-primitives', { MarkdownText: () => { throw new Error('Registration smoke must not render Markdown') } }],
])
let materializations = 0
window.__ModuleLoader__ = {
  load(row) {
    assert.equal(row.id, 'dsh-firefly-assistant')
    assert.equal(typeof row.factory, 'function')
    assert.equal(factories.has(row.id), false, 'bundle factory registered twice')
    factories.set(row.id, row.factory)
  },
}
const sandbox = createContext({ window, document, console })
new Script(code, { filename: filename.pathname }).runInContext(sandbox, { timeout: 5000 })
assert.equal(factories.size, 1)
assert.equal(registrations.size, 0)
assert.equal(document.head.childElementCount, 0, 'script execution must not activate styles')

function load(id) {
  if (modules.has(id)) return modules.get(id)
  const factory = factories.get(id)
  assert.ok(factory, 'undeclared module request: ' + id)
  materializations++
  const exports = factory(load)
  modules.set(id, exports)
  return exports
}
const plugin = load('dsh-firefly-assistant')
assert.equal(load('dsh-firefly-assistant'), plugin)
assert.equal(materializations, 1, 'module factory must be lazy and memoized')
assert.deepEqual(Array.from(plugin.inject).sort(), ['connection', 'conversation', 'locale', 'sessions', 'slots', 'workspaces'])
assert.equal(typeof plugin.apply, 'function')
const defaults = plugin.Config({})
assert.deepEqual(JSON.parse(JSON.stringify(defaults)), { enabled: true, defaultRight: 24, defaultBottom: 80, historyRefreshMs: 1200, publicationTimeoutMs: 10000 })
assert.throws(() => plugin.Config({ defaultRight: -1 }))
assert.equal(document.head.childElementCount, 0, 'materialization must not activate the plugin')

/** Minimal scoped service fixture: registration disposal belongs to the calling plugin. */
function scope() {
  let active = true
  const effects = []
  const subscribers = new Set()
  const forbiddenCalls = []
  const forbid = name => () => { forbiddenCalls.push(name); throw new Error('Passive mount attempted ' + name) }
  const cell = value => ({ getSnapshot: () => value, subscribe(listener) {
    subscribers.add(listener)
    return () => { assert.equal(subscribers.delete(listener), true, 'subscription disposed twice') }
  } })
  const mainId = 'main-session'
  const main = { id: mainId, displayTitle: 'Unrelated main chat', running: false, blank: false }
  const list = cell({ ids: [mainId], current: mainId, byId: { [mainId]: main }, phase: 'ready', currentAddress: undefined })
  const workspaces = cell({ items: [], baselinesReady: true, phase: 'ready', archivedSessionIds: [] })
  const connection = { hostDescription: cell(undefined), api: { sessions: { create: forbid('create'), rename: forbid('rename'), history: forbid('history') },
    models: { list: forbid('models.list') } } }
  const own = dispose => {
    let live = true
    const once = () => { if (!live) return; live = false; dispose() }
    effects.push(once)
    return once
  }
  const evaluate = callback => {
    const result = callback()
    if (typeof result === 'function') return result
    const undo = []
    try { for (const dispose of result) undo.push(dispose) }
    catch (error) { for (const dispose of undo.reverse()) dispose(); throw error }
    return () => { for (const dispose of undo.reverse()) dispose() }
  }
  const ctx = {
    effect(callback) { assert.ok(active); return own(evaluate(callback)) },
    get(name) { assert.equal(name, 'connection'); return connection },
    locale: {
      register(namespace, language, dictionary) {
        const key = namespace + ':' + language
        assert.equal(locales.has(key), false, 'duplicate locale: ' + key)
        locales.set(key, dictionary)
        return () => { assert.equal(locales.delete(key), true, 'locale disposed twice') }
      },
    },
    slots: {
      inject(name, callback) {
        assert.ok(declarations.has(name), 'injection target missing: ' + name)
        assert.equal(waiting.has(name), false, 'duplicate declaration listener')
        waiting.add(name)
        const dispose = evaluate(callback)
        return own(() => { dispose(); assert.equal(waiting.delete(name), true) })
      },
      register(options, component) {
        assert.ok(active)
        assert.ok(declarations.has(options.name), 'undeclared slot: ' + options.name)
        const key = options.name + ':' + (options.id ?? '')
        assert.equal(registrations.has(key), false, 'duplicate registration: ' + key)
        assert.equal(typeof component, 'function')
        const children = Object.keys(options.children ?? {})
        for (const child of children) {
          assert.equal(declarations.has(child), false, 'duplicate child declaration')
          declarations.add(child)
        }
        registrations.set(key, { options, component })
        return own(() => {
          assert.equal(registrations.delete(key), true)
          for (const child of children) assert.equal(declarations.delete(child), true)
        })
      },
    },
    sessions: { list, binding: forbid('sessions.binding'), open: forbid('sessions.open') },
    conversation: { blocks: { storeFor: forbid('conversation.blocks.storeFor') } },
    workspaces: { list: workspaces },
    connection,
  }
  return { ctx, subscribers, forbiddenCalls, dispose() {
    if (!active) return
    active = false
    for (const dispose of effects.reverse()) dispose()
  } }

}

try {
  for (let round = 1; round <= 2; round++) {
    const lifetime = scope()
    let root
    try {
      plugin.apply(lifetime.ctx, plugin.Config({}))
      assert.deepEqual([...registrations.keys()].sort(), [
        'settings.general.item:firefly-assistant', 'shell.overlay:firefly-assistant',
      ])
      assert.deepEqual([...locales.keys()].sort(), ['firefly-assistant:en', 'firefly-assistant:zh'])
      assert.deepEqual(Object.keys(locales.get('firefly-assistant:en')).sort(), Object.keys(locales.get('firefly-assistant:zh')).sort())
      const styles = document.querySelectorAll('style[data-plugin="dsh-firefly-assistant"]')
      assert.equal(styles.length, 1)
      assert.match(styles[0].textContent, /dsh-firefly-assistant-dock/)
      const overlay = registrations.get('shell.overlay:firefly-assistant')
      assert.equal(overlay.options.children, undefined, 'independent root must not declare a current-session child')
      assert.equal(overlay.options.store.spec.persist, undefined, 'private draft must not be persisted')
      const view = overlay.options.store.create()
      root = overlay.options.inject(view.actions)
      const settings = registrations.get('settings.general.item:firefly-assistant').options.inject()
      assert.equal(root.hooks.preferences, settings.hooks.preferences)
      assert.equal(root.hooks.assistant.getSnapshot().phase, 'empty')
      assert.equal(root.hooks.assistant.getSnapshot().sessionId, undefined)
      assert.deepEqual(Array.from(root.hooks.assistant.getSnapshot().messages), [])
      for (const name of ['startChat', 'sendMessage', 'selectWorkspace', 'resetChat', 'reveal', 'refresh', 'loadOlder']) {
        assert.equal(typeof root[name], 'function', 'missing dedicated action ' + name)
      }
      settings.setEnabled(false)
      assert.equal(root.hooks.preferences.getSnapshot().values.enabled, false)
      settings.setEnabled(true)
      root.setPosition({ right: 123, bottom: 234 })
      settings.resetPosition()
      assert.equal(root.hooks.preferences.getSnapshot().values.right, defaults.defaultRight)
      assert.equal(root.hooks.preferences.getSnapshot().values.bottom, defaults.defaultBottom)
      view.actions.editDraft('private text never persisted')
      view.actions.expand(true)
      view.actions.expand(false)
      assert.equal(view.getSnapshot().draft.text, 'private text never persisted')
      assert.equal(window.localStorage.length, 1)
      assert.deepEqual(Object.keys(JSON.parse(window.localStorage.getItem('dsh.firefly-assistant.v1'))).sort(), ['bottom', 'enabled', 'right', 'version'])
      assert.deepEqual(lifetime.forbiddenCalls, [], 'mount must not access the main session or send host requests')
      assert.equal(lifetime.subscribers.size, 3, 'controller must watch session/workspace directories and host reconnects')
    } finally {
      lifetime.dispose()
      lifetime.dispose()
    }
    assert.equal(registrations.size, 0, 'slot entries survived unload')
    assert.equal(locales.size, 0, 'locale dictionaries survived unload')
    assert.equal(waiting.size, 0, 'declaration listeners survived unload')
    assert.equal(lifetime.subscribers.size, 0, 'controller subscriptions survived unload')
    assert.deepEqual([...declarations].sort(), ['settings.general.item', 'shell.overlay'])
    assert.equal(document.head.childElementCount, 0, 'styles survived unload')
    await root.sendMessage({ text: 'late callback', revision: 0 })
    await root.startChat('late-workspace', { text: 'late start', revision: 0 })
    assert.deepEqual(lifetime.forbiddenCalls, [], 'disposed callbacks reached host services')
    console.log('PASS independent bundle round ' + round + ': lazy artifact, defaults, passive root registration and full cleanup')
  }
} finally {
  window.close()
}
