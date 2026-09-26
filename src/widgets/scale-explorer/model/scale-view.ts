import type { NoteParam, ScaleKind } from '@/shared/lib/music'
import type { Hands, PracticeRhythm } from '@/shared/lib/schedule'

/** What the Scales explorer shows: the scale, the fingers under its keys, and how it is practised. */
export interface ScaleView {
  readonly root: NoteParam
  readonly kind: ScaleKind
  /** The fingers under the keys: none, or one hand's. */
  readonly fingers: 'none' | 'rh' | 'lh'
  readonly rhythm: PracticeRhythm
  readonly tempo: number
  readonly hands: Hands
  /** Triads or 7th chords in "chords in this scale". */
  readonly chords: 3 | 4
}
