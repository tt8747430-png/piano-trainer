/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/react" />

interface ImportMetaEnv {
  /** The Supabase project's URL (the host's environment, `.env.example`; ADR 0116). */
  readonly VITE_SUPABASE_URL: string
  /** The project's publishable key: public, held in check by row-level security. */
  readonly VITE_SUPABASE_PUBLISHABLE_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

/** The build's version: the commit it was built from, or `dev` (vite.config.ts). */
declare const __APP_BUILD__: string
