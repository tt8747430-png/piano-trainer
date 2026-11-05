import type { StoreApi } from 'zustand/vanilla'
import { createSavedStore, isRecord, savedObject, type SavingOptions } from '@/shared/lib'
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
export const PRACTICE_LIBRARY_VERSION = 1

/** What the learner keeps in Practice's libraries (R30-4): favourites of each kind, and their own progressions. */
export interface PracticeLibraryState {
  /** Each kind's favourites by id, in the order starred. */
  readonly favourites: Readonly<Record<PracticeKind, readonly string[]>>
  /** The progressions the learner typed and kept, in the order made: Mine. */
  readonly progressions: readonly OwnProgression[]
  /** The next own id's number: a deleted id is never reused. */
  readonly nextOwn: number
}

export type PracticeLibraryStore = StoreApi<PracticeLibraryState>

const INITIAL: PracticeLibraryState = {
  favourites: { exercises: [], progressions: [] },
  progressions: [],
  nextOwn: 1,
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

/** An id as a favourite is kept: a word of letters, digits and dashes. */
const isItemId = (value: unknown): value is string =>
  typeof value === 'string' && /^[a-z0-9][a-z0-9-]{0,63}$/i.test(value)

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
  return {
    favourites: { exercises: listOf('exercises'), progressions: listOf('progressions') },
    progressions,
    nextOwn: Math.max(next, past, 1),
  }
}
