/**
 * The colours the browser paints around the page: the toolbar (`<meta name="theme-color">`) and the
 * installed app's title bar and splash screen (the manifest). CSS cannot reach them, so each theme's
 * page background is repeated here, and theme-colors.test.ts holds it to `--background` in
 * src/styles/tokens.css.
 */
export const THEME_COLORS = { light: '#f7f3ee', dark: '#191512' } as const

/**
 * The status bar's ground under a screen whose own bar continues it (the Chord player's phone header on
 * the card's paper, the boards' `bar=SHEET`): each theme's `--card`, held by theme-colors.test.ts.
 */
export const BAR_COLORS = { light: '#fefdfb', dark: '#24201c' } as const
