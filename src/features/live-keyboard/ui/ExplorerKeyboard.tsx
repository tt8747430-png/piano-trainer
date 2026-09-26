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
  className,
}: {
  keys: readonly Midi[]
  marks: ReadonlyMap<Midi, KeyMark>
  /** Where it sits in the explorer's layout (a laptop's full-width row). */
  className?: string
}) {
  return (
    <Pinned className={className}>
      <LiveKeyboard
        range={keyboardRange(keys, MIDDLE_OCTAVES)}
        inView={rangeOf(keys)}
        marks={marks}
        spotlight
      />
    </Pinned>
  )
}
