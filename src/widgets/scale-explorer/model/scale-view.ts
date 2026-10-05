import {
  keyMode,
  scaleHasChords,
  type ChordNotes,
  type Fingering,
  type NoteParam,
  type ScaleKind,
} from '@/shared/lib/music'
import type { Hands, PracticeRhythm } from '@/shared/lib/schedule'

/** The views of a scale, in the order their tabs stand. */
export const SCALE_SHOWS = ['scale', 'chords', 'key'] as const
export type ScaleShow = (typeof SCALE_SHOWS)[number]

/** The views a scale has: its run always, its chords with seven notes, its key where it is one's scale. */
export const showsOf = (kind: ScaleKind): readonly ScaleShow[] =>
  SCALE_SHOWS.filter(
    (show) =>
      show === 'scale' || (show === 'chords' ? scaleHasChords(kind) : keyMode(kind) !== null),
  )

/** What the Scales explorer shows: the scale, what its keys carry, and how it is practised. */
export interface ScaleView {
  readonly root: NoteParam
  readonly kind: ScaleKind
  /**
   * What the page shows: the scale's run, its chords (a seven-note scale only), or its key on the
   * circle of fifths (a major or minor scale only).
   */
  readonly show: ScaleShow
  /** The degree the run starts on, 1 the tonic (Scale view). */
  readonly start: number
  /** How the run is fingered; absent, as its start is (`ownFingering`). */
  readonly fingering?: Fingering
  readonly rhythm: PracticeRhythm
  readonly tempo: number
  /** The hand that plays the run, or both; its fingers stand under the keys (the right hand's for both). */
  readonly hands: Hands
  /** How many notes each chord stacks: 3 a triad … 7 a 13th (Chords view). */
  readonly chords: ChordNotes
  /** Root position (0) to the 3rd inversion, as far as the chords stack. */
  readonly inversion: number
  /** What a degree's key plays in Chords view: its chord, or its own note, lighting the chords that hold it. */
  readonly keysPlay: 'chords' | 'notes'
  /** Walk the chords rolled upwards rather than struck together. */
  readonly arpeggio: boolean
}
