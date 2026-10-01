import type { ViewsState } from './store'
import type { RememberedView } from './view'

/** A screen's last view, if it was used before. */
export const selectView = (state: ViewsState, path: string): RememberedView | undefined =>
  state.views[path]
