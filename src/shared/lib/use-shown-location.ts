import { useRouterState, type ParsedLocation } from '@tanstack/react-router'

/**
 * What the app's chrome reads of the address (the sidebar's current place, Songs' places, the
 * account row): the page on screen, not the one still loading. A move to a page whose code is
 * still coming keeps the old page up for a moment; the chrome stays with it, so the sidebar and the
 * page change in the same frame, never the sidebar first.
 */
export function useShownLocation(): ParsedLocation {
  return useRouterState({ select: (state) => state.resolvedLocation ?? state.location })
}
