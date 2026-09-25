import type { ScaleKind } from '@/shared/lib/music'
import type { Hands, PracticeRhythm } from '@/shared/lib/schedule'

/** What the Scales explorer shows: the scale, how its keys are labelled, and how it is practised. */
export interface ScaleView {
  readonly root: string
  readonly kind: ScaleKind
  /** The keys' labels: degrees, or one hand's fingers. */
  readonly view: 'degrees' | 'rh' | 'lh'
  readonly rhythm: PracticeRhythm
  readonly tempo: number
  readonly hands: Hands
  /** Triads or 7th chords in "chords in this scale". */
  readonly chords: 3 | 4
}
