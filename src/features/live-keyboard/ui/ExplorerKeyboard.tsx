import { keyboardRange, MIDDLE_OCTAVES, rangeOf, type Midi } from '@/shared/lib/music'
import { Pinned, type KeyMark } from '@/shared/ui'
import { LiveKeyboard } from './LiveKeyboard'

/**
 * An explorer's keyboard, pinned while the page scrolls: at least the middle octaves, grown to hold
 * the keys it shows, and kept on them.
 */
export function ExplorerKeyboard({
  keys,
  marks,
}: {
  keys: readonly Midi[]
  marks: ReadonlyMap<Midi, KeyMark>
}) {
  return (
    <Pinned>
      <LiveKeyboard
        range={keyboardRange(keys, MIDDLE_OCTAVES)}
        inView={rangeOf(keys)}
        marks={marks}
        className="h-44"
      />
    </Pinned>
  )
}
