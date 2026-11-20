import { changedPages, type ChangedLayouts, type LayoutPage } from './layout'
import type { PageLayoutsState } from './store'

/** Every page's changes: one value until one changes, so a page reading it stays still. */
export const selectLayouts = (state: PageLayoutsState): ChangedLayouts => state.pages

/** Whether the learner changed a page's layout. */
export const selectLayoutChanged =
  (page: LayoutPage) =>
  (state: PageLayoutsState): boolean =>
    state.pages[page] !== undefined

/** How many pages the learner arranged: Settings › General's Page layouts row. */
export const selectChangedCount = (state: PageLayoutsState): number =>
  changedPages(state.pages).length
