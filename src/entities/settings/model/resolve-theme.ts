import type { Theme } from './types'

/** The theme actually painted: a chosen one, or the OS scheme on "system". */
export type PaintedTheme = 'light' | 'dark'

/** Mirrored by index.html's #theme-boot script; src/app/theme-boot.test.ts holds the two together. */
export function resolveTheme(theme: Theme, prefersDark: boolean): PaintedTheme {
  if (theme !== 'system') return theme
  return prefersDark ? 'dark' : 'light'
}
