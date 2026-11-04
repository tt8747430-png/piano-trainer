import { plainText } from '@/shared/lib'
import type { LocalText } from '@/shared/i18n'
import type { PieceMusic } from './music'

/** A song of the learner's own: its id, `my-` and its number, never given twice. */
export type OwnSongId = `my-${number}`

/**
 * A song the learner wrote from scratch: a title of their own over its music; or saved from the
 * Public library, its `author` who published it.
 */
export interface OwnSong extends PieceMusic {
  readonly id: OwnSongId
  readonly title: string
  readonly author?: string
  /** The Public library's item it was added from (Explore), so its page reads Open in my library. */
  readonly publicId?: string
  /** What is said about it, written on its page. */
  readonly note?: LocalText
}

/** The longest title an own song takes. */
export const TITLE_MAX = 80

/**
 * The tempos a piece is written at (a compound meter's beat is the dotted quarter): from a Grave to
 * past any Prestissimo, so an imported score keeps the tempo it was written at.
 */
export const PIECE_TEMPO = { min: 20, max: 300 } as const

const OWN_ID = /^my-[1-9]\d*$/

export const isOwnSongId = (value: unknown): value is OwnSongId =>
  typeof value === 'string' && OWN_ID.test(value)

export const ownSongId = (number: number): OwnSongId => `my-${number}`

/** The number an own song's id carries. */
export const ownSongNumber = (id: OwnSongId): number => Number(id.slice(3))

/** A title as an own song keeps it: trimmed, 1 to 80 characters; null where none is left. */
export function songTitle(text: string): string | null {
  const title = plainText(text)
  return title.length > 0 && title.length <= TITLE_MAX ? title : null
}
