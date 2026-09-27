import type { Midi, PlacedTone } from '@/shared/lib/music'
import type { KeyMark } from '@/shared/ui'

/** The key's scale on the keys: the tonic in its own colour, every note with its degree. */
export const keyMarks = (placed: readonly PlacedTone[]): Map<Midi, KeyMark> =>
  new Map(
    placed.map((key) => [
      key.midi,
      { tone: key.tone.role === 'root' ? 'tonic' : 'scale', label: key.tone.degree },
    ]),
  )
