import { useRouterState } from '@tanstack/react-router'
import { createContext, use, useEffect } from 'react'
import type { AdminSection } from './sections'

/** What waits in Administration's sections, by section: the counts its nav carries (the Admin board). */
export type AdminCounts = Partial<Readonly<Record<AdminSection, number>>>

/**
 * What the laptop's Settings dialog holds open: the Settings path it shows over the page behind, and
 * where a pane hands its nav Administration's counts.
 */
export interface SettingsDialogPlace {
  readonly path: string
  readonly showCounts: (counts: AdminCounts) => void
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

/** Hands the dialog's nav what waits in Administration's sections, while this pane is open in it. */
export function useAdminNavCounts(counts: AdminCounts | null) {
  const dialog = useSettingsDialog()
  const show = dialog?.showCounts
  useEffect(() => {
    if (show && counts) show(counts)
  }, [show, counts])
}
