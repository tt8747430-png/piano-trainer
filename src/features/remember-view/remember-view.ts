import { MOST_VIEWS, type RememberedView, type ViewParam, type ViewsStore } from '@/entities/views'

/** A passage of one session and a path step's panel: never part of a screen's way. */
const NEVER = new Set(['loop', 'step'])

const isParam = (value: unknown): value is ViewParam =>
  typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number'

const sameView = (a: RememberedView, b: RememberedView) =>
  Object.keys(a).length === Object.keys(b).length &&
  Object.entries(a).every(([param, value]) => b[param] === value)

/**
 * Remembers a screen's view (its URL's params) under its path, as the screen used last: the loop
 * and a step's panel are left out, and the oldest screen past 200 is forgotten.
 */
export function rememberView(
  store: ViewsStore,
  path: string,
  search: Readonly<Record<string, unknown>>,
): void {
  const view: RememberedView = Object.fromEntries(
    Object.entries(search).flatMap(([param, value]) =>
      !NEVER.has(param) && isParam(value) ? [[param, value]] : [],
    ),
  )
  const { views } = store.getState()
  const remembered = views[path]
  if (remembered && sameView(remembered, view)) return
  const others = Object.entries(views).filter(([other]) => other !== path)
  store.setState({
    views: Object.fromEntries([...others, [path, view]].slice(-MOST_VIEWS)),
  })
}
