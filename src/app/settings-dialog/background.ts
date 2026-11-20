import { redirect, type ParsedLocation } from '@tanstack/react-router'
import { LAPTOP } from '@/shared/lib'

/** The search param that holds the Settings path the laptop's dialog shows over its page. */
export const SETTINGS_PARAM = 'settings'

/** The page Settings was opened from: what the dialog stands over and what closing it returns to. */
let background = '/'

/** The address with the dialog's param set to a Settings path, or taken off with none. */
export function withSettings(href: string, path: string | null): string {
  const url = new URL(href, 'https://app.invalid')
  if (path === null) url.searchParams.delete(SETTINGS_PARAM)
  else url.searchParams.set(SETTINGS_PARAM, path)
  return `${url.pathname}${url.search}${url.hash}`
}

/** Keeps the page a Settings dialog would open over (every page but Settings' own), its param off. */
export function rememberBackground(href: string): void {
  background = withSettings(href, null)
}

/** The page behind the dialog, its param off: where the dialog's × goes. */
export function backgroundHref(): string {
  return background
}

/**
 * On a laptop a Settings place opens as claude.ai's dialog over the page it was opened from (the
 * board's SETDLG): the place's own address turns into that page's with the place in its search, so
 * every link to Settings, a row's, Search's or the sidebar's, opens the dialog. A phone keeps the page.
 */
export const opensAsDialog = {
  beforeLoad: ({ location }: { location: ParsedLocation }) => {
    if (typeof window === 'undefined' || !window.matchMedia(LAPTOP).matches) return
    const path = location.pathname === '/settings' ? '/settings/general' : location.pathname
    throw redirect({ href: withSettings(background, path), replace: true })
  },
}
