import { useTranslation } from 'react-i18next'
import type { MetronomeSettings } from '@/entities/settings'
import { TRAINER_BARS, type TrainerBars } from '@/shared/lib/schedule'
import { Stepper, SwitchRow } from '@/shared/ui'
import { MetronomeRow } from './MetronomeRow'

type Trainer = MetronomeSettings['trainer']

const FEWEST = TRAINER_BARS[0]
const MOST = TRAINER_BARS[TRAINER_BARS.length - 1] ?? 8

/**
 * Silent bars (ADR 0052's bar trainer), read as a sentence: Play 2 bars, Then silent for 2 bars, each
 * a stepper; what it is for behind its ⓘ. Off, its rows are not drawn (R30).
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
  return (
    <>
      <SwitchRow
        label={t('metronome.trainer')}
        info={t('metronome.trainerInfo')}
        checked={trainer.on}
        onCheckedChange={(on) => onChange({ on })}
        className="border-b-0"
      />
      {trainer.on ? (
        <div className="flex flex-col border-t border-border pt-1">
          {rows.map(([key, label]) => (
            <MetronomeRow key={key} label={t(label)}>
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
            </MetronomeRow>
          ))}
        </div>
      ) : null}
    </>
  )
}
