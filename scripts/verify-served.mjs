import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import { chromium } from 'playwright'

const url = process.argv[2] ?? 'http://127.0.0.1:3080/'
const browser = await chromium.launch({ headless: true })
try {
  const page = await browser.newPage()
  const response = await page.goto(url, { waitUntil: 'domcontentloaded' })
  assert.equal(response.status(), 200)
  await page.reload({ waitUntil: 'domcontentloaded' })
  const row = await page.evaluate(() => window.__DSH_BOOT__?.entries.find(entry => entry.id === 'dsh-firefly-assistant'))
  assert.ok(row, 'Current host does not list the installed Firefly plugin')
  const result = await page.request.get(new URL(row.url, url).href)
  assert.equal(result.status(), 200)
  const remote = await result.body()
  const local = await readFile(new URL('../lib/client.js', import.meta.url))
  const digest = bytes => createHash('sha256').update(bytes).digest('hex')
  assert.equal(digest(remote), digest(local), 'Current URL serves a stale Firefly client artifact')
  console.log(JSON.stringify({ url, plugin: row.id, clientUrl: row.url, sha256: digest(remote),
    matchingBuiltClient: true, loginRequired: await page.locator('input[type=password]').isVisible().catch(() => false) }, null, 2))
} finally { await browser.close() }
