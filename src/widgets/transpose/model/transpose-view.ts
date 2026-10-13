import type { KeyParam, NoteParam } from '@/shared/lib/music'

/** What Transpose shows (ADR 0045): a song's chords as typed, the key they are read in, the tonic they are played in. */
export interface TransposeView {
  /** The chords as typed, spaces, commas or bar lines between them; every one of them reads. */
  readonly chords: string
  /** The key the chords are read in, where the learner chose one; else the key found first. */
  readonly key?: KeyParam
  /** The tonic they are played in, in the read key's mode; the read key's own when left out. */
  readonly to?: NoteParam
}
