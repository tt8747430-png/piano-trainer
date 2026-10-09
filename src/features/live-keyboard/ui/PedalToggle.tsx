import { useTranslation } from 'react-i18next'
import { usePedal, useServices } from '@/shared/lib/services'
import { RailButton } from '@/shared/ui'

/** The pedal mark a score prints under the staff (𝆮, in the music font). */
const PEDAL_MARK = '\u{1D1AE}'

/**
 * The rail's sustain pedal, for a touch screen or a mouse: a tap puts it down or up; it shows the
 * MIDI pedal too. It wears the score's pedal mark.
 */
export function PedalToggle() {
  const { t } = useTranslation('common')
  const { audio } = useServices()
  const down = usePedal()
  return (
    <RailButton
      label={t('rail.pedal')}
      aria-pressed={down}
      onClick={() => audio.pedal('sustain', !down)}
    >
      <span aria-hidden className="font-music text-3xl leading-none font-normal tracking-normal">
        {PEDAL_MARK}
      </span>
    </RailButton>
  )
}
