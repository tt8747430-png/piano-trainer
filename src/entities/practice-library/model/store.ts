import type { StoreApi } from 'zustand/vanilla'
import { createSavedStore, isRecord, savedObject, type SavingOptions } from '@/shared/lib'
import {
  ARRANGED_LIBRARIES,
  arrangedName,
  EMPTY_ARRANGEMENT,
  isLibraryFolderId,
  type ArrangedLibrary,
  type Arrangement,
  type LibraryFolder,
} from './arrangement'
import {
  isChurchMode,
  isOwnProgressionId,
  ownProgressionName,
  ownProgressionNumber,
  readsAsLine,
  type OwnProgression,
  type OwnProgressionId,
  type PracticeKind,
} from './types'

export const PRACTICE_LIBRARY_STORAGE_KEY = 'pt-practice-library'
export const PRACTICE_LIBRARY_VERSION = 2

/**
 * What the learner keeps in Practice's libraries (R30-4, R32): favourites of each kind, their own
 * progressions, and how they arranged each library (its places and items, the books included).
 */
export interface PracticeLibraryState {
  /** Each kind's favourites by id, in the order starred. */
  readonly favourites: Readonly<Record<PracticeKind, readonly string[]>>
  /** The progressions the learner typed and kept, in the order made: Mine. */
  readonly progressions: readonly OwnProgression[]
  /** The next own id's number: a deleted id is never reused. */
  readonly nextOwn: number
  /** Each library as the learner arranged it. */
  readonly arrangements: Readonly<Record<ArrangedLibrary, Arrangement>>
  /** The next folder's number, across the libraries: a deleted folder's is never reused. */
  readonly nextFolder: number
}

export type PracticeLibraryStore = StoreApi<PracticeLibraryState>

const INITIAL: PracticeLibraryState = {
  favourites: { exercises: [], progressions: [] },
  progressions: [],
  nextOwn: 1,
  arrangements: {
    exercises: EMPTY_ARRANGEMENT,
    accompaniment: EMPTY_ARRANGEMENT,
    progressions: EMPTY_ARRANGEMENT,
  },
  nextFolder: 1,
}

export const createPracticeLibraryStore = (saving: SavingOptions = {}): PracticeLibraryStore =>
  createSavedStore(
    {
      key: PRACTICE_LIBRARY_STORAGE_KEY,
      version: PRACTICE_LIBRARY_VERSION,
      initial: INITIAL,
      read: sanitize,
    },
    saving,
  )

/** An id as a favourite or an arranged item is kept: a word of letters, digits, dashes and colons. */
const isItemId = (value: unknown): value is string =>
  typeof value === 'string' && /^[a-z0-9][a-z0-9:-]{0,95}$/i.test(value)

/** A saved own progression that reads: its id, a name of 1 to 40 characters, a line that reads. */
function ownProgression(saved: unknown): OwnProgression | null {
  if (!isRecord(saved)) return null
  const { id, name, line, minor, mode } = saved
  const kept = typeof name === 'string' ? ownProgressionName(name) : null
  if (!isOwnProgressionId(id) || !kept || !readsAsLine(line) || typeof minor !== 'boolean')
    return null
  return { id, name: kept, line, minor, ...(isChurchMode(mode) ? { mode } : {}) }
}

/** Stored JSON is untrusted: what reads is kept, each favourite once, an own one only while it is there. */
function sanitize(persisted: unknown): PracticeLibraryState {
  const saved = savedObject<PracticeLibraryState>(persisted)
  const seen = new Set<OwnProgressionId>()
  const progressions = (Array.isArray(saved.progressions) ? saved.progressions : []).flatMap(
    (value) => {
      const progression = ownProgression(value)
      if (!progression || seen.has(progression.id)) return []
      seen.add(progression.id)
      return [progression]
    },
  )
  const favourites = isRecord(saved.favourites) ? saved.favourites : {}
  const listOf = (kind: PracticeKind): string[] => {
    const list = favourites[kind]
    if (!Array.isArray(list)) return []
    const kept = list.filter(
      (id): id is string =>
        isItemId(id) && (kind !== 'progressions' || !isOwnProgressionId(id) || seen.has(id)),
    )
    return [...new Set(kept)]
  }
  const past = Math.max(0, ...progressions.map((each) => ownProgressionNumber(each.id))) + 1
  const next =
    typeof saved.nextOwn === 'number' && Number.isSafeInteger(saved.nextOwn) ? saved.nextOwn : 1
  const arrangements = isRecord(saved.arrangements) ? saved.arrangements : {}
  const kept: Record<ArrangedLibrary, Arrangement> = {
    exercises: arrangement(arrangements.exercises),
    accompaniment: arrangement(arrangements.accompaniment),
    progressions: arrangement(arrangements.progressions),
  }
  const folderNumbers = ARRANGED_LIBRARIES.flatMap((library) => kept[library].folders).map(
    (folder) => Number(folder.id.slice('folder-'.length)),
  )
  const nextFolder =
    typeof saved.nextFolder === 'number' && Number.isSafeInteger(saved.nextFolder)
      ? saved.nextFolder
      : 1
  return {
    favourites: { exercises: listOf('exercises'), progressions: listOf('progressions') },
    progressions,
    nextOwn: Math.max(next, past, 1),
    arrangements: kept,
    nextFolder: Math.max(nextFolder, Math.max(0, ...folderNumbers) + 1, 1),
  }
}

const ids = (value: unknown): string[] =>
  Array.isArray(value) ? [...new Set(value.filter(isItemId))] : []

/** A record of names by id, each name one that keeps. */
function names(value: unknown): Record<string, string> {
  if (!isRecord(value)) return {}
  return Object.fromEntries(
    Object.entries(value).flatMap(([id, name]) => {
      const kept = typeof name === 'string' ? arrangedName(name) : null
      return isItemId(id) && kept ? [[id, kept]] : []
    }),
  )
}

/** A saved arrangement as far as it reads: each part kept that is well formed, the rest empty. */
function arrangement(saved: unknown): Arrangement {
  if (!isRecord(saved)) return EMPTY_ARRANGEMENT
  const folders = (Array.isArray(saved.folders) ? saved.folders : []).flatMap(
    (folder): LibraryFolder[] => {
      if (!isRecord(folder) || !isLibraryFolderId(folder.id) || typeof folder.name !== 'string')
        return []
      const name = arrangedName(folder.name)
      return name ? [{ id: folder.id, name }] : []
    },
  )
  const placed = isRecord(saved.placed)
    ? Object.fromEntries(
        Object.entries(saved.placed).filter(
          (entry): entry is [string, string] => isItemId(entry[0]) && isItemId(entry[1]),
        ),
      )
    : {}
  const sequence = isRecord(saved.sequence)
    ? Object.fromEntries(
        Object.entries(saved.sequence).flatMap(([place, order]) =>
          isItemId(place) ? [[place, ids(order)]] : [],
        ),
      )
    : {}
  return {
    order: ids(saved.order),
    placeNames: names(saved.placeNames),
    hiddenPlaces: ids(saved.hiddenPlaces),
    folders: folders.filter(
      (folder, at) => folders.findIndex((each) => each.id === folder.id) === at,
    ),
    placed,
    itemNames: names(saved.itemNames),
    hiddenItems: ids(saved.hiddenItems),
    sequence,
  }
}
