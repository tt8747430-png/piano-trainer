import { createContext, useContext } from 'react'

/** Whether Scale settings, the gear's sheet, is open, and how the page opens and shuts it. */
export interface ScaleSettingsSheet {
  readonly open: boolean
  readonly onOpenChange: (open: boolean) => void
}

const ScaleSettingsContext = createContext<ScaleSettingsSheet>({
  open: false,
  onOpenChange: () => {},
})

export const ScaleSettingsProvider = ScaleSettingsContext.Provider
export const useScaleSettingsSheet = (): ScaleSettingsSheet => useContext(ScaleSettingsContext)
