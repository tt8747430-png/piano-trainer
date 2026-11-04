import type { AccompanimentChoice } from '@/entities/pattern'
import type { ChordSize, SpelledNote } from '@/shared/lib/music'

/** A song's versions by level (R29 B8): as written, its chords as triads, the tune over roots. */
export const SONG_VERSIONS = ['original', 'simple', 'easy'] as const
export type SongVersion = (typeof SONG_VERSIONS)[number]

/** What the learner chose to practise a piece with: the Player's URL, read. */
export interface PracticeChoice extends AccompanimentChoice {
  readonly tonic: SpelledNote
  /** Null plays the piece's own chord size. */
  readonly chordSize: ChordSize | null
  /** The Tune switch: the tune, the top single staff, heard along with the hands (ADR 0097). */
  readonly tune: boolean
  /**
   * The version played (R29 B8): as written; Simplified (ADR 0105), every chord its plain triad on its
   * root; or Easy, the tune and each chord's root.
   */
  readonly version: SongVersion
  /** Transpose key signature (R29 T): the signature moves with the notes; off, it stays as written. */
  readonly signature: boolean
  /** Transpose chord symbols (R29 T): the symbols move; off, they print as written over the moved chord. */
  readonly chordSymbols: boolean
  /** A single-staff song's staff read in this clef (R29 B7); null, as written. */
  readonly clef: 'treble' | 'bass' | null
}
