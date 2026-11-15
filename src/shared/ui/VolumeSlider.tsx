import { Volume1, Volume2 } from 'lucide-react'
import { formatPercent, useLocale } from '@/shared/i18n'
import { Slider, SliderLabel } from './primitives/slider'

/** A volume as a screen reader says it: its percent, as the language writes one. */
const PERCENT = { style: 'unit', unit: 'percent' } as const
/** A volume's steps on its slider, and with the arrow keys. */
const VOLUME_STEP = 5

/**
 * One volume, 0 to 100 %: its name and percent over its slider, changed as it moves; `speakers`, the
 * Parts sheet's row (loop round 24, the board's): a soft and a loud speaker either side of the slider,
 * the percent after, the name for a screen reader alone. `setting` is the preference it sets, for
 * Settings' search to find it.
 */
export function VolumeSlider({
  label,
  setting,
  value,
  onChange,
  speakers = false,
}: {
  label: string
  speakers?: boolean
  setting: string
  value: number
  onChange: (percent: number) => void
}) {
  const locale = useLocale()
  if (speakers)
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
          className="flex min-h-11 items-center gap-3"
        >
          <SliderLabel className="sr-only">{label}</SliderLabel>
          <Volume1 aria-hidden className="order-first size-4.5 shrink-0 text-muted-foreground" />
          <Volume2 aria-hidden className="order-1 size-4.5 shrink-0 text-muted-foreground" />
          <span className="order-2 w-10 shrink-0 text-end text-sm tabular-nums">
            {formatPercent(locale, value)}
          </span>
        </Slider>
      </div>
    )
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
