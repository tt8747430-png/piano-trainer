import { ChevronDown, ChevronUp, Piano } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { selectKeyboard, useSettings } from '@/entities/settings'
import {
  keyboardRange,
  MIDDLE_OCTAVES,
  rangeOf,
  type KeyRange,
  type Midi,
} from '@/shared/lib/music'
import { cn } from '@/shared/lib'
import {
  Docked,
  FabPill,
  FloatingActions,
  Pinned,
  RailButton,
  RailGroup,
  type ShownKeys,
} from '@/shared/ui'
import { useFoldKeys, type KeysScreen } from '../model/use-fold-keys'
import { LiveKeyboard } from './LiveKeyboard'

/**
 * A page's keyboard, pinned while the page scrolls (an explorer's, a tool's, a lesson's): `range` fills its width (by default the
 * middle octaves grown to hold the keys it opened on, so the keys never change size as a page shows
 * other keys), and it scrolls the keys the app shows into view, no further than that. A key a hand chooses (`selected`) never moves it: the keys hold still
 * under the finger (ADR 0062). It stays where the keyboard settings dock it, at the screen's foot over
 * the tab bar or at its top under the screen's bar; folded from its rail, it is a button floating
 * where it was (lowest among the screen's actions at the foot, under the screen's bar at the top)
 * that brings it back, and stays folded on every page until then. Folding and unfolding morph the
 * keys into the button and back. On a phone on its side a reading page opens with them folded, until
 * the learner unfolds them there (ADR 0062); a screen played on (`screen="playing"`) keeps them out.
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
  const { t } = useTranslation('common')
  const dock = useSettings((state) => selectKeyboard(state).dock)
  const { folded, fold } = useFoldKeys(screen)
  const { keys, marks } = shown
  const [opened] = useState(keys)
  const showing = selected ? keys.filter((key) => !selected.has(key)) : keys
  if (folded) {
    const unfold = (
      <FabPill
        label={t('rail.unfold')}
        icon={Piano}
        onClick={() => fold(false)}
        className="vt-keys"
      />
    )
    // Folded, the keys float where they were and take no room of the page's: at the foot, nearest it
    // of the screen's actions; at the top, under the screen's bar, moving with it (fixed, out of the
    // page's flow, where `--screen-bar` reaches it).
    return dock === 'bottom' ? (
      <FloatingActions last>{unfold}</FloatingActions>
    ) : (
      <div className="fixed top-screen-bar right-gutter z-20 pt-safe duration-200 ease-out print:hidden motion-safe:transition-[top]">
        {unfold}
      </div>
    )
  }
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
      railEnd={
        <RailGroup>
          <RailButton
            label={t('rail.fold')}
            icon={dock === 'bottom' ? ChevronDown : ChevronUp}
            onClick={() => fold(true)}
          />
        </RailGroup>
      }
    />
  )
  if (dock === 'bottom') return <Docked className="vt-keys">{body}</Docked>
  // The rail's strip is as tall as its buttons' targets and draws only its lower part: the rest is
  // already the gap over the keys, so the keyboard sits that much nearer what is above it.
  return <Pinned className={cn('vt-keys -mt-2', className)}>{body}</Pinned>
}
