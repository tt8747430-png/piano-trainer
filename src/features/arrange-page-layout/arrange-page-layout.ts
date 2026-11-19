import {
  withPanel,
  type ChangedLayouts,
  type LayoutPage,
  type PageLayoutsStore,
  type PanelLayout,
  type PanelOf,
} from '@/entities/page-layout'

/** Moves, sizes, hides or shows one panel of a page (R76), saved at once. */
export function setPanel<P extends LayoutPage>(
  store: PageLayoutsStore,
  page: P,
  panel: PanelOf<P>,
  change: Partial<PanelLayout>,
): void {
  store.setState((state) => ({ pages: withPanel(state.pages, page, panel, change) }))
}

/** Puts a page's panels back as they came; hands back every page's changes as they were, for Undo. */
export function resetPageLayout(store: PageLayoutsStore, page: LayoutPage): ChangedLayouts {
  const before = store.getState().pages
  const { [page]: _reset, ...others } = before
  store.setState({ pages: others })
  return before
}

/** Puts every page's panels back as they came; hands back what they were, for Undo. */
export function resetEveryLayout(store: PageLayoutsStore): ChangedLayouts {
  const before = store.getState().pages
  store.setState({ pages: {} })
  return before
}

/** Undo of a reset: the changes as they were. */
export function restoreLayouts(store: PageLayoutsStore, pages: ChangedLayouts): void {
  store.setState({ pages })
}
