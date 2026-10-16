import type { KeyParam } from '@/shared/lib/music'

/** What the Chord finder shows, as its URL holds it (ADR 0054). */
export interface ChordFinderView {
  /** The keys tapped, written `60-64-67`, lowest first: a chord to send as a link. */
  readonly keys: string
  /** The key the notes and the chords' names are spelled in. */
  readonly key: KeyParam
}
