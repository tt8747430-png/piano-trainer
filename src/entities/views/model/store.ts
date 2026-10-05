import type { StoreApi } from 'zustand/vanilla'
import { createSavedStore, isRecord, savedObject, type SavingOptions } from '@/shared/lib'
import { latestViews, viewOf, type RememberedView, type Views } from './view'

export const VIEWS_STORAGE_KEY = 'pt-views'
export const VIEWS_VERSION = 2

export interface ViewsState {
  readonly views: Views
}

export type ViewsStore = StoreApi<ViewsState>

/** The screens' last views, saved under `pt-views` (ADR 0022). */
export const createViewsStore = (saving: SavingOptions = {}): ViewsStore =>
  createSavedStore(
    { key: VIEWS_STORAGE_KEY, version: VIEWS_VERSION, initial: { views: {} }, read: sanitize },
    saving,
  )

/** The pages a version-1 save knew under Learn, now under Practice with everything else that is practised. */
const MOVED =
  /^\/learn\/(chords|scales|intervals|tensions|patterns|chord-finder|reharmonise|passing-chords|progressions)(?=\/|$)/
/** The Keys page of a version-1 save: a key is now a view of Scales, which remembers its own. */
const KEYS_PAGE = '/learn/keys'

/** Where a saved path's screen is now, or null for a screen that is gone. */
const pathNow = (path: string): string | null =>
  path === KEYS_PAGE ? null : path.replace(MOVED, '/practice/$1')

/**
 * Stored JSON is untrusted: paths from the root keep their views' params, each under its screen's
 * path of today; the last 200 stand.
 */
function sanitize(persisted: unknown): ViewsState {
  const saved = savedObject<ViewsState>(persisted).views
  return {
    views: latestViews(
      Object.entries(isRecord(saved) ? saved : {}).flatMap(([path, view]) => {
        if (!path.startsWith('/') || !isRecord(view)) return []
        const now = pathNow(path)
        return now === null ? [] : [[now, viewOf(view)] as readonly [string, RememberedView]]
      }),
    ),
  }
}
