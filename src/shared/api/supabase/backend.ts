import type { PianoClient } from './client'

/**
 * The project's client, loaded when first asked for (ADR 0116): supabase-js stays out of the app's
 * first chunk, and the first call after the first paint brings it.
 */
export type Backend = () => Promise<PianoClient>

/** The client for the project at `url`, its module loaded once, on the first call. */
export function lazyBackend(url: string, publishableKey: string): Backend {
  let client: Promise<PianoClient> | undefined
  return () =>
    (client ??= import('./client').then(({ createSupabaseClient }) =>
      createSupabaseClient(url, publishableKey),
    ))
}

/** A client already made: a script's or a test's. */
export const backendOf =
  (client: PianoClient): Backend =>
  async () =>
    client
