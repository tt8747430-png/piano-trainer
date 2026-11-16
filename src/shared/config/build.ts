/** The build's version, as About says it (vite.config.ts). */
export const APP_BUILD: string = __APP_BUILD__
/** The app's version (package.json's), as About says it. */
export const APP_VERSION: string = __APP_VERSION__
/** The welcome is skipped in a development build when `VITE_SKIP_WELCOME` is `true`; a production build always shows it. */
export const SKIP_WELCOME: boolean =
  import.meta.env.DEV && import.meta.env.VITE_SKIP_WELCOME === 'true'
