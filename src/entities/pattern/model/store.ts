import type { StoreApi } from 'zustand/vanilla'
import { createSavedStore, isRecord, savedObject, type SavingOptions } from '@/shared/lib'
import {
  isOwnPatternId,
  ownName,
  ownNumber,
  type OwnPattern,
  type OwnPatternId,
  type PatternRef,
} from './own'
import {
  isLeftFigureId,
  isPatternId,
  isRightFigureId,
  type LeftFigureId,
  type PatternId,
} from './types'

export const PATTERNS_STORAGE_KEY = 'pt-patterns'
export const PATTERNS_VERSION = 1

/** The learner's way with patterns (spec 2026-10-01-patterns §3). */
export interface PatternsState {
  /** In the order starred. */
  readonly favourites: readonly PatternRef[]
  /** Built-in only: an own pattern is deleted, not hidden. */
  readonly hidden: readonly PatternId[]
  /** In the order made. */
  readonly own: readonly OwnPattern[]
  /** The next own id's number: a deleted id is never reused. */
  readonly nextOwn: number
}

export type PatternsStore = StoreApi<PatternsState>

const INITIAL: PatternsState = { favourites: [], hidden: [], own: [], nextOwn: 1 }

export const createPatternsStore = (saving: SavingOptions = {}): PatternsStore =>
  createSavedStore(
    { key: PATTERNS_STORAGE_KEY, version: PATTERNS_VERSION, initial: INITIAL, read: sanitize },
    saving,
  )

/** The left hands since retired, by the figure that now plays their notes. */
const RETIRED_LEFT: Readonly<Record<string, LeftFigureId>> = { arp: 'fig' }

/** A saved own pattern that reads: its id, a name of 1 to 40 characters, known figures. */
function ownPattern(saved: unknown): OwnPattern | null {
  if (!isRecord(saved)) return null
  const { id, name, rh } = saved
  const lh = typeof saved.lh === 'string' ? (RETIRED_LEFT[saved.lh] ?? saved.lh) : saved.lh
  const kept = typeof name === 'string' ? ownName(name) : null
  return isOwnPatternId(id) && kept && isRightFigureId(rh) && isLeftFigureId(lh)
    ? { id, name: kept, rh, lh }
    : null
}

/** The values of a saved list that pass, each once, in order. */
const listOf = <T>(saved: unknown, keeps: (value: unknown) => value is T): T[] =>
  Array.isArray(saved) ? [...new Set(saved.filter(keeps))] : []

/** Stored JSON is untrusted: what reads is kept, a ref only while it names a pattern there. */
function sanitize(persisted: unknown): PatternsState {
  const saved = savedObject<PatternsState>(persisted)
  const seen = new Set<OwnPatternId>()
  const own = (Array.isArray(saved.own) ? saved.own : []).flatMap((value) => {
    const pattern = ownPattern(value)
    if (!pattern || seen.has(pattern.id)) return []
    seen.add(pattern.id)
    return [pattern]
  })
  const isThere = (value: unknown): value is PatternRef =>
    isPatternId(value) || (isOwnPatternId(value) && seen.has(value))
  const past = Math.max(0, ...own.map((pattern) => ownNumber(pattern.id))) + 1
  const next =
    typeof saved.nextOwn === 'number' && Number.isInteger(saved.nextOwn) ? saved.nextOwn : 1
  return {
    favourites: listOf(saved.favourites, isThere),
    hidden: listOf(saved.hidden, isPatternId),
    own,
    nextOwn: Math.max(next, past, 1),
  }
}
