import { isRecord } from '@/shared/lib'
import type { PieceId } from '@/entities/piece'
import { HANDS, type Hands } from '@/shared/lib/schedule'

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
  /** When it was last played, ISO: what Continue orders by (the research's Songs item 2). */
  readonly last: string
  /** The best Wait-mode pass, per cent, by the hands it was played with (research item 4). */
  readonly best: Readonly<Partial<Record<Hands, number>>>
}

/** How many songs keep their place: the latest played. */
export const SONGS_KEPT = 100

const isPlace = (value: unknown): value is number =>
  typeof value === 'number' && Number.isInteger(value) && value >= 0

const isScore = (value: unknown): value is number => isPlace(value) && value <= 100

function bestOf(value: unknown): SongPlay['best'] {
  if (!isRecord(value)) return {}
  const saved = value
  return Object.fromEntries(
    HANDS.flatMap((hands) => {
      const score = saved[hands]
      return isScore(score) ? [[hands, score]] : []
    }),
  )
}

/** A saved song's play as it can be read; nothing where it cannot. */
export function songPlay(value: unknown): SongPlay | undefined {
  if (!isRecord(value)) return undefined
  const { played, at, times, seconds, bars, last, best } = value
  if (!Array.isArray(played) || !isPlace(at) || !isPlace(times) || !isPlace(bars)) return undefined
  if (typeof seconds !== 'number' || !Number.isFinite(seconds) || seconds < 0) return undefined
  if (typeof last !== 'string' || Number.isNaN(Date.parse(last))) return undefined
  const sorted = [...new Set(played.filter(isPlace))].sort((a, b) => a - b)
  return { played: sorted, at, times, seconds, bars, last, best: bestOf(best) }
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
  /** When it stopped, ISO. */
  readonly ended: string
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
    last: stretch.ended,
    best: was?.best ?? {},
  }
  return withSong(songs, pieceId, next)
}

/** `songs` with `pieceId`'s play replaced, that song last; the oldest dropped past SONGS_KEPT. */
function withSong(
  songs: Readonly<Partial<Record<PieceId, SongPlay>>>,
  pieceId: PieceId,
  next: SongPlay,
): Readonly<Partial<Record<PieceId, SongPlay>>> {
  const kept = Object.entries(songs)
    .filter(([id]) => id !== pieceId)
    .slice(-(SONGS_KEPT - 1))
  return { ...Object.fromEntries(kept), [pieceId]: next }
}

/**
 * `songs` with a Wait pass's `score` kept as `pieceId`'s best with `hands` where it beats it. The same
 * object where it does not.
 */
export function withWaitScore(
  songs: Readonly<Partial<Record<PieceId, SongPlay>>>,
  pieceId: PieceId,
  hands: Hands,
  score: number,
  bars: number,
  now: Date,
): Readonly<Partial<Record<PieceId, SongPlay>>> {
  const was = songs[pieceId]
  if ((was?.best[hands] ?? -1) >= score) return songs
  const base: SongPlay = was ?? {
    played: [],
    at: 0,
    times: 0,
    seconds: 0,
    bars,
    last: now.toISOString(),
    best: {},
  }
  return withSong(songs, pieceId, { ...base, best: { ...base.best, [hands]: score } })
}

/**
 * The songs to go on with (canvas 133, Songs' Continue): each stopped part way and not learned, the
 * latest played first (Flat's Recent scores, by when), with its place.
 */
export function songsToContinue(
  songs: Readonly<Partial<Record<PieceId, SongPlay>>>,
  learned: (id: PieceId) => boolean,
): readonly (readonly [PieceId, SongPlay])[] {
  return Object.entries(songs)
    .flatMap(([id, play]): (readonly [PieceId, SongPlay])[] =>
      play && play.at > 0 && play.at < play.bars && !learned(id) ? [[id, play]] : [],
    )
    .toSorted(([, a], [, b]) => Date.parse(b.last) - Date.parse(a.last))
}
