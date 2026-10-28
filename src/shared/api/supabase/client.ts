import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

export type PianoClient = SupabaseClient<Database>

/**
 * The app's one Supabase client (ADR 0116), built in the composition root from the project's URL and
 * publishable key (`.env.production`; a publishable key is made to be in the client). Sign-in comes
 * back through the PKCE code at `/auth/callback`; the session is kept and refreshed by the client.
 */
export function createSupabaseClient(url: string, publishableKey: string): PianoClient {
  return createClient<Database>(url, publishableKey, {
    auth: {
      flowType: 'pkce',
      detectSessionInUrl: false,
      persistSession: true,
      autoRefreshToken: true,
    },
  })
}
