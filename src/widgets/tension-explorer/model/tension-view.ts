import type { NoteParam, TensionChord } from '@/shared/lib/music'

/** What the Available tensions explorer shows: a 7th chord on a root, and the twelve notes over it. */
export interface TensionView {
  readonly root: NoteParam
  readonly chord: TensionChord
}
