import { useLocation, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'

/**
 * A link that opens a thing's page with its Settings' window over it (a song's row ··· › Settings):
 * the window says so in the history entry's state, never in the address, as the app Settings do.
 */
export const OPEN_SETTINGS = { thingSettings: 'settings' } as const

/** A link that opens a thing's page with its window turned to Publish (the score editor's Publish). */
export const OPEN_PUBLISH = { thingSettings: 'publish' } as const

/** The pages a thing's Settings' window holds: its Settings, and Publish inside it. */
export type SettingsWindowPage = 'settings' | 'publish'

declare module '@tanstack/history' {
  interface HistoryState {
    /** Opened by `OPEN_SETTINGS` or `OPEN_PUBLISH`. */
    thingSettings?: SettingsWindowPage
  }
}

/** Whether a thing's Settings' window is open, the page it shows, and how it opens and closes. */
export interface SettingsWindowState {
  readonly open: boolean
  readonly onOpenChange: (open: boolean) => void
  readonly page: SettingsWindowPage
  readonly onPage: (page: SettingsWindowPage) => void
}

/**
 * Whether a thing's Settings' window is open over its page, and on which of its pages: opened from
 * the page (its ··· or gear, `openAt`) or by a link that said so (`OPEN_SETTINGS`, `OPEN_PUBLISH`);
 * closing it takes the word out of the entry, so neither a reload nor a Back to it opens it again.
 */
export function useSettingsWindow(): SettingsWindowState & {
  readonly openAt: (page: SettingsWindowPage) => void
} {
  const asked = useLocation({ select: (location) => location.state.thingSettings })
  const navigate = useNavigate()
  const [open, setOpen] = useState(asked !== undefined)
  const [page, setPage] = useState<SettingsWindowPage>(asked ?? 'settings')
  const onOpenChange = (next: boolean) => {
    setOpen(next)
    if (next) return
    setPage('settings')
    if (asked !== undefined) void navigate({ to: '.', replace: true, state: {} })
  }
  const openAt = (at: SettingsWindowPage) => {
    setPage(at)
    setOpen(true)
  }
  return { open, onOpenChange, page, onPage: setPage, openAt }
}
