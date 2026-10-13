import type { KeyParam } from '@/shared/lib/music'

/** What Passing chords shows: two chords as typed, the key around them, and whether only the ways in it. */
export interface PassingView {
  readonly key: KeyParam
  readonly from: string
  readonly to: string
  readonly inKey: boolean
}
