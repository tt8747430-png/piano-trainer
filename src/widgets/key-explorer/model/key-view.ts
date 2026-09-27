import type { KeyParam } from '@/shared/lib/music'

/** What the Keys reference shows: a key, and its chords' size and inversion. */
export interface KeyView {
  readonly key: KeyParam
  /** Triads or 7th chords. */
  readonly chords: 3 | 4
  /** Root position (0) to the 3rd inversion, as far as the chords stack. */
  readonly inversion: number
}
