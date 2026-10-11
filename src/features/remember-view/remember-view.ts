import { sameView, viewOf, withView, type ViewsStore } from '@/entities/views'

/** A passage of one session and a path step's panel: never part of a screen's way. */
const NEVER = new Set(['loop', 'step'])

/**
 * Remembers a screen's view (its URL's params, never the loop or a step's panel) as the one used last:
 * a screen opened again as it was moves to the latest too, so the screens used daily are kept.
 */
export function rememberView(store: ViewsStore, path: string, search: object): void {
  const view = viewOf(Object.fromEntries(Object.entries(search)), NEVER)
  const { views } = store.getState()
  const remembered = views[path]
  const latest = Object.keys(views).at(-1) === path
  if (remembered && sameView(remembered, view) && latest) return
  store.setState({ views: withView(views, path, view) })
}
