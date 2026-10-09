import { createRequire } from 'node:module'
import { existsSync, lstatSync, mkdirSync, readFileSync, realpathSync, symlinkSync } from 'node:fs'
import { dirname, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const project = fileURLToPath(new URL('..', import.meta.url))
const harness = resolve(project, process.argv[2] ?? '../..')
const rootPackage = JSON.parse(readFileSync(resolve(harness, 'package.json'), 'utf8'))
if (rootPackage.name !== '@deepseek-ai/dsh-root') throw new Error('Expected a built DeepSeek Harness checkout')
const packageJson = JSON.parse(readFileSync(resolve(project, 'package.json'), 'utf8'))
const rootRequire = createRequire(resolve(harness, 'package.json'))
const webRequire = createRequire(resolve(harness, 'apps/web/package.json'))

for (const name of Object.keys(packageJson.devDependencies)) {
  let target
  if (name === '@deepseek-ai/cordis') target = resolve(harness, 'vendor/cordis')
  else if (name === '@deepseek-ai/schemastery') target = resolve(harness, 'vendor/schemastery')
  else if (name.startsWith('@deepseek-ai/dsh-client-')) target = resolve(harness, 'packages/client', name.slice('@deepseek-ai/dsh-client-'.length))
  else {
    let entry
    try { entry = rootRequire.resolve(name + '/package.json') }
    catch (error) {
      if (error.code !== 'MODULE_NOT_FOUND' && error.code !== 'ERR_PACKAGE_PATH_NOT_EXPORTED') throw error
      entry = webRequire.resolve(name + '/package.json')
    }
    target = dirname(entry)
  }
  if (!existsSync(resolve(target, 'package.json'))) throw new Error('Missing installed local dependency: ' + name)
  const link = resolve(project, 'node_modules', name)
  mkdirSync(dirname(link), { recursive: true })
  if (existsSync(link) || (() => { try { lstatSync(link); return true } catch (error) { if (error.code === 'ENOENT') return false; throw error } })()) {
    if (realpathSync(link) !== realpathSync(target)) throw new Error('Existing dependency points elsewhere; inspect it before replacing: ' + link)
  } else {
    symlinkSync(relative(dirname(link), target), link, process.platform === 'win32' ? 'junction' : 'dir')
  }
}
if (process.platform !== 'win32') {
  const binDir = resolve(project, 'node_modules/.bin')
  mkdirSync(binDir, { recursive: true })
  for (const [name, entry] of Object.entries({ tsc: 'typescript/bin/tsc', tsdown: 'tsdown/dist/run.mjs', vitest: 'vitest/vitest.mjs' })) {
    const link = resolve(binDir, name)
    if (!existsSync(link)) symlinkSync(relative(binDir, resolve(project, 'node_modules', entry)), link)
  }
}
console.log('Linked local development dependencies inside ' + resolve(project, 'node_modules'))
console.log('No profile, workspace manifest, or lockfile was changed.')
