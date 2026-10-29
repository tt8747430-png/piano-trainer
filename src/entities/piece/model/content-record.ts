import { parseKey } from '@/shared/lib/music'
import { factsOf } from './facts'
import { musicOf, readMusic, type PieceMusic } from './music'
import {
  isPiece,
  isSongCollectionId,
  type ChartPiece,
  type Entry,
  type Piece,
  type SongCollectionId,
} from './types'

/** Every field of a piece that is its music: what an editor's draft writes over (ADR 0116). */
const MUSIC_FIELDS = [
  'key',
  'meter',
  'timeSymbol',
  'tempoUnit',
  'tempo',
  'pattern',
  'sections',
  'staves',
  'leadSheet',
  'hands',
  'lyrics',
  'lyricsOn',
] as const satisfies readonly (keyof PieceMusic)[]

/** Whether a body from the database reads as a newer copy of this catalog piece: its id, kind and key. */
export function updatesPiece(entry: Entry, body: unknown): body is Piece {
  if (typeof body !== 'object' || body === null) return false
  const update = body as Partial<Piece>
  return (
    isPiece(entry) &&
    update.id === entry.id &&
    update.kind === entry.kind &&
    typeof update.key === 'string' &&
    Boolean(parseKey(update.key)) &&
    typeof update.meter === 'string' &&
    ('sections' in update ? Array.isArray(update.sections) : 'progression' in update)
  )
}

/** A song an editor made in the app (content as data, ADR 0116): a chart, and the collection it ends. */
export type MadeSong = ChartPiece & { readonly collection: SongCollectionId }

/**
 * Whether a body from the database reads as the song `id` an editor made: a song written as a chart,
 * titled, in a key and a meter, and in a collection Songs lists.
 */
export function readsAsMadeSong(id: string, body: unknown): body is MadeSong {
  if (typeof body !== 'object' || body === null) return false
  const song = body as Partial<MadeSong>
  return (
    song.id === id &&
    song.kind === 'song' &&
    isSongCollectionId(song.collection) &&
    typeof song.title === 'string' &&
    song.title.trim() !== '' &&
    typeof song.key === 'string' &&
    Boolean(parseKey(song.key)) &&
    typeof song.meter === 'string' &&
    typeof song.tempo === 'number' &&
    typeof song.pattern === 'string' &&
    Array.isArray(song.sections)
  )
}

/**
 * A piece as the database holds it (ADR 0116): its recording without the file's URL, which is the
 * app's own asset and differs from one build to the next.
 */
export function pieceRecordBody(piece: Piece): unknown {
  if (!('recording' in piece) || !piece.recording) return piece
  const { src: _src, ...recording } = piece.recording
  return { ...piece, recording }
}

/** What the database's lists show of a piece. */
export const pieceRecordMeta = (piece: Piece): Readonly<Record<string, unknown>> => ({
  title: piece.title,
  titleEn: piece.titleEn,
  titleRu: piece.titleRu,
  key: piece.key,
  meter: piece.meter,
  facts: factsOf(piece),
})

/**
 * The catalog piece with this music in place of its own: every field of its music the music's, the
 * rest (its titles, its recording) its own. A learner's title is a version's, never the catalog's.
 */
export function originalWith(piece: ChartPiece, music: PieceMusic): ChartPiece {
  const own = Object.fromEntries(
    Object.entries(piece).filter(([field]) => !(MUSIC_FIELDS as readonly string[]).includes(field)),
  )
  const { title: _title, ...written } = music
  return { ...(own as Omit<ChartPiece, (typeof MUSIC_FIELDS)[number]>), ...written }
}

/** An editor's draft of the piece read back as its music: none where it is not a copy whose music reads. */
export function originalMusic(piece: ChartPiece, body: unknown): PieceMusic | undefined {
  if (!updatesPiece(piece, body) || !('sections' in body)) return undefined
  const music = musicOf(body)
  try {
    readMusic(music)
    return music
  } catch {
    return undefined
  }
}
