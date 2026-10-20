import { useCallback, useSyncExternalStore } from 'react'

/** A phone on its side, as `theme.css`'s `landscape-phone` variant says it: short and wide. */
export const LANDSCAPE_PHONE =
  '(orientation: landscape) and (max-height: 500px) and (max-width: 1023px)'

/** One MediaQueryList per query and `matchMedia`: a render asks it, it never builds one anew. */
const lists = new WeakMap<typeof window.matchMedia, Map<string, MediaQueryList>>()

function listOf(query: string): MediaQueryList {
  const own = lists.get(window.matchMedia) ?? new Map<string, MediaQueryList>()
  lists.set(window.matchMedia, own)
  const known = own.get(query)
  if (known) return known
  const list = window.matchMedia(query)
  own.set(query, list)
  return list
}

/** Whether a CSS media query matches now; the component re-renders when that changes. */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const media = listOf(query)
      media.addEventListener('change', onChange)
      return () => media.removeEventListener('change', onChange)
    },
    [query],
  )
  return useSyncExternalStore(subscribe, () => listOf(query).matches)
}
