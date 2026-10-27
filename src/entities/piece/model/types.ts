import type { BookId } from '@/entities/book'
import type { PatternId } from '@/entities/pattern'
import type { LocalText } from '@/shared/i18n'
import { isOneOf } from '@/shared/lib'
import {
  parseKey,
  type ChordSize,
  type Clef,
  type Key,
  type Letter,
  type Meter,
  type TempoUnit,
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
  /** Anything else the heading says: 'and ending'. */
  readonly detail?: LocalText
  /** The key its bars are written in, where that is not the piece's: a key change. */
  readonly key?: KeyText
  /**
   * The meter its bars are counted in, where that is not the piece's: a change of time (ADR 0097),
   * of the piece's kind (a quarter's beat, or a dotted quarter's).
   */
  readonly meter?: Meter
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
  /** 4/4 printed as common time's C, 2/2 as cut time's ¢ (ADR 0114). */
  readonly timeSymbol?: true
  /** The note its tempo mark counts, where not the meter's beat (ADR 0114): ♪ = 180. */
  readonly tempoUnit?: TempoUnit
  readonly tempo: number
  readonly pattern: PatternId
  /** A performance of the piece that plays along in Listen: in its own key and form. */
  readonly recording?: Recording
}

/** A hand's bars written note by note, `|` between them, `-` for a bar left to the pattern: see docs/CONTENT.md. */
export interface Hands {
  readonly rh?: string
  readonly lh?: string
}

/** A staff's printed name (ADR 0097): content's in both languages, a learner's as typed. */
export type StaffName = LocalText | string

/** The longest name a staff takes. */
export const STAFF_NAME_MAX = 40

/** A staff's name as the score keeps it (ADR 0097): trimmed, 40 characters at most; none where none is left. */
export function staffName(text: string): string | undefined {
  const name = text.trim().slice(0, STAFF_NAME_MAX).trim()
  return name === '' ? undefined : name
}

/** A single staff over the piano's grand staff, as content writes it (ADR 0097). */
export interface PieceStaff {
  /** Its name, printed at the first line's head; none prints none. */
  readonly name?: StaffName
  /** Its clef: the treble unless it says the bass. */
  readonly clef?: Clef
  /** Its notes, one line: a note's name and octave, then beats (`E4/1 D4/.5 r/1`). */
  readonly notes: string
}

export interface ChartPiece extends PieceCommon {
  readonly kind: 'song' | 'study'
  readonly sections: readonly Section[]
  /** Its single staves over the piano's grand staff, top down (ADR 0097): the tune first. */
  readonly staves?: readonly PieceStaff[]
  /**
   * A lead sheet (ADR 0114): the piano's grand staff hidden, its music kept and played, the
   * single staves and the chord symbols in sight. Only a piece with a single staff is one.
   */
  readonly leadSheet?: boolean
  /** Bars of either hand written note by note, played in place of the pattern's hand there. */
  readonly hands?: Hands
  /**
   * Its words, a verse a string (ADR 0097): syllables parted by spaces, aligned to the notes of the
   * staff they are on in order, `-` ending a syllable its word carries on, `_` holding one over the
   * next note, `~` an empty place: see docs/CONTENT.md.
   */
  readonly lyrics?: readonly string[]
  /**
   * The staff its lyrics are written on (`lyricsStaff`): the top single staff's where it has one,
   * else the upper staff; written only where it is another.
   */
  readonly lyricsOn?: LyricsStaff
}

/**
 * A staff lyrics are written on (ADR 0097): a single staff by its place (0 the top), or the
 * piano's upper staff (the right hand's).
 */
export type LyricsStaff = number | 'rh'

/** Where a score's lyrics go where nothing says: on its top single staff, else the upper staff. */
export const defaultLyricsStaff = (score: { readonly staves?: readonly unknown[] }): LyricsStaff =>
  score.staves?.length ? 0 : 'rh'

/**
 * The staff a piece's lyrics are on (ADR 0097): the one `lyricsOn` names, else the top single
 * staff, else the upper staff.
 */
export const lyricsStaff = (piece: Pick<ChartPiece, 'staves' | 'lyricsOn'>): LyricsStaff =>
  piece.lyricsOn ?? defaultLyricsStaff(piece)

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
 * Whether a piece is a lead sheet: it hides the piano's staves, its single staves and chord names
 * shown (ADR 0114, 0097). The Player writes its single staves alone, the tune heard.
 */
export const isLeadSheet = (piece: Piece): boolean =>
  !isDegreePiece(piece) && piece.leadSheet === true && (piece.staves?.length ?? 0) > 0

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
/** A collection Songs lists: each is a folder of the library from the start (ADR 0106). */
export type SongCollectionId = (typeof SONG_COLLECTION_IDS)[number]
export const isSongCollectionId = isOneOf<SongCollectionId>(SONG_COLLECTION_IDS)
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
