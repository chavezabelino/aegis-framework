/**
 * @aegisBlueprint: svelte-drizzle-adapter
 * @version: 1.0.0
 * @mode: strict
 * @intent: Main entry point for Aegis Svelte adapter package
 * @context: Export adapter and patterns for Svelte/Drizzle/Neon applications
 * @model: claude-3-5-sonnet
 * @hash: 091c413d13e235723cce2b5b68d2115a18d7c224bb4ca3c3ba334d72bbac5edb
 */

export { SvelteDrizzleAdapter } from './adapter';
export type { SvelteDrizzleAdapterConfig, SvelteComponent, DrizzleSchema } from './adapter';

export * from './patterns';
export * from './utils';
