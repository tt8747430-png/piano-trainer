import { keptContent } from '@/shared/api/content'
import { pitchClassOf, type ChordSize, type Key, type SpelledNote } from '@/shared/lib/music'
import type { PatternId } from '@/entities/pattern'
import { COLLECTIONS, SONG_COLLECTIONS } from '../content'
import { readsAsMadeSong, updatesPiece, type MadeSong } from './content-record'
import { asChartPiece } from './degree-chart'
import { factsOf } from './facts'
import type { PieceMusic } from './music'
import type { OwnSong } from './own'
import type { PiecesState } from './store'
import {
  isDegreePiece,
  isPiece,
  isSongCollectionId,
  pieceKey,
  type ChartPiece,
  type Collection,
  type Entry,
  type Listing,
  type Piece,
} from './types'

const BUNDLED_BY_ID = new Map(
  COLLECTIONS.flatMap((collection) => collection.entries).map((entry) => [entry.id, entry]),
)
let built = {
  revision: -1,
  index: BUNDLED_BY_ID as ReadonlyMap<string, Entry>,
  made: [] as readonly MadeSong[],
}

/**
 * A newer copy with the app's own recording file: the database holds a recording's timing, never
 * its file, which is the app's asset (ADR 0116); a recording the app has no file for is left out.
 */
function withOwnRecording(entry: Entry, update: Piece): Piece {
  const file = 'recording' in entry ? entry.recording?.src : undefined
  if (!('recording' in update) || !update.recording) return update
  const { recording, ...rest } = update
  return file ? { ...update, recording: { ...recording, src: file } } : (rest as Piece)
}

/**
 * The catalog by id: the app's own entries, each piece the database has a newer copy of (kept on
 * the device, ADR 0116) in that copy where it reads as the piece, then the songs editors made (a kept
 * piece the app has not got that reads as one). Built again when the kept content changes.
 */
function catalog(): typeof built {
  const kept = keptContent()
  if (kept.revision === built.revision) return built
  const index = new Map(BUNDLED_BY_ID)
  for (const entry of BUNDLED_BY_ID.values()) {
    const body = kept.body('piece', entry.id)
    if (updatesPiece(entry, body)) index.set(entry.id, withOwnRecording(entry, body))
  }
  const made = kept.ids('piece').flatMap((id) => {
    const body = kept.body('piece', id)
    return !BUNDLED_BY_ID.has(id) && readsAsMadeSong(id, body) ? [body] : []
  })
  for (const song of made) index.set(song.id, song)
  built = { revision: kept.revision, index, made }
  PLAYING.clear()
  return built
}

const entryIndex = (): ReadonlyMap<string, Entry> => catalog().index

/** Every collection, in `COLLECTION_IDS` order, the songs editors made at their collections' ends. */
export const allCollections = (): readonly Collection[] => [
  ...songCollections(),
  ...COLLECTIONS.filter((collection) => !isSongCollectionId(collection.id)),
]

/** The collections Songs lists, in order, each with the songs editors made in it at its end. */
export const songCollections = (): readonly Collection[] => {
  const { made } = catalog()
  if (made.length === 0) return SONG_COLLECTIONS
  return SONG_COLLECTIONS.map((collection) => {
    const added = made.filter((song) => song.collection === collection.id)
    return added.length === 0
      ? collection
      : { ...collection, entries: [...collection.entries, ...added] }
  })
}

export const entryById = (id: string): Entry | undefined => entryIndex().get(id)

/** The piece with this id; undefined for a listing, which never opens in the Player. */
export function pieceById(id: string): Piece | undefined {
  const entry = entryById(id)
  return entry && isPiece(entry) ? entry : undefined
}

/**
 * Whether a piece has an original an editor may change (ADR 0116): a built-in song or study written
 * in notes, not an own song nor one written in degrees.
 */
export function hasEditableOriginal(id: string): boolean {
  const piece = pieceById(id)
  return piece !== undefined && !isDegreePiece(piece)
}

/**
 * The catalog entry a learner may have a version of: every song, study and listing, a song written in
 * degrees as its chart in its key (ADR 0115).
 */
export function versionableEntry(id: string): ChartPiece | Listing | undefined {
  const entry = entryById(id)
  return entry && isDegreePiece(entry) ? asChartPiece(entry) : entry
}

/** The learner's version's music of a catalog song, study or listing, where there is one. */
export const selectVersion = (
  state: Pick<PiecesState, 'versions'>,
  id: string,
): PieceMusic | undefined =>
  Object.hasOwn(state.versions, id) && versionableEntry(id) ? state.versions[id] : undefined

/** Whether the learner has a version of a catalog song, study or listing. */
export const selectHasVersion = (state: Pick<PiecesState, 'versions'>, id: string): boolean =>
  selectVersion(state, id) !== undefined

/** The learner's own song with this id. */
export const selectOwnSong = (state: Pick<PiecesState, 'songs'>, id: string): OwnSong | undefined =>
  state.songs.find((song) => song.id === id)

/** The own chord size of a piece written in degrees, where the learner may change it (the Player's Setup); else null. */
export const choosableChordSize = (piece: Piece): ChordSize | null =>
  isDegreePiece(piece) && piece.chordSize.choosable ? piece.chordSize.default : null

/** Whether `tonic` is the piece's own key's, however spelled: its recording plays along only there. */
export const isOwnKey = (piece: Piece, tonic: SpelledNote): boolean =>
  pitchClassOf(tonic) === pitchClassOf(pieceKey(piece).tonic)

/** The songs, listings and studies in a key, in catalog order. */
export function entriesInKey(key: Key): Entry[] {
  const tonic = pitchClassOf(key.tonic)
  return [...entryIndex().values()].filter((entry) => {
    const own = pieceKey(entry)
    return own.minor === key.minor && pitchClassOf(own.tonic) === tonic
  })
}

const PLAYING = new Map<PatternId, readonly Piece[]>()

/** The songs, studies and progressions that play a built-in pattern, in catalog order. */
export function piecesPlaying(pattern: PatternId): readonly Piece[] {
  const index = entryIndex()
  const known = PLAYING.get(pattern)
  if (known) return known
  const pieces = [...index.values()]
    .filter(isPiece)
    .filter((piece) => factsOf(piece).patterns.includes(pattern))
  PLAYING.set(pattern, pieces)
  return pieces
}
