import type { NoteParam } from '@/shared/lib/music'

/** What the Intervals explorer shows: every interval over a root. */
export interface IntervalView {
  readonly root: NoteParam
}
