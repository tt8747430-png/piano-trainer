import type { ChordQuality } from '@/shared/lib/music'

/** What the Chords explorer shows. `root` is a note as a URL writes it (`Bb`). */
export interface ChordView {
  readonly root: string
  readonly quality: ChordQuality
  readonly inversion: number
  readonly hands: 'rh' | 'both'
}
