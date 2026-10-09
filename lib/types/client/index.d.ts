import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client';
import { Config, type Config as FireflyConfig } from '../config.ts';
export { Config };
/** Existing DSH services; the assistant owns neither a transport nor a model provider. */
export declare const inject: string[];
/**
 * Register the independent assistant and its browser-local visibility controls.
 * @param ctx - Browser plugin context supplied by DSH.
 * @param config - Validated browser defaults.
 */
export declare function apply(ctx: ClientContext, config: FireflyConfig): void;
