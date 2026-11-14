import type { PieceId } from '@/entities/piece'

/**
 * A song as the learner has played it in the Player (canvas 125): the bars played through, by their
 * place as written (from 0); the bar it stopped at, where Continue opens; the times it was started;
 * and the seconds it ran.
 */
export interface SongPlay {
  readonly played: readonly number[]
  readonly at: number
  readonly times: number
  readonly seconds: number
  /** How many bars the song has as written, when it was last played. */
  readonly bars: number
}

/** How many songs keep their place: the latest played. */
export const SONGS_KEPT = 100

const isPlace = (value: unknown): value is number =>
  typeof value === 'number' && Number.isInteger(value) && value >= 0

/** A saved song's play as it can be read; nothing where it cannot. */
export function songPlay(value: unknown): SongPlay | undefined {
  if (typeof value !== 'object' || value === null) return undefined
  const { played, at, times, seconds, bars } = value as Partial<Record<keyof SongPlay, unknown>>
  if (!Array.isArray(played) || !isPlace(at) || !isPlace(times) || !isPlace(bars)) return undefined
  if (typeof seconds !== 'number' || !Number.isFinite(seconds) || seconds < 0) return undefined
  const sorted = [...new Set(played.filter(isPlace))].sort((a, b) => a - b)
  return { played: sorted, at, times, seconds, bars }
}

/** What a stretch in the Player adds to a song's play. */
export interface SongStretch {
  /** The bars it played through, as written. */
  readonly played: readonly number[]
  /** The bar it stopped at, as written. */
  readonly at: number
  /** It was a start (Play pressed), counted once. */
  readonly started: boolean
  readonly seconds: number
  /** How many bars the song has as written. */
  readonly bars: number
}

/**
 * `songs` with `stretch` added to `pieceId`'s play, that song last; the oldest dropped past
 * SONGS_KEPT. The same object where the stretch adds nothing.
 */
export function withSongStretch(
  songs: Readonly<Partial<Record<PieceId, SongPlay>>>,
  pieceId: PieceId,
  stretch: SongStretch,
): Readonly<Partial<Record<PieceId, SongPlay>>> {
  const was = songs[pieceId]
  if (!was && !stretch.started && stretch.played.length === 0 && stretch.seconds <= 0) return songs
  const played = [...new Set([...(was?.played ?? []), ...stretch.played])].sort((a, b) => a - b)
  const next: SongPlay = {
    played,
    at: stretch.at,
    times: (was?.times ?? 0) + (stretch.started ? 1 : 0),
    seconds: (was?.seconds ?? 0) + Math.max(0, stretch.seconds),
    bars: stretch.bars,
  }
  const kept = Object.entries(songs)
    .filter(([id]) => id !== pieceId)
    .slice(-(SONGS_KEPT - 1))
  return { ...Object.fromEntries(kept), [pieceId]: next }
}

/**
 * The songs to go on with (canvas 133, Songs' Continue): each stopped part way, the latest played
 * first, with its place.
 */
export function songsToContinue(
  songs: Readonly<Partial<Record<PieceId, SongPlay>>>,
): readonly (readonly [PieceId, SongPlay])[] {
  return Object.entries(songs)
    .flatMap(([id, play]): (readonly [PieceId, SongPlay])[] =>
      play && play.at > 0 && play.at < play.bars ? [[id, play]] : [],
    )
    .reverse()
}
