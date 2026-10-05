import type { StoreApi } from 'zustand/vanilla'
import { createSavedStore, isRecord, savedObject, type SavingOptions } from '@/shared/lib'
import { latestViews, viewOf, type RememberedView, type Views } from './view'

export const VIEWS_STORAGE_KEY = 'pt-views'
export const VIEWS_VERSION = 3

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
/**
 * The screens that are gone: version 1's Keys page (a key is a view of Scales, which remembers its
 * own) and version 2's Practice by topic (Practice lists its places and remembers nothing).
 */
const GONE: ReadonlySet<string> = new Set(['/learn/keys', '/practice'])

/** The pages a version-2 save knew on their own, now tabs of the subject they belong to. */
const TABBED: Readonly<Record<string, string>> = {
  '/practice/passing-chords': '/practice/progressions/passing',
  '/practice/reharmonise': '/practice/progressions/reharmonise',
}

/** Where a saved path's screen is now, or null for a screen that is gone. */
function pathNow(path: string): string | null {
  if (GONE.has(path)) return null
  const practised = path.replace(MOVED, '/practice/$1')
  return TABBED[practised] ?? practised
}

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
