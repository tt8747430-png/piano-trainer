import { createContext, useContext, type ReactNode } from 'react'

/**
 * What the app's shell gives a screen that cannot open (`RouteState`): the bar's tools a place carries
 * (Search, on a phone), and a way to keep the tab bar while it shows, so the learner is never stranded
 * on a page that has no Back (the AppLayers board's route states).
 */
export interface RouteShell {
  readonly tools: ReactNode
  readonly showing: (on: boolean) => void
}

export const RouteShellContext = createContext<RouteShell | null>(null)

export const useRouteShell = () => useContext(RouteShellContext)
