import { Footprints } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { usePedal, useServices } from '@/shared/lib/services'
import { RailButton } from '@/shared/ui'

/** The rail's sustain pedal, for a touch screen or a mouse: a tap puts it down or up; it shows the MIDI pedal too. */
export function PedalToggle() {
  const { t } = useTranslation('common')
  const { audio } = useServices()
  const down = usePedal()
  return (
    <RailButton
      label={t('rail.pedal')}
      icon={Footprints}
      aria-pressed={down}
      onClick={() => audio.pedal('sustain', !down)}
    />
  )
}
