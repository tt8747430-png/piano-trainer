import type { PatternId } from '@/entities/pattern'
import type { LocalText } from '@/shared/i18n'
import { isOneOf } from '@/shared/lib'
import { parseKey, type Key, type Letter } from '@/shared/lib/music'

/** A saved id may name a piece a later version removed, so it stays a plain name. */
export type PieceId = string

export const METERS = ['2/4', '3/4', '4/4', '6/8', '12/8'] as const
export type Meter = (typeof METERS)[number]

/** Compound meters count dotted quarters: 6/8 has two beats, 12/8 four. */
const BEATS_PER_BAR: Readonly<Record<Meter, number>> = {
  '2/4': 2,
  '3/4': 3,
  '4/4': 4,
  '6/8': 2,
  '12/8': 4,
}
export const beatsPerBar = (meter: Meter): number => BEATS_PER_BAR[meter]

/** A key as content writes it: `G`, `F#`, `Ebm`. */
export type KeyText = `${Letter}${'' | '#' | 'b'}${'' | 'm'}`

export const SECTION_KINDS = [
  'intro',
  'verse',
  'chorus',
  'ending',
  'practice',
  'hymn',
  'part',
] as const
export type SectionKind = (typeof SECTION_KINDS)[number]

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
  /** Bars separated by spaces; see docs/CONTENT.md. */
  readonly lines: readonly string[]
}

/** A printed songbook or method a Source cites. */
export type BookId = 'bozhe-spasibo' | 'called-to-play' | 'seven-types'
export interface Source {
  readonly book: BookId
  readonly number?: number
  readonly page?: number
}

export const CREDIT_ROLES = [
  'authors',
  'words-and-music',
  'words',
  'music',
  'russian-text',
  'harmony',
  'accompaniment',
] as const
export type CreditRole = (typeof CREDIT_ROLES)[number]
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
  readonly credits?: readonly Credit[]
  readonly source?: Source
  readonly key: KeyText
  readonly meter: Meter
  readonly note?: LocalText
}

interface PieceCommon extends EntryCommon {
  readonly tempo: number
  readonly pattern: PatternId
}

export interface ChartPiece extends PieceCommon {
  readonly kind: 'song' | 'exercise'
  readonly sections: readonly Section[]
  /** Note, octave and beats: `E4/1 D4/.5 r/1`. */
  readonly melody?: string
}

export const VOICINGS = ['triads', 'sevenths', 'ninths'] as const
export type Voicing = (typeof VOICINGS)[number]

export interface ProgressionPiece extends PieceCommon {
  readonly kind: 'progression'
  readonly voicing: { readonly default: Voicing; readonly choosable: boolean }
  /** Degree, function and beats per chord: `ii:min:4 V:dom:4 I:maj:8`. */
  readonly progression: string
}

export type Piece = ChartPiece | ProgressionPiece

/** A songbook entry with no chart yet: shown in Songs, never opened in the Player. */
export interface Listing extends EntryCommon {
  readonly kind: 'listing'
}

export type Entry = Piece | Listing

/** The collections, in the order Songs lists them; the content holds each to its place here. */
export const COLLECTION_IDS = [
  'bozhe-spasibo',
  'called-to-play',
  'exercises',
  'hymns',
  'progressions',
] as const
export type CollectionId = (typeof COLLECTION_IDS)[number]
export const isCollectionId = isOneOf(COLLECTION_IDS)
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
