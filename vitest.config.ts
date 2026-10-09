import { defineConfig } from 'vitest/config'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)

export default defineConfig({
  resolve: {
    alias: { '@deepseek-ai/dsh-client-runtime/client': require.resolve('@deepseek-ai/dsh-client-runtime/src/client/contract/store.ts') },
  },
  test: {
    include: ['tests/**/*.test.{ts,tsx}'],
    environment: 'jsdom',
    restoreMocks: true,
    clearMocks: true,
  },
})
