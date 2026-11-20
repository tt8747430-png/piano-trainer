import { redirect, type ParsedLocation } from '@tanstack/react-router'
import { LAPTOP } from '@/shared/lib'

declare module '@tanstack/history' {
  interface HistoryState {
    /** The Settings place the laptop's dialog shows over this entry's page, kept out of its address. */
    settings?: string
  }
}

/** The page Settings was opened from: what the dialog stands over and what closing it returns to. */
let background = '/'

/** Keeps the page a Settings dialog would open over (every page but Settings' own). */
export function rememberBackground(href: string): void {
  background = href
}

/** The page behind the dialog: where the dialog's × goes. */
export function backgroundHref(): string {
  return background
}

/**
 * On a laptop a Settings place opens as claude.ai's dialog over the page it was opened from (the
 * board's SETDLG): the place's own address turns back into that page's, the place held in the
 * history entry's state, never the address, so the address stays the page's while the learner moves
 * between Settings' places (as claude.ai's). Every link to Settings, a row's, Search's or the
 * sidebar's, opens the dialog. A phone keeps the page.
 */
export const opensAsDialog = {
  beforeLoad: ({ location }: { location: ParsedLocation }) => {
    if (typeof window === 'undefined' || !window.matchMedia(LAPTOP).matches) return
    const path = location.pathname === '/settings' ? '/settings/general' : location.pathname
    throw redirect({ href: background, replace: true, state: { settings: path } })
  },
}
