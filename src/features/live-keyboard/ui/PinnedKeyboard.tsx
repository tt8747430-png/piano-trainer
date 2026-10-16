import { ChevronDown, ChevronUp, Piano } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { selectKeyboard, useSettings, useSettingsStoreApi } from '@/entities/settings'
import { setKeyboard } from '@/features/set-preference'
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
import { Button } from '@/shared/ui/primitives/button'
import { LiveKeyboard } from './LiveKeyboard'

/**
 * A page's keyboard, pinned while the page scrolls (an explorer's, a tool's, a lesson's): `range` fills its width (by default the
 * middle octaves grown to hold the keys it opened on and the keys the app shows), and it keeps the
 * keys the app shows in view. A key a hand chooses (`selected`) never moves it: the keys hold still
 * under the finger (ADR 0009). It stays where the keyboard settings dock it, at the screen's foot over
 * the tab bar or at its top under the screen's bar; folded from its rail, it is a button that brings
 * it back, and stays folded on every page until then.
 */
export function PinnedKeyboard({
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
  /** Keys ringed inside: the chords that hold the note, an answer's missing notes. */
  outlined?: ReadonlySet<Midi> | undefined
  /** A lesson question's chosen keys: the keys become toggles. */
  selected?: ReadonlySet<Midi> | undefined
  /** An answer's extra keys. */
  wrong?: ReadonlySet<Midi> | undefined
  /** What a key means besides its sound (Notes view: the note). */
  onKeyPress?: ((key: Midi) => void) | undefined
  /** Where it sits in its page's layout (a laptop's full-width row). */
  className?: string
}) {
  const { t } = useTranslation('common')
  const store = useSettingsStoreApi()
  const { dock, folded } = useSettings(selectKeyboard)
  const { keys, marks } = shown
  const [opened] = useState(keys)
  const showing = selected ? keys.filter((key) => !selected.has(key)) : keys
  const fold = (on: boolean) => setKeyboard(store, { folded: on })
  const unfold = (
    <Button variant="soft" size="pill" onClick={() => fold(false)}>
      <Piano aria-hidden />
      {t('rail.unfold')}
    </Button>
  )
  // Folded at the foot, the keys are a floating button beside the screen's actions; at the top, a
  // button where they were.
  if (folded)
    return dock === 'bottom' ? (
      <FloatingActions first>
        <FabPill label={t('rail.unfold')} icon={Piano} onClick={() => fold(false)} />
      </FloatingActions>
    ) : (
      <div className={cn('flex justify-end pt-2', className)}>{unfold}</div>
    )
  const body = (
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
  if (dock === 'bottom') return <Docked>{body}</Docked>
  // The rail's strip is as tall as its buttons' targets and draws only its lower part: the rest is
  // already the gap over the keys, so the keyboard sits that much nearer what is above it.
  return <Pinned className={cn('-mt-2', className)}>{body}</Pinned>
}
