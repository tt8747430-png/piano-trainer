import { useTranslation } from 'react-i18next'
import type { MetronomeSettings } from '@/entities/settings'
import { BPM_RANGE } from '@/shared/lib/schedule'
import { GroupRow, GroupRows, InfoTip, Stepper } from '@/shared/ui'
import { Switch } from '@/shared/ui/primitives/switch'

type Speed = MetronomeSettings['speed']

/**
 * The speed trainer's sheet (A39, Pro Metronome's; canvas 179's Speed trainer ›): one group, its
 * switch with what it does behind its ⓘ, then Start tempo, Target tempo, Increase by and Every, each
 * a stepper, set whether it is on or off.
 */
export function SpeedTrainerField({
  speed,
  onChange,
}: {
  speed: Speed
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
  const name = t('metronome.speed.label')
  return (
    <GroupRows label={name}>
      <GroupRow
        label={
          <span className="inline-flex items-center gap-1.5">
            {name}
            <InfoTip name={name}>{t('metronome.speed.info')}</InfoTip>
          </span>
        }
      >
        <Switch aria-label={name} checked={speed.on} onCheckedChange={(on) => onChange({ on })} />
      </GroupRow>
      {rows.map(([key, min, max, format]) => (
        <GroupRow key={key} label={t(`metronome.speed.${key}`)}>
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
        </GroupRow>
      ))}
    </GroupRows>
  )
}
