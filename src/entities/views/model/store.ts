import type { StoreApi } from 'zustand/vanilla'
import { createSavedStore, isRecord, savedObject, type SavingOptions } from '@/shared/lib'
import { latestViews, viewOf, type RememberedView, type Views } from './view'

export const VIEWS_STORAGE_KEY = 'pt-views'
export const VIEWS_VERSION = 2

export interface ViewsState {
  readonly views: Views
  /** What the learner searched for last, the latest first (rule 27): Search's recent searches. */
  readonly searchRecent: readonly string[]
}

/** The recent searches the palette keeps. */
export const MOST_RECENT_SEARCHES = 8

export type ViewsStore = StoreApi<ViewsState>

/** The screens' last views, saved under `pt-views` (ADR 0038). */
export const createViewsStore = (saving: SavingOptions = {}): ViewsStore =>
  createSavedStore(
    {
      key: VIEWS_STORAGE_KEY,
      version: VIEWS_VERSION,
      initial: { views: {}, searchRecent: [] },
      read: sanitize,
    },
    saving,
  )

/**
 * Stored JSON is untrusted: paths from the root keep their views' params; the last 200 stand. The
 * recent searches keep their text, at most `MOST_RECENT_SEARCHES`.
 */
function sanitize(persisted: unknown): ViewsState {
  const { views: saved, searchRecent } = savedObject<ViewsState>(persisted)
  return {
    views: latestViews(
      Object.entries(isRecord(saved) ? saved : {}).flatMap(([path, view]) => {
        if (!path.startsWith('/') || !isRecord(view)) return []
        return [[path, viewOf(view)] as readonly [string, RememberedView]]
      }),
    ),
    searchRecent: Array.isArray(searchRecent)
      ? searchRecent
          .filter((query): query is string => typeof query === 'string' && query.trim() !== '')
          .slice(0, MOST_RECENT_SEARCHES)
      : [],
  }
}
