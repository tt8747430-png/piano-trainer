/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/react" />

interface ImportMetaEnv {
  /** The Supabase project's URL (`.env`, ADR 0116). */
  readonly VITE_SUPABASE_URL: string
  /** The project's publishable key: public, held in check by row-level security. */
  readonly VITE_SUPABASE_PUBLISHABLE_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
