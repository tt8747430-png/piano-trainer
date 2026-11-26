import type { StoreApi } from 'zustand/vanilla'
import { createSavedStore, savedObject, type SavingOptions } from '@/shared/lib'
import { readLayouts, type ChangedLayouts } from './layout'

export const PAGE_LAYOUTS_STORAGE_KEY = 'pt-page-layouts'
export const PAGE_LAYOUTS_VERSION = 1

/** How the learner arranged each page's panels (R76): only what differs from how they came. */
export interface PageLayoutsState {
  readonly pages: ChangedLayouts
}

export type PageLayoutsStore = StoreApi<PageLayoutsState>

/**
 * The page layouts, saved under `pt-page-layouts` on this device alone: a phone's screen and a
 * laptop's differ, so each keeps its own (ADR 0052, the Chord player). A backup holds them.
 */
export const createPageLayoutsStore = (saving: SavingOptions = {}): PageLayoutsStore =>
  createSavedStore(
    {
      key: PAGE_LAYOUTS_STORAGE_KEY,
      version: PAGE_LAYOUTS_VERSION,
      initial: { pages: {} },
      read: (persisted) => ({
        pages: readLayouts(savedObject<PageLayoutsState>(persisted).pages),
      }),
    },
    saving,
  )
