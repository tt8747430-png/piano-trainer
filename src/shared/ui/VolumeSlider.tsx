import { formatPercent, useLocale } from '@/shared/i18n'
import { Slider, SliderLabel } from './primitives/slider'

/** A volume as a screen reader says it: its percent, as the language writes one. */
const PERCENT = { style: 'unit', unit: 'percent' } as const
/** A volume's steps on its slider, and with the arrow keys. */
const VOLUME_STEP = 5

/**
 * One volume, 0 to 100 %: its name and percent over its slider, changed as it moves. `setting` is the
 * preference it sets, for Settings' search to find it.
 */
export function VolumeSlider({
  label,
  setting,
  value,
  onChange,
}: {
  label: string
  setting: string
  value: number
  onChange: (percent: number) => void
}) {
  const locale = useLocale()
  return (
    <div data-setting={setting}>
      <Slider
        min={0}
        max={100}
        step={VOLUME_STEP}
        value={value}
        onValueChange={onChange}
        format={PERCENT}
        locale={locale}
        className="flex flex-col gap-2 pb-2.5"
      >
        <div className="flex justify-between gap-3 text-base">
          <SliderLabel>{label}</SliderLabel>
          <span className="text-muted-foreground tabular-nums">{formatPercent(locale, value)}</span>
        </div>
      </Slider>
    </div>
  )
}
