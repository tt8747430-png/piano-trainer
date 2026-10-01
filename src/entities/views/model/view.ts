/** A param a screen's URL holds: what a view is made of. */
export type ViewParam = string | number | boolean
/** A screen's last view: its URL's params, as its route's reader will read them again. */
export type RememberedView = Readonly<Record<string, ViewParam>>
/** The screens' last views by path, the one used last at the end. */
export type Views = Readonly<Record<string, RememberedView>>

/** The most screens remembered: the ones used last. */
export const MOST_VIEWS = 200

const isViewParam = (value: unknown): value is ViewParam =>
  typeof value === 'string' ||
  typeof value === 'boolean' ||
  (typeof value === 'number' && Number.isFinite(value))

/** A search's params that make a view (text, numbers, switches), but for the ones `leftOut`. */
export const viewOf = (
  search: Readonly<Record<string, unknown>>,
  leftOut: ReadonlySet<string> = new Set(),
): RememberedView =>
  Object.fromEntries(
    Object.entries(search).flatMap(([param, value]) =>
      !leftOut.has(param) && isViewParam(value) ? [[param, value]] : [],
    ),
  )

/** Two views, or two searches, read alike: the same params with the same values, left-out ones ignored. */
export function sameView(a: object, b: object): boolean {
  const defined = (search: object) =>
    Object.entries(search).filter(([, value]) => value !== undefined)
  const left = defined(a)
  const right = new Map(defined(b))
  return left.length === right.size && left.every(([param, value]) => right.get(param) === value)
}

/** Views in the order used, the oldest past 200 forgotten. */
export const latestViews = (views: Iterable<readonly [string, RememberedView]>): Views =>
  Object.fromEntries([...views].slice(-MOST_VIEWS))

/** `path`'s view remembered as the one used last. */
export const withView = (views: Views, path: string, view: RememberedView): Views =>
  latestViews([...Object.entries(views).filter(([other]) => other !== path), [path, view]])
