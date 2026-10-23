import type { BookId } from '@/entities/book'
import type { PatternId } from '@/entities/pattern'
import type { LocalText } from '@/shared/i18n'
import { isOneOf } from '@/shared/lib'
import {
  parseKey,
  type ChordSize,
  type Instrument,
  type Key,
  type Letter,
  type Meter,
} from '@/shared/lib/music'
import type { Recording } from '@/shared/lib/schedule'

/** A saved id may name a piece a later version removed, so it stays a plain name. */
export type PieceId = string

/** A key as content writes it: `G`, `F#`, `Ebm`. */
export type KeyText = `${Letter}${'' | '#' | 'b'}${'' | 'm'}`

export const SECTION_KINDS = [
  'intro',
  'verse',
  'chorus',
  'bridge',
  'ending',
  'practice',
  'hymn',
  'part',
] as const
export type SectionKind = (typeof SECTION_KINDS)[number]
/** The parts a song has, as its maker names them; the songbooks' own (Practice, Hymn, Part) stay theirs. */
export const SONG_SECTION_KINDS = [
  'intro',
  'verse',
  'chorus',
  'bridge',
  'ending',
] as const satisfies readonly SectionKind[]

export interface Section {
  readonly kind: SectionKind
  /** Numbers a verse. */
  readonly n?: number
  /** Names a part: 'A', 'B'. */
  readonly label?: string
  /** A last chorus or a last ending. */
  readonly last?: boolean
  /** Anything else the heading says: 'in 2/4', 'and ending'. */
  readonly detail?: LocalText
  /** The key its bars are written in, where that is not the piece's: a key change. */
  readonly key?: KeyText
  /** The accompaniment its chords play, where it is not the piece's (a chord's method code still wins). */
  readonly pattern?: PatternId
  /** A chart's bars separated by spaces, or a sectioned progression's chords; see docs/CONTENT.md. */
  readonly lines: readonly string[]
}

/** Where a piece is printed: its book, and its number and page there. */
export interface Source {
  readonly book: BookId
  readonly number?: number
  readonly page?: number
}

type CreditRole =
  'authors' | 'words-and-music' | 'words' | 'music' | 'russian-text' | 'harmony' | 'accompaniment'
/** Names stay as printed; the role is shown through an interface string in the learner's language. */
export type Credit =
  { readonly role: CreditRole; readonly names: string } | { readonly role: 'unknown' }

/** What every Songs entry has, openable or not. */
interface EntryCommon {
  readonly id: PieceId
  /** As printed. */
  readonly title: string
  /** The English title, where the printed one is not English. */
  readonly titleEn?: string
  /** The Russian title it is known by, where the printed one is not Russian. */
  readonly titleRu?: string
  readonly credits?: readonly Credit[]
  readonly source?: Source
  readonly key: KeyText
  readonly meter: Meter
  readonly note?: LocalText
}

interface PieceCommon extends EntryCommon {
  readonly tempo: number
  readonly pattern: PatternId
  /** A performance of the piece that plays along in Listen: in its own key and form. */
  readonly recording?: Recording
}

/** A hand's bars written note by note, `|` between them, `-` for a bar the pattern plays: see docs/CONTENT.md. */
export interface Hands {
  readonly rh?: string
  readonly lh?: string
}

export interface ChartPiece extends PieceCommon {
  readonly kind: 'song' | 'study'
  readonly sections: readonly Section[]
  /** Note, octave and beats: `E4/1 D4/.5 r/1`. */
  readonly melody?: string
  /** More voices sung with the tune, each written as the tune is, each on a staff of its own (ADR 0066). */
  readonly voices?: readonly string[]
  /**
   * What each sung part is played on, the tune's first, then each more voice's (ADR 0070): `voice`
   * where none is given.
   */
  readonly instruments?: readonly Instrument[]
  /** The rows the score leaves out of sight, their music kept (ADR 0072): hidden, not removed. */
  readonly hidden?: readonly HiddenRow[]
  /** Bars of either hand written note by note, played in place of the pattern's hand there. */
  readonly hands?: Hands
}

