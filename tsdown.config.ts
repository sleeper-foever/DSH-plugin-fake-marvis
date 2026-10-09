import { readFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { defineConfig } from 'tsdown'

export default defineConfig([
  {
    entry: { index: 'src/index.ts' },
    outDir: 'lib', format: 'esm', platform: 'node', tsconfig: 'tsconfig.host.json',
    outputOptions: { entryFileNames: 'index.js' }, dts: false, clean: false,
  },
  {
    entry: { client: 'src/client/index.ts' },
    outDir: 'lib', format: 'cjs', platform: 'browser', tsconfig: 'tsconfig.client.json',
    dts: false, clean: false,
    define: { 'process.env.NODE_ENV': JSON.stringify('production') },
    deps: {
      neverBundle: ['@deepseek-ai/cordis', '@deepseek-ai/dsh-client-runtime/client', '@deepseek-ai/dsh-client-ui-primitives', 'react', 'react-dom', 'react/jsx-runtime'],
      alwaysBundle: ['@deepseek-ai/schemastery', '@deepseek-ai/cosmokit'],
    },
    plugins: [{
      name: 'firefly-inline-styles',
      resolveId(id, importer) {
        if (id.endsWith('.css?inline') && importer) return resolve(dirname(importer), id)
      },
      async load(id) {
        if (!id.endsWith('.css?inline')) return
        const file = id.slice(0, -'?inline'.length)
        this.addWatchFile(file)
        return { code: 'export default ' + JSON.stringify(await readFile(file, 'utf8')), moduleType: 'js' }
      },
    }],
    outputOptions: {
      entryFileNames: 'client.js',
      banner: 'window.__ModuleLoader__.load({ id: "dsh-firefly-assistant", factory: (require) => {',
      intro: 'var module = { exports: {} }; var exports = module.exports;',
      footer: 'return module.exports; } });',
    },
  },
])
