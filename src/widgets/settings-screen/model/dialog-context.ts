import { useRouterState } from '@tanstack/react-router'
import { createContext, use } from 'react'

/** What the laptop's Settings dialog holds open: the Settings path it shows over the page behind. */
export interface SettingsDialogPlace {
  readonly path: string
}

export const SettingsDialogContext = createContext<SettingsDialogPlace | null>(null)

/** The Settings dialog a pane stands in, or null for a page of its own (a phone, a deep link). */
export function useSettingsDialog(): SettingsDialogPlace | null {
  return use(SettingsDialogContext)
}

/** The Settings path shown: the dialog's on a laptop, else the page's own address. */
export function useSettingsPath(): string {
  const dialog = useSettingsDialog()
  const path = useRouterState({ select: (state) => state.location.pathname })
  return dialog?.path ?? path
}
