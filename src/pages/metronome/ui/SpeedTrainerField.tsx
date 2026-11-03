import { useTranslation } from 'react-i18next'
import type { MetronomeSettings } from '@/entities/settings'
import { BPM_RANGE } from '@/shared/lib/schedule'
import { Stepper, SwitchRow } from '@/shared/ui'

type Speed = MetronomeSettings['speed']

/**
 * The speed trainer (A39, Pro Metronome's): its switch, then, while it is on, the tempo it starts at
 * and the one it moves toward, by how much and how often, each a stepper; the tempo heard now under
 * them while it runs. Off, its steppers are not drawn (R30).
 */
export function SpeedTrainerField({
  speed,
  tempoNow,
  playing,
  onChange,
}: {
  speed: Speed
  tempoNow: number
  playing: boolean
  onChange: (change: Partial<Speed>) => void
}) {
  const { t } = useTranslation('practice')
  const bpm = (value: number) => `${value} BPM`
  return (
    <div className="flex w-full flex-col gap-2">
      <SwitchRow
        label={t('metronome.speed.label')}
        info={t('metronome.speed.info')}
        checked={speed.on}
        onCheckedChange={(on) => onChange({ on })}
        className="min-h-11 border-b-0 py-0"
      />
      {speed.on ? (
        <div className="grid w-full grid-cols-2 gap-x-3 gap-y-2 narrow-phone:gap-x-2">
          {(
            [
              ['from', BPM_RANGE.min, BPM_RANGE.max, bpm],
              ['to', BPM_RANGE.min, BPM_RANGE.max, bpm],
              ['step', 1, 20, bpm],
              ['every', 1, 16, (count: number) => t('metronome.speed.bars', { count })],
            ] as const
          ).map(([key, min, max, format]) => (
            <label key={key} className="flex flex-col gap-1 text-sm text-muted-foreground">
              {t(`metronome.speed.${key}`)}
              <Stepper
                label={t(`metronome.speed.${key}`)}
                value={speed[key]}
                min={min}
                max={max}
                format={format}
                onChange={(value) => onChange({ [key]: value })}
                decrease={`${t(`metronome.speed.${key}`)} −`}
                increase={`${t(`metronome.speed.${key}`)} +`}
              />
            </label>
          ))}
          {playing ? (
            <p role="status" className="col-span-2 text-center text-sm font-semibold tabular-nums">
              {t('metronome.speed.now', { bpm: tempoNow })}
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
