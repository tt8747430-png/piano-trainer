import { useTranslation } from 'react-i18next'
import type { MetronomeSettings } from '@/entities/settings'
import { BPM_RANGE } from '@/shared/lib/schedule'
import { Stepper, SwitchRow } from '@/shared/ui'
import { MetronomeRow } from './MetronomeRow'

type Speed = MetronomeSettings['speed']

/**
 * The speed trainer (A39, Pro Metronome's), read as a sentence: Start at 80 BPM, Goal 120 BPM, Speed
 * up by 5 BPM, Every 4 bars, each a stepper; what it does behind its ⓘ; while it plays, the tempo
 * heard and the bar. Off, its rows are not drawn (R30).
 */
export function SpeedTrainerField({
  speed,
  tempoNow,
  bar,
  playing,
  onChange,
}: {
  speed: Speed
  tempoNow: number
  /** The bar playing, from 1. */
  bar: number | null
  playing: boolean
  onChange: (change: Partial<Speed>) => void
}) {
  const { t } = useTranslation('practice')
  const bpm = (value: number) => `${value} BPM`
  const rows = [
    ['from', BPM_RANGE.min, BPM_RANGE.max, bpm],
    ['to', BPM_RANGE.min, BPM_RANGE.max, bpm],
    ['step', 1, 20, bpm],
    ['every', 1, 16, (count: number) => t('metronome.speed.bars', { count })],
  ] as const
  return (
    <>
      <SwitchRow
        label={t('metronome.speed.label')}
        info={t('metronome.speed.info')}
        checked={speed.on}
        onCheckedChange={(on) => onChange({ on })}
        className="border-b-0"
      />
      {speed.on ? (
        <div className="flex flex-col border-t border-border pt-1">
          {rows.map(([key, min, max, format]) => (
            <MetronomeRow key={key} label={t(`metronome.speed.${key}`)}>
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
            </MetronomeRow>
          ))}
          {playing && bar !== null ? (
            <p role="status" className="pt-1 text-center text-sm font-semibold tabular-nums">
              {t('metronome.speed.now', { bpm: tempoNow, bar })}
            </p>
          ) : null}
        </div>
      ) : null}
    </>
  )
}
