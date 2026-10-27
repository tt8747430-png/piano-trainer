import { defaultStringifySearch, redirect } from '@tanstack/react-router'
import { sameView, selectView, type RememberedView, type ViewsStore } from '@/entities/views'
import type { Raw } from './read-search'

// A screen comes back the learner's way (spec §6, ADR 0022). Opened plainly (`OPEN_PLAINLY`), its
// last view; opened by a link that names what to show, that, with the screen's kept params the link
// leaves out.

/**
 * Kept params that belong to another: a link that names a pattern means the pattern's own hands and
 * inversion, never those kept from another pattern (a pattern's Practise would else play another).
 * A song lesson that names the visit's click or keys opens the Player in Listen, which a URL leaves
 * out as its default: never in a mode kept from the last time (ADR 0111).
 */
const BOUND_TO: Readonly<Record<string, readonly string[]>> = {
  pattern: ['rh', 'lh', 'inversion', 'nearest'],
  click: ['mode'],
  keys: ['mode'],
}

/**
 * Opened plainly, the remembered view; opened by a link, the link's params and the kept ones it
 * leaves out, but for those bound to a param it names. A link that names only defaults leaves the
 * URL bare, so a bare URL alone is not plain.
 */
export function viewToOpen(
  url: Raw,
  remembered: RememberedView | undefined,
  kept: readonly string[],
  plain: boolean,
): Raw {
  if (!remembered) return url
  if (plain && Object.keys(url).length === 0) return remembered
  const bound = new Set(Object.keys(url).flatMap((param) => BOUND_TO[param] ?? []))
  const filled = kept.flatMap((param) => {
    if (bound.has(param)) return []
    const value = remembered[param]
    return url[param] === undefined && value !== undefined ? [[param, value] as const] : []
  })
  return filled.length === 0 ? url : { ...Object.fromEntries(filled), ...url }
}

/** What a remembered route's `beforeLoad` reads of what the router hands it. */
interface RestoreContext {
  readonly cause: 'preload' | 'enter' | 'stay'
  readonly location: {
    readonly pathname: string
    readonly search: Raw
    readonly state: { readonly plain?: true }
  }
  readonly context: { readonly views: ViewsStore }
  readonly search: object
}

/**
 * A remembered route's `beforeLoad`: on entering, opens the view by the two rules, read by the
 * route's own reader, once. Already on the screen, only a plain link to its bare URL (its tab in the
 * navigation) opens the remembered view, which is the one on screen: any other link names a view the
 * screen changes to. It redirects, replacing the entry (so Back still leaves the screen), only when
 * that changes what the screen shows: a remembered value the reader rejects opens nothing new, so it
 * never redirects again.
 */
export function restoreView<S extends object>(
  read: (raw: Raw) => S,
  kept: readonly (keyof S & string)[],
) {
  return ({ cause, location, context, search }: RestoreContext): void => {
    const plain = location.state.plain === true
    const reopened = plain && Object.keys(location.search).length === 0
    if (cause === 'preload' || (cause === 'stay' && !reopened)) return
    const remembered = selectView(context.views.getState(), location.pathname)
    const opened = viewToOpen(location.search, remembered, kept, plain)
    if (opened === location.search || sameView(read(opened), search)) return
    throw redirect({ href: `${location.pathname}${defaultStringifySearch(opened)}`, replace: true })
  }
}

/** A remembered route's options: it says it is remembered, and restores its view on entering. */
export const remembered = <S extends object>(
  read: (raw: Raw) => S,
  kept: readonly (keyof S & string)[],
) => ({
  staticData: { remembered: true } as const,
  beforeLoad: restoreView(read, kept),
})
