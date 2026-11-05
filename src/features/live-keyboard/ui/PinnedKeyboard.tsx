import { useState } from 'react'
import { selectKeyboard, useSettings } from '@/entities/settings'
import {
  keyboardRange,
  MIDDLE_OCTAVES,
  rangeOf,
  type KeyRange,
  type Midi,
} from '@/shared/lib/music'
import { cn } from '@/shared/lib'
import { Docked, Pinned, type ShownKeys } from '@/shared/ui'
import { useFoldKeys, type KeysScreen } from '../model/use-fold-keys'
import { LiveKeyboard } from './LiveKeyboard'

/**
 * A page's keyboard, pinned while the page scrolls (an explorer's, a tool's, a lesson's): `range` fills its width (by default the
 * middle octaves grown to hold the keys it opened on, so the keys never change size as a page shows
 * other keys), and it scrolls the keys the app shows into view, no further than that. A key a hand chooses (`selected`) never moves it: the keys hold still
 * under the finger (ADR 0062). It stays edge to edge where the keyboard settings dock it, at the
 * screen's foot over the tab bar or at its top under the screen's bar (R34, Songscription's). Hidden
 * from the page's bar (`PageKeyboardTools`), it leaves nothing behind, nothing floating; on a phone on
 * its side a reading page opens with it hidden until shown there (ADR 0062); a screen played on
 * (`screen="playing"`) keeps it in sight.
 */
export function PinnedKeyboard({
  shown,
  range,
  keyPlays,
  outlined,
  selected,
  wrong,
  onKeyPress,
  screen = 'reading',
  className,
}: {
  /** The keys to hold in view, each marked as the page shows it. */
  shown: ShownKeys
  range?: KeyRange | undefined
  /** What a key plays (Chords view: a degree's chord). */
  keyPlays?: ((key: Midi) => readonly Midi[]) | undefined
  /** Keys ringed inside: the chords that hold the note, an answer's missing notes. */
  outlined?: ReadonlySet<Midi> | undefined
  /** A lesson question's chosen keys: the keys become toggles. */
  selected?: ReadonlySet<Midi> | undefined
  /** An answer's extra keys. */
  wrong?: ReadonlySet<Midi> | undefined
  /** What a key means besides its sound (Notes view: the note). */
  onKeyPress?: ((key: Midi) => void) | undefined
  /** What the screen's keys are for: read beside, or played on (the Chord finder). */
  screen?: KeysScreen
  /** Where it sits in its page's layout (a laptop's full-width row). */
  className?: string
}) {
  const dock = useSettings((state) => selectKeyboard(state).dock)
  const { folded } = useFoldKeys(screen)
  const { keys, marks } = shown
  const [opened] = useState(keys)
  const showing = selected ? keys.filter((key) => !selected.has(key)) : keys
  if (folded) return null
  const body = (
    <LiveKeyboard
      range={range ?? keyboardRange(opened, MIDDLE_OCTAVES)}
      inView={rangeOf(showing) ?? rangeOf(opened)}
      marks={marks}
      outlined={outlined}
      selected={selected}
      wrong={wrong}
      keyPlays={keyPlays}
      onKeyPress={onKeyPress}
      spotlight
    />
  )
  // Edge to edge (R34): the dock's gutters and foot are the keys' own.
  if (dock === 'bottom')
    return (
      <Docked className="vt-keys px-0 pt-0 pb-0 landscape-phone:pr-0 landscape-phone:pb-0 lg:pb-0">
        {body}
      </Docked>
    )
  return <Pinned className={cn('vt-keys px-0 pb-0', className)}>{body}</Pinned>
}
