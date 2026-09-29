import type { Midi } from '@/shared/lib/music'
import type { KeyMark } from '@/shared/ui'

/** What an example puts on the page's keyboard: its keys, and how each is marked. */
export interface ShownKeys {
  readonly keys: readonly Midi[]
  readonly marks: ReadonlyMap<Midi, KeyMark>
}
