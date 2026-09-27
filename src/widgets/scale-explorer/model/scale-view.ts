import type { ChordNotes, Fingering, NoteParam, ScaleKind } from '@/shared/lib/music'
import type { Hands, PracticeRhythm } from '@/shared/lib/schedule'

/** What the Scales reference shows: the scale, what its keys carry, and how it is practised. */
export interface ScaleView {
  readonly root: NoteParam
  readonly kind: ScaleKind
  /** What the keys carry: the scale's degrees, or the key's chords (a seven-note scale only). */
  readonly show: 'scale' | 'chords'
  /** The degree the run starts on, 1 the tonic (Scale view). */
  readonly start: number
  /** How the run is fingered; absent, as its start is (`ownFingering`). */
  readonly fingering?: Fingering
  /** The fingers under the keys: none, or one hand's (Scale view). */
  readonly fingers: 'none' | 'rh' | 'lh'
  readonly rhythm: PracticeRhythm
  readonly tempo: number
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
