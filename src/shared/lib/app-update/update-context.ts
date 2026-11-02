import { createContext } from 'react'

import type { AppUpdate } from './app-update'

/** The app's one update state, given by `AppUpdateProvider`. */
export const AppUpdateContext = createContext<AppUpdate | null>(null)
