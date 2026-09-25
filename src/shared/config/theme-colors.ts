/**
 * The colours the browser paints around the page: the toolbar (`<meta name="theme-color">`) and the
 * installed app's title bar and splash screen (the manifest). CSS cannot reach them, so each theme's
 * page background is repeated here, and theme-colors.test.ts holds it to `--background` in
 * src/styles/tokens.css.
 */
export const THEME_COLORS = { light: '#f3f6f3', dark: '#0d1210' } as const
