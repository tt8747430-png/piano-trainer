import { createContext, use } from 'react'

/** Opens the shortcuts' sheet; outside `ShortcutsHelp`, nothing to open. */
export const OpenShortcutsContext = createContext<() => void>(() => {})

/** Opens the shortcuts' sheet from a row of a menu of its own (the editor's gear, F23). */
export const useOpenShortcuts = (): (() => void) => use(OpenShortcutsContext)
