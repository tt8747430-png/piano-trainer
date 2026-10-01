import type { StoreApi } from 'zustand/vanilla'
import { createSavedStore, isRecord, savedObject, type SavingOptions } from '@/shared/lib'

export const VIEWS_STORAGE_KEY = 'pt-views'
export const VIEWS_VERSION = 1
/** The most screens remembered: the ones used last. */
export const MOST_VIEWS = 200

/** A param a screen's URL holds: what a view is made of. */
export type ViewParam = string | number | boolean
/** A screen's last view: its URL's params, as its route's validator will read them again. */
export type RememberedView = Readonly<Record<string, ViewParam>>

export interface ViewsState {
  /** By path (`/play/bz5`, `/learn/chords`), the screen used last at the end. */
  readonly views: Readonly<Record<string, RememberedView>>
}

export type ViewsStore = StoreApi<ViewsState>

/** The screens' last views, saved under `pt-views` (spec §6). */
export const createViewsStore = (saving: SavingOptions = {}): ViewsStore =>
  createSavedStore(
    { key: VIEWS_STORAGE_KEY, version: VIEWS_VERSION, initial: { views: {} }, read: sanitize },
    saving,
  )

const isParam = (value: unknown): value is ViewParam =>
  typeof value === 'string' ||
  typeof value === 'boolean' ||
  (typeof value === 'number' && Number.isFinite(value))

/** A saved view's params that are text, numbers or switches; a route's validator reads the rest. */
const viewOf = (saved: Record<string, unknown>): RememberedView =>
  Object.fromEntries(
    Object.entries(saved).flatMap(([param, value]) => (isParam(value) ? [[param, value]] : [])),
  )

/** Stored JSON is untrusted: paths from the root keep their views' params; the last 200 stand. */
function sanitize(persisted: unknown): ViewsState {
  const saved = savedObject<ViewsState>(persisted).views
  const views = Object.entries(isRecord(saved) ? saved : {})
    .flatMap(([path, view]) =>
      path.startsWith('/') && isRecord(view) ? [[path, viewOf(view)] as const] : [],
    )
    .slice(-MOST_VIEWS)
  return { views: Object.fromEntries(views) }
}
