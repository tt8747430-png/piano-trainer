import type { StoreApi } from 'zustand/vanilla'
import { PIECE_TEMPO } from '@/entities/piece'
import { createSavedStore, isRecord, savedObject, type SavingOptions } from '@/shared/lib'
import { isMeter, midi, PIANO } from '@/shared/lib/music'
import type { PedalKind } from '@/shared/lib/schedule'
import {
  isTakeId,
  LONGEST_TAKE_MS,
  TAKE_NAME_MAX,
  takeNumber,
  type PedalPress,
  type Take,
  type TakeId,
  type TakeNote,
} from './types'

export const TAKES_STORAGE_KEY = 'pt-takes'
export const TAKES_VERSION = 2

/** The learner's takes (ADR 0028), in the order recorded. */
export interface TakesState {
  readonly takes: readonly Take[]
  /** The next take's number: a deleted id is never given again. */
  readonly nextTake: number
}

export type TakesStore = StoreApi<TakesState>

const INITIAL: TakesState = { takes: [], nextTake: 1 }

/** A note as it is saved: `[midi, at, held, velocity]`. */
type SavedNote = readonly [number, number, number, number]
/** A press of a pedal as it is saved: `[down, up]` the sustain's, `[down, up, 1]` the soft's, `[down, up, 2]` the sostenuto's. */
type SavedPress = readonly [number, number] | readonly [number, number, number]

/** The pedal a saved press's third number names: none is the sustain's. */
const savedPedal = (kind: unknown): PedalKind | null =>
  kind === undefined ? 'sustain' : kind === 1 ? 'soft' : kind === 2 ? 'sostenuto' : null

const savedPress = ({ pedal, down, up }: PedalPress): SavedPress =>
  pedal === 'sustain' ? [down, up] : [down, up, pedal === 'soft' ? 1 : 2]

/** What is saved: each note and press a short list of whole numbers, so a long take stays small. */
const write = ({ takes, nextTake }: TakesState) => ({
  takes: takes.map(({ notes, pedals, ...take }) => ({
    ...take,
    notes: notes.map((n): SavedNote => [n.midi, n.at, n.held, n.velocity]),
    pedals: pedals.map(savedPress),
  })),
  nextTake,
})

export const createTakesStore = (saving: SavingOptions = {}): TakesStore =>
  createSavedStore(
    { key: TAKES_STORAGE_KEY, version: TAKES_VERSION, initial: INITIAL, read: sanitize, write },
    saving,
  )

/** Stored milliseconds, whole; null where they are not a time in the take. */
const msWithin = (value: unknown, length: number): number | null =>
  typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= length
    ? Math.round(value)
    : null

/** A saved note on the piano, struck and let go within the take; null otherwise. */
function noteOf(saved: unknown, length: number): TakeNote | null {
  if (!Array.isArray(saved) || saved.length !== 4) return null
  const [key, at, held, velocity]: unknown[] = saved
  const onset = msWithin(at, length)
  const holding = onset === null ? null : msWithin(held, length - onset)
  const onPiano =
    typeof key === 'number' && Number.isInteger(key) && key >= PIANO.from && key <= PIANO.to
  const struck =
    typeof velocity === 'number' && Number.isInteger(velocity) && velocity >= 1 && velocity <= 127
  if (!onPiano || !struck || onset === null || holding === null) return null
  return { midi: midi(key), at: onset, held: holding, velocity }
}

/** A saved press of a pedal within the take, let go after it went down; null otherwise. */
function pressOf(saved: unknown, length: number): PedalPress | null {
  if (!Array.isArray(saved) || saved.length < 2 || saved.length > 3) return null
  const [savedDown, savedUp, kind]: unknown[] = saved
  const down = msWithin(savedDown, length)
  const up = msWithin(savedUp, length)
  const pedal = savedPedal(kind)
  return down !== null && up !== null && up >= down && pedal ? { pedal, down, up } : null
}

/** A saved name, trimmed: 1 to `TAKE_NAME_MAX` characters, else none. */
function nameOf(saved: unknown): { name?: string } {
  const name = typeof saved === 'string' ? saved.trim() : ''
  return name.length > 0 && name.length <= TAKE_NAME_MAX ? { name } : {}
}

/** A saved bar to start from: a whole number from 1, else 1. */
const barOf = (saved: unknown): number =>
  typeof saved === 'number' && Number.isInteger(saved) && saved >= 1 ? saved : 1

const kept = <T>(saved: unknown, read: (each: unknown) => T | null): T[] =>
  (Array.isArray(saved) ? saved : []).flatMap((each) => {
    const value = read(each)
    return value === null ? [] : [value]
  })

/**
 * A take's saved barlines: whole milliseconds from 0, each after the one before, the last at or past
 * its length, within the longest take; null otherwise.
 */
function barsOf(saved: unknown, length: number): number[] | null {
  if (!Array.isArray(saved) || saved[0] !== 0 || saved.length < 2) return null
  const lines = saved.map((each) => msWithin(each, LONGEST_TAKE_MS))
  const rising = lines.every(
    (at, i) => at !== null && (i === 0 || at > (lines[i - 1] ?? Number.POSITIVE_INFINITY)),
  )
  const closing = lines.at(-1)
  return rising && closing != null && closing >= length ? (lines as number[]) : null
}

/** A saved take whose fields read; its notes and presses kept one by one. */
function takeOf(saved: unknown): Take | null {
  if (!isRecord(saved)) return null
  const { id, pieceId, name, made, tempo, meter, fromBar, length, notes, pedals } = saved
  const lasting = msWithin(length, LONGEST_TAKE_MS)
  const bars = lasting === null ? null : barsOf(saved.bars, lasting)
  const tempoRead =
    typeof tempo === 'number' &&
    Number.isInteger(tempo) &&
    tempo >= PIECE_TEMPO.min &&
    tempo <= PIECE_TEMPO.max
  if (
    !isTakeId(id) ||
    typeof pieceId !== 'string' ||
    pieceId === '' ||
    typeof made !== 'number' ||
    !Number.isFinite(made) ||
    !tempoRead ||
    !isMeter(meter) ||
    lasting === null ||
    !Array.isArray(notes) ||
    !Array.isArray(pedals) ||
    bars === null
  ) {
    return null
  }
  return {
    id,
    pieceId,
    ...nameOf(name),
    made,
    tempo,
    meter,
    fromBar: barOf(fromBar),
    length: lasting,
    notes: kept(notes, (each) => noteOf(each, lasting)),
    pedals: kept(pedals, (each) => pressOf(each, lasting)),
    bars,
  }
}

/** Stored JSON is untrusted: a take is kept where it reads, each note and press where it does. */
function sanitize(persisted: unknown): TakesState {
  const saved = savedObject<TakesState>(persisted)
  const seen = new Set<TakeId>()
  const takes = kept(saved.takes, (each) => {
    const take = takeOf(each)
    if (!take || seen.has(take.id)) return null
    seen.add(take.id)
    return take
  })
  const past = Math.max(0, ...takes.map((take) => takeNumber(take.id))) + 1
  const next =
    typeof saved.nextTake === 'number' && Number.isInteger(saved.nextTake) ? saved.nextTake : 1
  return { takes, nextTake: Math.max(next, past, 1) }
}
