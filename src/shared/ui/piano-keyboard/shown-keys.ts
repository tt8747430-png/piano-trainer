import type { Midi } from '@/shared/lib/music'
import type { KeyMark } from './key-look'

/** What a page's keyboard shows: the keys to hold in view, and how each is marked. */
export interface ShownKeys {
  readonly keys: readonly Midi[]
  readonly marks: ReadonlyMap<Midi, KeyMark>
}

/** Nothing on the keyboard: what a page shows before an example plays. */
export const NO_KEYS: ShownKeys = { keys: [], marks: new Map() }

/** Keys shown as they are, none marked: a chord or a row of chords as it sounds. */
export const unmarked = (keys: readonly Midi[]): ShownKeys => ({ keys, marks: new Map() })
