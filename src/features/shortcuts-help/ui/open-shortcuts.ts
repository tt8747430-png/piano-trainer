import { createContext } from 'react'

/** Opens the shortcuts' sheet; outside `ShortcutsHelp`, nothing to open. */
export const OpenShortcutsContext = createContext<() => void>(() => {})
