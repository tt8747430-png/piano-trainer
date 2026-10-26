import type { PieceId } from '@/entities/piece'

/** A setlist's id: `set-` and its number, never given twice. */
export type SetlistId = `set-${number}`

/** Songs in the learner's order, under a name of theirs (Chordify's setlist). */
export interface Setlist {
  readonly id: SetlistId
  readonly name: string
  /** Each once, in the learner's order. */
  readonly pieces: readonly PieceId[]
}

/** The longest name a setlist takes. */
export const SETLIST_NAME_MAX = 40
/** The most setlists the library keeps. */
export const MOST_SETLISTS = 100
/** The most songs a list keeps: the favourites, or a setlist's. */
export const MOST_PIECES = 500
/** The longest id a saved list keeps: a piece's id is a plain name (`PieceId`). */
const PIECE_ID_MAX = 100

const SETLIST_ID = /^set-[1-9]\d*$/

export const isSetlistId = (value: unknown): value is SetlistId =>
  typeof value === 'string' && SETLIST_ID.test(value)

export const setlistId = (number: number): SetlistId => `set-${number}`

/** The number a setlist's id carries. */
export const setlistNumber = (id: SetlistId): number => Number(id.slice(4))

/** A name as a setlist keeps it: trimmed, 1 to 40 characters; null where none is left. */
export function setlistName(text: string): string | null {
  const name = text.trim()
  return name.length > 0 && name.length <= SETLIST_NAME_MAX ? name : null
}

/** Whether a saved value can name a piece: an id that may name one the repertoire has. */
export const isPieceIdText = (value: unknown): value is PieceId =>
  typeof value === 'string' && value.length > 0 && value.length <= PIECE_ID_MAX
