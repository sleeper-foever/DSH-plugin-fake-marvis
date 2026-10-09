import Schema from '@deepseek-ai/schemastery';
/** Browser-loader defaults; user preferences are stored per browser origin, not in host config. */
export interface Config {
    enabled: boolean;
    defaultRight: number;
    defaultBottom: number;
    historyRefreshMs: number;
    publicationTimeoutMs: number;
}
/** Validated defaults for the Firefly assistant. */
export declare const Config: Schema<Config>;
