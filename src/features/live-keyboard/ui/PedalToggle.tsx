import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { usePedal, useServices } from '@/shared/lib/services'
import { RailButton } from '@/shared/ui'
import { PedalIcon } from '@/shared/ui/icons/PedalIcon'

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
  useEffect(() => {
    const lift = () => {
      if (held.current) audio.pedal('sustain', false)
      held.current = false
    }
    // Let up on leaving (R29 A26): a page hidden keeps no sustain it cannot lift.
    const onHide = () => {
      if (document.visibilityState === 'hidden') lift()
    }
    document.addEventListener('visibilitychange', onHide)
    return () => {
      document.removeEventListener('visibilitychange', onHide)
      lift()
    }
  }, [audio])
  return (
    <RailButton
      label={t('rail.pedal')}
      name={t('rail.named.sustain')}
      aria-pressed={down}
      onClick={() => {
        held.current = !held.current
        audio.pedal('sustain', held.current)
      }}
    >
      <PedalIcon aria-hidden className="size-5" />
    </RailButton>
  )
}
