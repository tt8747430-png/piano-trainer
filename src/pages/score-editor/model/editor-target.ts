import {
  isOwnSongId,
  musicOf,
  pieceKey,
  repertoire,
  type ChartPiece,
  type Listing,
  type OwnSongId,
  type PieceId,
  type PieceMusic,
  type PiecesState,
} from '@/entities/piece'
import { chartStart, type MusicTarget } from '@/features/edit-piece'
import { readDraft, writeDraft } from '@/features/score-editor'

/** Music as the editor writes it: the book's own spelling of beats and bars put as the writer puts it. */
const asWritten = (music: PieceMusic): PieceMusic => writeDraft(readDraft(music))

/** What the editor writes: a catalog song's, study's or listing's version, or an own song (spec §2). */
export type EditorTarget =
  | {
      readonly kind: 'version'
      readonly id: PieceId
      /** The catalog's entry: its titles, and the shelf its page is on. */
      readonly entry: ChartPiece | Listing
      /** The music the editor opens on: the learner's version, else the original. */
      readonly music: PieceMusic
      /**
       * A version equal to it is no version: the original as the editor writes it (a listing's, its chart's
       * start).
       */
      readonly original: PieceMusic
      readonly hasVersion: boolean
    }
  | {
      readonly kind: 'song'
      readonly id: OwnSongId
      readonly title: string
      readonly music: PieceMusic
      readonly hasVersion: false
    }

/** The editor's target for an id, or none: a progression, or nothing there, is not edited. */
export function editorTarget(state: PiecesState, id: string): EditorTarget | undefined {
  if (isOwnSongId(id)) {
    const song = state.songs.find((own) => own.id === id)
    if (!song) return undefined
    const { id: _id, title, ...music } = song
    return { kind: 'song', id, title, music, hasVersion: false }
  }
  const entry = repertoire(state).original(id)
  if (!entry || entry.kind === 'progression') return undefined
  // Compared with what the editor writes, so the original written back unchanged is no version.
  const original = asWritten(
    entry.kind === 'listing' ? chartStart(pieceKey(entry), entry.meter) : musicOf(entry),
  )
  const version = Object.hasOwn(state.versions, id) ? state.versions[id] : undefined
  return {
    kind: 'version',
    id,
    entry,
    music: version ?? original,
    original,
    hasVersion: version !== undefined,
  }
}

/** Where the editor saves what it writes. */
export const savingTo = (target: EditorTarget): MusicTarget =>
  target.kind === 'song'
    ? { kind: 'song', id: target.id }
    : { kind: 'version', id: target.id, original: target.original }
