import { useRouterState } from '@tanstack/react-router'

/** Which of Songs' places is shown (the board's `_SUBCUR`), read from the address. */
export type SongsPlace =
  | { readonly kind: 'all' | 'explore' | 'favourites' | 'archive' | 'trash' | 'none' }
  | { readonly kind: 'folder' | 'shared'; readonly id: string }

/** Which of Songs' places the address shows. */
export function useSongsPlace(): SongsPlace {
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const view = useRouterState({
    select: (state) => ('view' in state.location.search ? state.location.search.view : undefined),
  })
  const favourites = useRouterState({
    select: (state) => 'favourites' in state.location.search && state.location.search.favourites,
  })
  if (pathname === '/songs') return { kind: view === 'explore' ? 'explore' : 'all' }
  if (pathname === '/songs/all') return { kind: favourites === true ? 'favourites' : 'all' }
  if (pathname === '/songs/archive') return { kind: 'archive' }
  if (pathname === '/songs/trash') return { kind: 'trash' }
  const folder = /^\/songs\/folders\/([^/]+)/.exec(pathname)?.[1]
  if (folder) return { kind: 'folder', id: decodeURIComponent(folder) }
  const shared = /^\/songs\/shared-folders\/([^/]+)/.exec(pathname)?.[1]
  if (shared) return { kind: 'shared', id: decodeURIComponent(shared) }
  return { kind: 'none' }
}

/** Whether one of Songs' places is shown, so Songs in the sidebar is only bold (the board's `here`). */
export function useSongsPlaceShown(): boolean {
  return useSongsPlace().kind !== 'none'
}
