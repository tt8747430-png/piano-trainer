export {
  createViewsStore,
  MOST_RECENT_SEARCHES,
  VIEWS_STORAGE_KEY,
  VIEWS_VERSION,
  type ViewsState,
  type ViewsStore,
} from './model/store'
export { sameView, viewOf, withView, type RememberedView } from './model/view'
export { selectRecentSearches, selectView } from './model/selectors'
