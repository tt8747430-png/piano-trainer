import { Volume2, VolumeX, type LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import type { MetronomeSettings } from '@/entities/settings'
import { TRAINER_BARS, type TrainerBars } from '@/shared/lib/schedule'
import { Dropdown, SwitchRow } from '@/shared/ui'

type Trainer = MetronomeSettings['trainer']

/**
 * The bar trainer (ADR 0052): its switch, what it does behind the ⓘ, and the bars played and muted
 * as two pop-up buttons, greyed while it is off so nothing moves when it is turned on.
 */
export function BarTrainerField({
  trainer,
  onChange,
  popUp,
  face,
}: {
  trainer: Trainer
  onChange: (change: Partial<Trainer>) => void
  /** The page's pop-up button class, so these match the sound's and the meter's. */
  popUp: string
  face: (Icon: LucideIcon, value: string) => ReactNode
}) {
  const { t } = useTranslation('practice')
  const bars = (count: TrainerBars) => t('metronome.bars', { count })
  const options = TRAINER_BARS.map((count) => ({ value: count, label: bars(count) }))
  return (
    <div className="flex w-full flex-col gap-2">
      <SwitchRow
        label={t('metronome.trainer')}
        info={t('metronome.trainerInfo')}
        checked={trainer.on}
        onCheckedChange={(on) => onChange({ on })}
        className="min-h-11 border-b-0 py-0"
      />
      <div className="grid w-full grid-cols-2 gap-3 narrow-phone:gap-2">
        <Dropdown<TrainerBars>
          label={t('metronome.played')}
          value={trainer.play}
          onChange={(play) => onChange({ play })}
          options={options}
          disabled={!trainer.on}
          bare
          face={(count) => face(Volume2, bars(count))}
          className={popUp}
        />
        <Dropdown<TrainerBars>
          label={t('metronome.mutedBars')}
          value={trainer.mute}
          onChange={(mute) => onChange({ mute })}
          options={options}
          disabled={!trainer.on}
          bare
          face={(count) => face(VolumeX, bars(count))}
          className={popUp}
        />
      </div>
    </div>
  )
}
