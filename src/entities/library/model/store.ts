import type { StoreApi } from 'zustand/vanilla'
import type { PieceId } from '@/entities/piece'
import { createSavedStore, isRecord, savedObject, type SavingOptions } from '@/shared/lib'
import {
  isPieceIdText,
  isSetlistId,
  MOST_PIECES,
  MOST_SETLISTS,
  setlistName,
  setlistNumber,
  type Setlist,
  type SetlistId,
} from './types'

export const LIBRARY_STORAGE_KEY = 'pt-library'
export const LIBRARY_VERSION = 1

/** The learner's library (ADR 0103): their favourite songs and their setlists. */
export interface LibraryState {
  /** The newest first. */
  readonly favourites: readonly PieceId[]
  /** In the order made. */
  readonly setlists: readonly Setlist[]
  /** The next setlist's number: a deleted id is never given again. */
  readonly nextSetlist: number
}

export type LibraryStore = StoreApi<LibraryState>

const INITIAL: LibraryState = { favourites: [], setlists: [], nextSetlist: 1 }

export const createLibraryStore = (saving: SavingOptions = {}): LibraryStore =>
  createSavedStore(
    { key: LIBRARY_STORAGE_KEY, version: LIBRARY_VERSION, initial: INITIAL, read: sanitize },
    saving,
  )

/** A saved list of songs: each id that can name one, once, in order, as many as a list keeps. */
const piecesOf = (saved: unknown): PieceId[] =>
  Array.isArray(saved) ? [...new Set(saved.filter(isPieceIdText))].slice(0, MOST_PIECES) : []

/** A saved setlist that reads: its id and a name of 1 to 40 characters; its songs as a list's. */
function setlistOf(saved: unknown): Setlist | null {
  if (!isRecord(saved)) return null
  const { id, name, pieces } = saved
  const kept = typeof name === 'string' ? setlistName(name) : null
  return isSetlistId(id) && kept ? { id, name: kept, pieces: piecesOf(pieces) } : null
}

/** Stored JSON is untrusted: what reads is kept, each setlist once, as many as the library keeps. */
function sanitize(persisted: unknown): LibraryState {
  const saved = savedObject<LibraryState>(persisted)
  const seen = new Set<SetlistId>()
  const read = (Array.isArray(saved.setlists) ? saved.setlists : []).flatMap((value) => {
    const setlist = setlistOf(value)
    if (!setlist || seen.has(setlist.id)) return []
    seen.add(setlist.id)
    return [setlist]
  })
  // Past every id read, those the library has no room for too: none is given again.
  const past = Math.max(0, ...read.map((setlist) => setlistNumber(setlist.id))) + 1
  const next =
    typeof saved.nextSetlist === 'number' && Number.isSafeInteger(saved.nextSetlist)
      ? saved.nextSetlist
      : 1
  return {
    favourites: piecesOf(saved.favourites),
    setlists: read.slice(0, MOST_SETLISTS),
    nextSetlist: Math.max(next, past, 1),
  }
}
