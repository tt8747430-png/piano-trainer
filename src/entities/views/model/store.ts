import type { StoreApi } from 'zustand/vanilla'
import { createSavedStore, isRecord, savedObject, type SavingOptions } from '@/shared/lib'
import { latestViews, viewOf, type RememberedView, type Views } from './view'

export const VIEWS_STORAGE_KEY = 'pt-views'
export const VIEWS_VERSION = 1

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

/** Stored JSON is untrusted: paths from the root keep their views' params; the last 200 stand. */
function sanitize(persisted: unknown): ViewsState {
  const saved = savedObject<ViewsState>(persisted).views
  return {
    views: latestViews(
      Object.entries(isRecord(saved) ? saved : {}).flatMap(([path, view]) =>
        path.startsWith('/') && isRecord(view)
          ? [[path, viewOf(view)] as readonly [string, RememberedView]]
          : [],
      ),
    ),
  }
}
