import { sameView, viewOf, withView, type ViewsStore } from '@/entities/views'

/** A passage of one session and a path step's panel: never part of a screen's way. */
const NEVER = new Set(['loop', 'step'])

/** Remembers a screen's view (its URL's params, never the loop or a step's panel) as the one used last. */
export function rememberView(
  store: ViewsStore,
  path: string,
  search: Readonly<Record<string, unknown>>,
): void {
  const view = viewOf(search, NEVER)
  const { views } = store.getState()
  const remembered = views[path]
  if (remembered && sameView(remembered, view)) return
  store.setState({ views: withView(views, path, view) })
}
