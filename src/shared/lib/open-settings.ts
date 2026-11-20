import { useLocation, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'

/**
 * A link that opens a thing's page with its Settings' window over it (a song's row ··· › Settings):
 * the window says so in the history entry's state, never in the address, as the app Settings do.
 */
export const OPEN_SETTINGS = { thingSettings: true } as const

declare module '@tanstack/history' {
  interface HistoryState {
    /** Opened by `OPEN_SETTINGS`. */
    thingSettings?: true
  }
}

/**
 * Whether a thing's Settings' window is open over its page: opened from the page (its ··· or gear) or
 * by a link that said so (`OPEN_SETTINGS`); closing it takes the word out of the entry, so neither a
 * reload nor a Back to it opens the window again.
 */
export function useSettingsWindow() {
  const asked = useLocation({ select: (location) => location.state.thingSettings === true })
  const navigate = useNavigate()
  const [open, setOpen] = useState(asked)
  const onOpenChange = (next: boolean) => {
    setOpen(next)
    if (!next && asked) void navigate({ to: '.', replace: true, state: {} })
  }
  return { open, onOpenChange } as const
}
