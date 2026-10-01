import type { RememberedView, ViewsState } from './store'

/** A screen's last view, if it was used before. */
export const selectView = (state: ViewsState, path: string): RememberedView | undefined =>
  state.views[path]
