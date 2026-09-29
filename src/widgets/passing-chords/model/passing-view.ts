import type { KeyParam } from '@/shared/lib/music'

/** What Passing chords shows: two chords as typed, and the key around them. */
export interface PassingView {
  readonly key: KeyParam
  readonly from: string
  readonly to: string
}
