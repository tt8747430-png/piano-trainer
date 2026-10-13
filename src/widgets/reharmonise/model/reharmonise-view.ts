import type { KeyParam, NoteParam } from '@/shared/lib/music'

/** What Reharmonise shows: a melody note in a key, and the chords that hold it (only the key's, asked). */
export interface ReharmoniseView {
  readonly key: KeyParam
  readonly note: NoteParam
  readonly inKey: boolean
}
