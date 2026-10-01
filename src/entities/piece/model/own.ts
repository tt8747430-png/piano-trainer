import type { PieceMusic } from './music'

/** A song of the learner's own: its id, `my-` and its number, never given twice. */
export type OwnSongId = `my-${number}`

/** A song the learner wrote from scratch: a title of their own over its music. */
export interface OwnSong extends PieceMusic {
  readonly id: OwnSongId
  readonly title: string
}

/** The longest title an own song takes. */
export const TITLE_MAX = 80

/** The tempos a piece is written at (a compound meter's beat is the dotted quarter). */
export const PIECE_TEMPO = { min: 40, max: 160 } as const

const OWN_ID = /^my-[1-9]\d*$/

export const isOwnSongId = (value: unknown): value is OwnSongId =>
  typeof value === 'string' && OWN_ID.test(value)

export const ownSongId = (number: number): OwnSongId => `my-${number}`

/** The number an own song's id carries. */
export const ownSongNumber = (id: OwnSongId): number => Number(id.slice(3))

/** A title as an own song keeps it: trimmed, 1 to 80 characters; null where none is left. */
export function songTitle(text: string): string | null {
  const title = text.trim()
  return title.length > 0 && title.length <= TITLE_MAX ? title : null
}
