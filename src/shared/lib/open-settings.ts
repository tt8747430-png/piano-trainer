import { useLocation, useNavigate, useRouter } from '@tanstack/react-router'
import { useRef } from 'react'

/** The pages a thing's Settings' window holds: its Settings, and the pages inside it with Back. */
export type SettingsWindowPage = 'settings' | 'publish' | 'export' | 'playlist'

/**
 * A link that opens a thing's page with its Settings' window over it (a song's row ··· › Settings):
 * the window says so in the history entry's state, never in the address, as the app Settings do.
 */
export const OPEN_SETTINGS = { settingsPage: 'settings' } as const

/** A link that opens a thing's page with its window turned to Publish (the score editor's Publish). */
export const OPEN_PUBLISH = { settingsPage: 'publish' } as const

declare module '@tanstack/history' {
  interface HistoryState {
    /** The page of a thing's Settings' window a link opened it on (`OPEN_SETTINGS`, `OPEN_PUBLISH`). */
    settingsPage?: SettingsWindowPage
  }
}

/** Whether a thing's Settings' window is open, and how it opens and closes: a window of one page. */
export interface SettingsWindowOpen {
  readonly open: boolean
  readonly onOpenChange: (open: boolean) => void
}

/** A window with pages inside it: the page it shows, and how it turns to another. */
export interface SettingsWindowState extends SettingsWindowOpen {
  readonly page: SettingsWindowPage
  readonly onPage: (page: SettingsWindowPage) => void
}

/**
 * A thing's Settings' window over its page: closed, or the one page it shows, held by the history
 * entry's state, never the address, as the app Settings' places are. Opening it from the page (its ···
 * or gear, `openAt`) and turning to a page inside it each add an entry, so Back steps out of the page
 * inside, then out of the window, and × or Escape go back past them all. A link may open the page with
 * its window up (`OPEN_SETTINGS`, `OPEN_PUBLISH`); closing that one takes the word out of its entry.
 */
export function useSettingsWindow(): SettingsWindowState & {
  readonly openAt: (page: SettingsWindowPage) => void
} {
  const shown = useLocation({ select: (location) => location.state.settingsPage ?? null })
  const navigate = useNavigate()
  const { history } = useRouter()
  // Where in history the page under the window stands, when the window added entries over it.
  const under = useRef<number | null>(null)
  const at = () => history.location.state.__TSR_index
  const show = (page: SettingsWindowPage | undefined, replace = false) =>
    void navigate({
      to: '.',
      search: true,
      replace,
      state: (entry) => ({ ...entry, settingsPage: page }),
    })
  // The window's pages in the entries over that page, in order: going to one already behind steps
  // back to it (Back from New playlist to Move to, Create back to Settings); a new one is pushed.
  const trail = useRef<SettingsWindowPage[]>([])
  const openAt = (page: SettingsWindowPage) => {
    if (shown === null) {
      under.current = at()
      trail.current = []
    }
    trail.current.push(page)
    show(page)
  }
  const onPage = (page: SettingsWindowPage) => {
    if (under.current === null) return show(page)
    trail.current = trail.current.slice(0, at() - under.current)
    const behind = trail.current.lastIndexOf(page)
    if (behind >= 0 && behind < trail.current.length - 1) {
      history.go(behind - (trail.current.length - 1))
      trail.current = trail.current.slice(0, behind + 1)
      return
    }
    trail.current.push(page)
    show(page)
  }
  const onOpenChange = (open: boolean) => {
    if (open) return shown === null ? openAt('settings') : undefined
    const steps = under.current === null ? 0 : at() - under.current
    under.current = null
    if (steps > 0) history.go(-steps)
    else show(undefined, true)
  }
  return { open: shown !== null, onOpenChange, page: shown ?? 'settings', onPage, openAt }
}
