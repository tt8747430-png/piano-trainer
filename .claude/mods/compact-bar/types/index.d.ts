export type CompactBarInfo = {
  /** When the last main-loop response arrived, in $.clock.now() ms; null before one. */
  lastResponseAt: number | null
  /** The prompt cache's lifetime in ms: 5 minutes or 1 hour. */
  ttlMs: number
  /** Where ttlMs came from: 'hook' (the engine said), 'seen' (observed), 'guess'. */
  ttlSource: 'hook' | 'seen' | 'guess'
  /** Share of the last response's input served from the cache, 0..100; null before one. */
  hitRate: number | null
  /** Context fill against the model's window, 0..100; null before a response. */
  contextPercent: number | null
  /** The auto-compact threshold as a percent of the window. */
  thresholdPercent: number
}

declare module 'claude-code' {
  interface PluginState {
    'compact-bar': { info: CompactBarInfo; collapsed: boolean; tick: number; isWorking: boolean; pending: boolean }
  }
}