/**
 * The rows a score may hide: the chord names, the tune's staff, each more voice's (ADR 0072), and the
 * piano's grand staff, which leaves a lead sheet (ADR 0083).
 */
export const HIDDEN_ROWS = ['chords', 'melody', 'voice2', 'voice3', 'voice4', 'piano'] as const
export type HiddenRow = (typeof HIDDEN_ROWS)[number]
export const isHiddenRow = isOneOf(HIDDEN_ROWS)

/** The more voices' rows, the second voice's first. */
const VOICE_ROWS = ['voice2', 'voice3', 'voice4'] as const satisfies readonly HiddenRow[]

/**
 * Whether a score with `hidden` out of sight still shows a staff (ADR 0083): the piano's, the tune's
 * where it has one, or a more voice's it has. A score never hides every staff.
 */
export function showsAStaff(
  hidden: readonly HiddenRow[],
  staves: { readonly melody: boolean; readonly voices: number },
): boolean {
  const shown = (row: HiddenRow) => !hidden.includes(row)
  return (
    shown('piano') ||
    (staves.melody && shown('melody')) ||
    VOICE_ROWS.slice(0, staves.voices).some(shown)
  )
}

/**
 * A song written in degrees, as its course teaches it: read in any key, its chords growing with the
 * chord size. What a piece is (its kind) and how it is written are two things.
 */
export interface DegreePiece extends PieceCommon {
  readonly kind: 'song'
  readonly chordSize: { readonly default: ChordSize; readonly choosable: boolean }
  /**
   * Degree, function and beats per chord (`ii:min:4 V:dom:4 I:maj:8`), four bars a line under one
   * heading; or a chart's Sections whose lines are written so, each line of the chart as written.
   */
  readonly progression: string | readonly Section[]
}

export type Piece = ChartPiece | DegreePiece

/** Whether a piece is written in degrees, not as a chart in its key. */
export const isDegreePiece = (piece: Entry): piece is DegreePiece => 'progression' in piece

/**
 * Whether a piece is a lead sheet: it hides the piano's staves, its tune and chord names shown (ADR
 * 0083). The Player writes its tune's staff alone, the tune heard.
 */
export const isLeadSheet = (piece: Piece): boolean =>
  !isDegreePiece(piece) && piece.hidden?.includes('piano') === true

/** A songbook entry with no chart yet: shown in Songs, never opened in the Player. */
export interface Listing extends EntryCommon {
  readonly kind: 'listing'
}

export type Entry = Piece | Listing

/** The collections, songs first (in the order Songs lists them), then Practice's studies. */
export const COLLECTION_IDS = [
  'learning-songs',
  'bozhe-spasibo',
  'called-to-play',
  'called-to-play-2',
  'hymns',
  'gorshkov',
  'studies',
] as const
export type CollectionId = (typeof COLLECTION_IDS)[number]

/**
 * The collections Songs lists: ids only, so a URL is checked without loading a piece (the content
 * holds `SONG_COLLECTIONS` to them).
 */
const SONG_COLLECTION_IDS = [
  'learning-songs',
  'bozhe-spasibo',
  'called-to-play',
  'called-to-play-2',
  'hymns',
  'gorshkov',
] as const satisfies readonly CollectionId[]
export const isSongCollectionId = isOneOf<CollectionId>(SONG_COLLECTION_IDS)
export interface Collection {
  readonly id: CollectionId
  readonly name: LocalText
  readonly entries: readonly Entry[]
}

/** Types a piece file as it is written. */
export const definePiece = (piece: Piece): Piece => piece

export const defineListing = (listing: Omit<Listing, 'kind'>): Listing => ({
  ...listing,
  kind: 'listing',
})

export const isPiece = (entry: Entry): entry is Piece => entry.kind !== 'listing'

export function pieceKey(entry: Entry): Key {
  const key = parseKey(entry.key)
  if (!key) throw new RangeError(`${entry.id} is in no key: "${entry.key}"`)
  return key
}
