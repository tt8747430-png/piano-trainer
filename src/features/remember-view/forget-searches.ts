import type { ViewsStore } from '@/entities/views'

/** Lets go of every recent search (the search palette's Clear). */
export function forgetSearches(store: ViewsStore): void {
  if (store.getState().searchRecent.length > 0) store.setState({ searchRecent: [] })
}
