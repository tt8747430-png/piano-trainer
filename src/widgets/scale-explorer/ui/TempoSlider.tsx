import { useTranslation } from 'react-i18next'
import { TEMPO_RANGE } from '@/shared/lib/schedule'
import { Slider, SliderLabel } from '@/shared/ui/primitives/slider'

/** The practice tempo in BPM, on a slider named by its label. */
export function TempoSlider({
  tempo,
  onChange,
}: {
  tempo: number
  onChange: (tempo: number) => void
}) {
  const { t } = useTranslation('learn')
  return (
    <Slider
      min={TEMPO_RANGE.min}
      max={TEMPO_RANGE.max}
      step={4}
      value={tempo}
      onValueChange={onChange}
      className="flex flex-col gap-3"
    >
      <div className="flex justify-between">
        <SliderLabel>{t('tempo')}</SliderLabel>
        <span className="font-semibold tabular-nums">{t('bpm', { tempo })}</span>
      </div>
    </Slider>
  )
}
