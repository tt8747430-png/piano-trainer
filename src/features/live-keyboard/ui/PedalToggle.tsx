import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { usePedal, useServices } from '@/shared/lib/services'
import { RailButton } from '@/shared/ui'

/** The pedal mark a score prints under the staff (𝆮, in the music font). */
export const PEDAL_MARK = '\u{1D1AE}'

/**
 * The rail's sustain pedal, for a touch screen or a mouse: a tap puts its own hold down or up, beside
 * the MIDI foot's and Space's (the pedal is down while any holds it); it shows the pedal down
 * whoever holds it. It wears the score's pedal mark. Held here, it comes up as the keyboard goes: no
 * screen without a keyboard keeps a sustain it cannot lift.
 */
export function PedalToggle() {
  const { t } = useTranslation('common')
  const { audio } = useServices()
  const down = usePedal()
  /** Whether this button holds the pedal down. */
  const held = useRef(false)
  useEffect(
    () => () => {
      if (held.current) audio.pedal('sustain', false)
      held.current = false
    },
    [audio],
  )
  return (
    <RailButton
      label={t('rail.pedal')}
      aria-pressed={down}
      onClick={() => {
        held.current = !held.current
        audio.pedal('sustain', held.current)
      }}
    >
      <span aria-hidden className="font-music text-3xl leading-none font-normal tracking-normal">
        {PEDAL_MARK}
      </span>
    </RailButton>
  )
}
