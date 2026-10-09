import { useState } from 'react'
import {
  keyboardRange,
  MIDDLE_OCTAVES,
  rangeOf,
  type KeyRange,
  type Midi,
} from '@/shared/lib/music'
import { cn } from '@/shared/lib'
import { Pinned, type ShownKeys } from '@/shared/ui'
import { LiveKeyboard } from './LiveKeyboard'

/**
 * An explorer's keyboard, pinned while the page scrolls: `range` fills its width (by default the
 * middle octaves grown to hold the keys it opened on and the keys the app shows), and it keeps the
 * keys the app shows in view. A key a hand chooses (`selected`) never moves it: the keys hold still
 * under the finger (ADR 0009).
 */
export function ExplorerKeyboard({
  shown,
  range,
  keyPlays,
  outlined,
  selected,
  wrong,
  onKeyPress,
  className,
}: {
  /** The keys to hold in view, each marked as the page shows it. */
  shown: ShownKeys
  range?: KeyRange | undefined
  /** What a key plays (Chords view: a degree's chord). */
  keyPlays?: ((key: Midi) => readonly Midi[]) | undefined
  /** Keys ringed inside: the chords that hold the note, a quiz answer's missing notes. */
  outlined?: ReadonlySet<Midi> | undefined
  /** A lesson quiz's chosen keys: the keys become toggles. */
  selected?: ReadonlySet<Midi> | undefined
  /** A quiz answer's extra keys. */
  wrong?: ReadonlySet<Midi> | undefined
  /** What a key means besides its sound (Notes view: the note). */
  onKeyPress?: ((key: Midi) => void) | undefined
  /** Where it sits in the explorer's layout (a laptop's full-width row). */
  className?: string
}) {
  const { keys, marks } = shown
  const [opened] = useState(keys)
  const showing = selected ? keys.filter((key) => !selected.has(key)) : keys
  return (
    // The rail's strip is as tall as its buttons' targets and draws only its lower part: the rest is
    // already the gap over the keys, so the keyboard sits that much nearer what is above it.
    <Pinned className={cn('-mt-2', className)}>
      <LiveKeyboard
        range={range ?? keyboardRange([...opened, ...showing], MIDDLE_OCTAVES)}
        inView={rangeOf(showing) ?? rangeOf(opened)}
        marks={marks}
        outlined={outlined}
        selected={selected}
        wrong={wrong}
        keyPlays={keyPlays}
        onKeyPress={onKeyPress}
        spotlight
      />
    </Pinned>
  )
}
