import { CHORD_SHEET_SONGS, type ChordSheetSong } from '@/entities/chord-sheet'
import {
  chartOf,
  isDegreePiece,
  isPiece,
  SONG_COLLECTIONS,
  type Piece,
  type SectionKind as PieceSectionKind,
} from '@/entities/piece'
import type { LocalText } from '@/shared/i18n'
import { chartToSheet, sheetToText, type SectionKind } from '@/shared/lib/arrangement'

/** A shelf of the Chord player's songs: a collection of the app's songs, each a sheet to open. */
export interface SongShelf {
  readonly id: string
  readonly name: LocalText
  readonly songs: readonly ChordSheetSong[]
}

/** A song's part as a sheet names it: its Ending the sheet's Outro, a songbook's own part a Verse. */
const SHEET_KIND: Partial<Record<PieceSectionKind, SectionKind>> = {
  intro: 'intro',
  verse: 'verse',
  chorus: 'chorus',
  bridge: 'bridge',
  ending: 'outro',
}

/** A song of the app with chords, as a sheet the Chord player opens; none for one with no chart. */
function songOf(piece: Piece): ChordSheetSong | null {
  if (piece.kind !== 'song' || isDegreePiece(piece)) return null
  const sheet = chartToSheet(
    chartOf(piece),
    piece.sections.map((section) => SHEET_KIND[section.kind] ?? 'verse'),
  )
  if (!sheet) return null
  const by = (piece.credits ?? []).flatMap((credit) => ('names' in credit ? [credit.names] : []))
  return {
    id: piece.id,
    name: piece.title,
    by: by.join(', '),
    text: sheetToText(sheet),
    tempo: piece.tempo,
  }
}

/**
 * The songs the Chord player's library holds, by the app's own collections (owner, 2026-11-28: Voi
 * cânta played in the Chord player): every song with chords, as its chart writes it, and the charts
 * kept as sheets alone (`CHORD_SHEET_SONGS`) with the worship songs they are.
 */
export function songShelves(): SongShelf[] {
  return SONG_COLLECTIONS.map((collection) => ({
    id: collection.id,
    name: collection.name,
    songs: [
      ...collection.entries.flatMap((entry) => {
        const song = isPiece(entry) ? songOf(entry) : null
        return song ? [song] : []
      }),
      ...(collection.id === 'worship' ? CHORD_SHEET_SONGS : []),
    ],
  })).filter((shelf) => shelf.songs.length > 0)
}
