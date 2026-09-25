import type { ChordQuality, NoteParam } from '@/shared/lib/music'

/** What the Chords explorer shows. */
export interface ChordView {
  readonly root: NoteParam
  readonly quality: ChordQuality
  readonly inversion: number
  readonly hands: 'rh' | 'both'
}
