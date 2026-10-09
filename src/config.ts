import Schema from '@deepseek-ai/schemastery'

/** Browser-loader defaults; user preferences are stored per browser origin, not in host config. */
export interface Config {
  enabled: boolean
  defaultRight: number
  defaultBottom: number
  historyRefreshMs: number
  publicationTimeoutMs: number
}

/** Validated defaults for the Firefly assistant. */
export const Config: Schema<Config> = Schema.object({
  enabled: Schema.boolean().default(true),
  defaultRight: Schema.number().min(8).default(24),
  defaultBottom: Schema.number().min(8).default(80),
  historyRefreshMs: Schema.number().min(500).max(60000).default(1200),
  publicationTimeoutMs: Schema.number().min(1000).max(60000).default(10000),
})
