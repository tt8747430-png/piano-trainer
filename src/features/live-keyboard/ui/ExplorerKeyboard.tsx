import {
  keyboardRange,
  MIDDLE_OCTAVES,
  rangeOf,
  type KeyRange,
  type Midi,
} from '@/shared/lib/music'
import { Pinned, type KeyMark } from '@/shared/ui'
import { LiveKeyboard } from './LiveKeyboard'

/**
 * An explorer's keyboard, pinned while the page scrolls: `range` fills its width (by default the
 * middle octaves grown to hold `keys`), and it keeps `keys` in view.
 */
export function ExplorerKeyboard({
  keys,
  marks,
  range,
  keyPlays,
  outlined,
  onKeyPress,
  className,
}: {
  keys: readonly Midi[]
  marks: ReadonlyMap<Midi, KeyMark>
  range?: KeyRange | undefined
  /** What a key plays (Chords view: a degree's chord). */
  keyPlays?: ((key: Midi) => readonly Midi[]) | undefined
  /** Keys ringed inside: the chords that hold the note. */
  outlined?: ReadonlySet<Midi> | undefined
  /** What a key means besides its sound (Notes view: the note). */
  onKeyPress?: ((key: Midi) => void) | undefined
  /** Where it sits in the explorer's layout (a laptop's full-width row). */
  className?: string
}) {
  return (
    <Pinned className={className}>
      <LiveKeyboard
        range={range ?? keyboardRange(keys, MIDDLE_OCTAVES)}
        inView={rangeOf(keys)}
        marks={marks}
        outlined={outlined}
        keyPlays={keyPlays}
        onKeyPress={onKeyPress}
        spotlight
      />
    </Pinned>
  )
}
