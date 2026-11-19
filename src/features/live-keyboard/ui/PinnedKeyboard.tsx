import { useState, type ReactNode } from 'react'
import {
  keyboardRange,
  MIDDLE_OCTAVES,
  rangeOf,
  type KeyRange,
  type Midi,
} from '@/shared/lib/music'
import { cn, LAPTOP, useMediaQuery } from '@/shared/lib'
import { Docked, Pinned, type ShownKeys } from '@/shared/ui'
import { useFoldKeys, type KeysScreen } from '../model/use-fold-keys'
import { LiveKeyboard } from './LiveKeyboard'

/** A page's pinned keys stand as every Practice board draws them: 150px on a phone, 180 on a laptop. */
const PHONE_KEYS_PX = 150
const LAPTOP_KEYS_PX = 180

/**
 * A page's keyboard, pinned while the page scrolls (an explorer's, a tool's, a lesson's): `range` fills its width (by default the
 * middle octaves grown to hold the keys it opened on, so the keys never change size as a page shows
 * other keys), and it scrolls the keys the app shows into view, no further than that. A key a hand chooses (`selected`) never moves it: the keys hold still
 * under the finger (ADR 0062). It stays edge to edge where the keyboard settings dock it, at the
 * screen's foot over the tab bar or at its top under the screen's bar (R34, Songscription's), with no
 * divider: the boards draw a page's keys at their piano's proportion (canvas 197). Hidden from the
 * page's Piano sheet (its bar's Piano), it leaves nothing where it stood, as every board draws it
 * (owner, 2026-11-17: "the same floating keyboard everywhere"); on a phone on its side a reading page
 * opens with it hidden until shown there (ADR 0062); a screen played on (`screen="playing"`) keeps it
 * in sight.
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
  place,
  fitInView = false,
  sized,
  className,
  children,
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
  /** Under the bar whatever the dock: a page whose keys are its stage (Chords, its canvas). */
  place?: 'top' | undefined
  /** Narrows its keys until the keys shown fit its width, both hands of a chord (the Chord player). */
  fitInView?: boolean
  /**
   * The page's own height for them (the Chord player's Keys panel, R76): they stand that tall and show
   * whatever another page's Piano folded, the page hiding them itself.
   */
  sized?: number
  /** Where it sits in its page's layout (a laptop's full-width row). */
  className?: string
  /** What the page draws over the keys: Edit layout's outline and tag. */
  children?: ReactNode
}) {
  // At the screen's foot, where the hands play (the boards' one piano); under the bar where the keys
  // are the page's stage.
  const dock = place ?? 'bottom'
  const { folded } = useFoldKeys(screen)
  const laptop = useMediaQuery(LAPTOP)
  const { keys, marks } = shown
  const [opened] = useState(keys)
  // Its octaves: the middle two, grown to every key it has shown (a chord found from A3), never
  // shrunk, so no lit key falls off its edge and the keys never jump back.
  const wanted = keyboardRange([...opened, ...keys], MIDDLE_OCTAVES)
  const [widest, setWidest] = useState(wanted)
  if (wanted.from < widest.from || wanted.to > widest.to)
    setWidest({
      from: wanted.from < widest.from ? wanted.from : widest.from,
      to: wanted.to > widest.to ? wanted.to : widest.to,
    })
  const showing = selected ? keys.filter((key) => !selected.has(key)) : keys
  // Hidden from the Piano sheet, nothing stands where the keys stood.
  if (folded && sized === undefined) return null
  const body = (
    <LiveKeyboard
      range={range ?? widest}
      inView={rangeOf(showing) ?? rangeOf(opened)}
      marks={marks}
      outlined={outlined}
      selected={selected}
      wrong={wrong}
      keyPlays={keyPlays}
      onKeyPress={onKeyPress}
      spotlight
      fitInView={fitInView}
      height={sized ?? (laptop ? LAPTOP_KEYS_PX : PHONE_KEYS_PX)}
    />
  )
  // Edge to edge (R34): the dock's gutters and foot are the keys' own.
  if (dock === 'bottom')
    return (
      <Docked bleed className="vt-keys">
        {body}
        {children}
      </Docked>
    )
  return (
    // 8 under the bar, as every Practice board draws the keys (a page's own 16 gap less 8).
    <Pinned bleed className={cn('vt-keys -mt-2', className)}>
      {body}
      {children}
    </Pinned>
  )
}
