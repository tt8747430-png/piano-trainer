import {
  isOwnSongId,
  musicOf,
  pieceKey,
  selectOwnSong,
  selectVersion,
  versionableEntry,
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

/**
 * What the editor writes: a catalog song's, study's or listing's version, an own song, or (an editor's,
 * ADR 0116) the original of a built-in song or study, saved by its draft.
 */
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
    }
  | {
      readonly kind: 'song'
      readonly id: OwnSongId
      /** Its music under its title: the learner's, saved with it (ADR 0114). */
      readonly music: PieceMusic & { readonly title: string }
    }
  | {
      readonly kind: 'original'
      readonly id: PieceId
      readonly entry: ChartPiece
      /** The draft's music, else the song's as published. */
      readonly music: PieceMusic
      /** Saves a change to the draft. */
      readonly save: (music: PieceMusic) => void
    }

/** The editor's target for an id, or none: a progression, or nothing there, is not edited. */
export function editorTarget(state: PiecesState, id: string): EditorTarget | undefined {
  if (isOwnSongId(id)) {
    const song = selectOwnSong(state, id)
    if (!song) return undefined
    const { id: _id, ...music } = song
    return { kind: 'song', id, music }
  }
  const entry = versionableEntry(id)
  if (!entry) return undefined
  // Compared with what the editor writes, so the original written back unchanged is no version.
  const original = asWritten(
    entry.kind === 'listing' ? chartStart(pieceKey(entry), entry.meter) : musicOf(entry),
  )
  return { kind: 'version', id, entry, music: selectVersion(state, id) ?? original, original }
}

/** The original of a built-in song, as the editor writes it, saved by `save`. */
export const originalTarget = (
  entry: ChartPiece,
  music: PieceMusic,
  save: (music: PieceMusic) => void,
): EditorTarget => ({ kind: 'original', id: entry.id, entry, music: asWritten(music), save })

/**
 * The target's music as the store holds it now; none for an own song deleted, or an original (its
 * draft is the server's, not this device's store).
 */
export function savedMusic(state: PiecesState, target: EditorTarget): PieceMusic | undefined {
  if (target.kind === 'original') return undefined
  if (target.kind === 'version') return selectVersion(state, target.id) ?? target.original
  const song = selectOwnSong(state, target.id)
  if (!song) return undefined
  const { id: _id, ...music } = song
  return music
}

/** Where the editor saves what it writes. */
export const savingTo = (target: Exclude<EditorTarget, { kind: 'original' }>): MusicTarget =>
  target.kind === 'song'
    ? { kind: 'song', id: target.id }
    : { kind: 'version', id: target.id, original: target.original }
