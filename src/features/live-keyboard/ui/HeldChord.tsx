import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { selectKeyboard, useSettings } from '@/entities/settings'
import { useHeldKeys } from '@/features/connect-midi'
import { nameChords, printedSymbol } from '@/shared/lib/music'
import { useSoundingKeys } from '@/shared/lib/services'

/**
 * The chord a hand holds, in the screen's bar (R34, where the rail's caption was): the live voice's
 * keys and a MIDI keyboard's, held or on under the pedal, three notes or more, named as the sheets
 * print a chord (`C♯m`); never what the app sounds. Shown from 40rem wide, where the bar has room;
 * nothing while no chord is held, or with Chord symbol off.
 */
export function HeldChord() {
  const { t } = useTranslation('common')
  const chordNames = useSettings((state) => selectKeyboard(state).chordNames)
  const live = useSoundingKeys('live')
  const held = useHeldKeys()
  const chord = useMemo(
    () => (chordNames ? printedSymbol(nameChords([...live, ...held])[0]?.symbol ?? '') : ''),
    [chordNames, live, held],
  )
  if (chord === '') return null
  return (
    <p
      data-slot="held-chord"
      className="flex h-11 min-w-0 shrink items-center gap-1.5 truncate px-2 font-display text-xl font-semibold max-sm:hidden"
    >
      <span className="font-sans text-xs font-medium text-muted-foreground">
        {t('keyboardTools.chord')}
        <span className="sr-only">: </span>
      </span>
      {chord}
    </p>
  )
}
