import type { Theme } from '@/entities/settings'

export const DARK_QUERY = '(prefers-color-scheme: dark)'

/** Mirrored by index.html's #theme-boot script; src/app/theme-boot.test.ts holds the two together. */
export function resolveTheme(theme: Theme, prefersDark: boolean): 'light' | 'dark' {
  if (theme !== 'system') return theme
  return prefersDark ? 'dark' : 'light'
}
