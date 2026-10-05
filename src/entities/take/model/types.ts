import type { PieceId } from '@/entities/piece'
import type { Meter, Midi } from '@/shared/lib/music'

/** A take's id: `take-` and its number, never given twice. */
export type TakeId = `take-${number}`

const TAKE_ID = /^take-[1-9]\d*$/

export const isTakeId = (value: unknown): value is TakeId =>
  typeof value === 'string' && TAKE_ID.test(value)

export const takeId = (number: number): TakeId => `take-${number}`

/** The number a take's id carries. */
export const takeNumber = (id: TakeId): number => Number(id.slice('take-'.length))

/**
 * A key played in a take: when it went down and how long it was held, in milliseconds from the take's
 * first downbeat, and how hard it was struck (1–127).
 */
export interface TakeNote {
  readonly midi: Midi
  readonly at: number
  readonly held: number
  readonly velocity: number
}

/** The sustain pedal held down, from `down` to `up`, in milliseconds from the take's first downbeat. */
export interface PedalPress {
  readonly down: number
  readonly up: number
}

/** What was played from the first downbeat to Stop: the keys in the order struck, the pedal, and its length in milliseconds. */
export interface Played {
  readonly notes: readonly TakeNote[]
  readonly pedal: readonly PedalPress[]
  readonly length: number
}

/** A take (ADR 0028): what was played in a piece, to a click at `tempo` in `meter`, kept as played. */
export interface Take extends Played {
  readonly id: TakeId
  readonly pieceId: PieceId
  /** When it was recorded, in milliseconds since the epoch. */
  readonly made: number
  readonly tempo: number
  readonly meter: Meter
}

/** The longest take: it stops itself at 10 minutes. */
export const LONGEST_TAKE_MS = 10 * 60 * 1000

/** The notes all takes may hold together (about 1.3 MB saved): a take stops itself when they are full. */
export const NOTES_ROOM = 60_000
