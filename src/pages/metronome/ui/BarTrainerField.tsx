import { useTranslation } from 'react-i18next'
import type { MetronomeSettings } from '@/entities/settings'
import { TRAINER_BARS, type TrainerBars } from '@/shared/lib/schedule'
import { GroupRow, GroupRows, InfoTip, Stepper } from '@/shared/ui'
import { Switch } from '@/shared/ui/primitives/switch'

type Trainer = MetronomeSettings['trainer']

const FEWEST = TRAINER_BARS[0]
const MOST = TRAINER_BARS[TRAINER_BARS.length - 1] ?? 8

/**
 * Silent bars' sheet (ADR 0052's bar trainer; canvas 179's Silent bars ›): one group, its switch with
 * what it is for behind its ⓘ, then Audible and Muted, each a stepper of bars.
 */
export function BarTrainerField({
  trainer,
  onChange,
}: {
  trainer: Trainer
  onChange: (change: Partial<Trainer>) => void
}) {
  const { t } = useTranslation('practice')
  const bars = (count: number) => t('metronome.bars', { count })
  const rows = [
    ['play', 'metronome.played'],
    ['mute', 'metronome.mutedBars'],
  ] as const
  const name = t('metronome.trainer')
  return (
    <GroupRows label={name}>
      <GroupRow
        label={
          <span className="inline-flex items-center gap-1.5">
            {name}
            <InfoTip name={name}>{t('metronome.trainerInfo')}</InfoTip>
          </span>
        }
      >
        <Switch aria-label={name} checked={trainer.on} onCheckedChange={(on) => onChange({ on })} />
      </GroupRow>
      {rows.map(([key, label]) => (
        <GroupRow key={key} label={t(label)}>
          <Stepper
            label={t(label)}
            value={trainer[key]}
            min={FEWEST}
            max={MOST}
            format={bars}
            onChange={(value) => onChange({ [key]: value as TrainerBars })}
            decrease={`${t(label)} −`}
            increase={`${t(label)} +`}
          />
        </GroupRow>
      ))}
    </GroupRows>
  )
}
