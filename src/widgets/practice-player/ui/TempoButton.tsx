import { Gauge } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { PracticeMode } from '@/features/practice'
import { TEMPO_RANGE } from '@/shared/lib/schedule'
import { Listbox } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/primitives/popover'
import { Slider, SliderLabel } from '@/shared/ui/primitives/slider'
import { Switch } from '@/shared/ui/primitives/switch'
import { percentOf, SPEEDS, speedTempo } from '../model/speeds'

/**
 * The tempo button and its popover (spec §2.7): Wait mode, or a speed of the piece's tempo, or any
 * tempo; speed training below the piece's tempo. The button says the pass's tempo while it plays.
 */
export function TempoButton({
  mode,
  tempo,
  shownTempo,
  ownTempo,
  speedTraining,
  onWait,
  onTempo,
  onSpeedTraining,
}: {
  mode: PracticeMode
  tempo: number
  shownTempo: number
  ownTempo: number
  speedTraining: boolean
  /** Wait mode chosen. */
  onWait: () => void
  /** Listen at this tempo. */
  onTempo: (tempo: number) => void
  onSpeedTraining: (on: boolean) => void
}) {
  const { t } = useTranslation('player')
  const [open, setOpen] = useState(false)
  const value =
    mode === 'wait'
      ? t('pace.waitShort')
      : t('pace.percent', { percent: percentOf(shownTempo, ownTempo) })
  const choose = (act: () => void) => {
    act()
    setOpen(false)
  }
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger render={<Button variant="soft" aria-label={t('pace.of', { value })} />}>
        <Gauge data-icon="inline-start" />
        <span className="tabular-nums">{value}</span>
      </PopoverTrigger>
      <PopoverContent aria-label={t('tempo')} align="start" className="w-80 gap-4 p-4">
        <Listbox
          label={t('tempo')}
          className="gap-4"
          optionClassName="min-h-11 rounded-lg px-2 text-base"
          groups={[
            {
              label: t('pace.ownPace'),
              options: [
                {
                  key: 'wait',
                  selected: mode === 'wait',
                  content: t('pace.wait'),
                  onChoose: () => choose(onWait),
                },
              ],
            },
            {
              label: t('pace.playAlong'),
              options: SPEEDS.map((share) => {
                const speed = speedTempo(ownTempo, share)
                return {
                  key: String(share),
                  selected: mode === 'listen' && tempo === speed,
                  content: share === 1 ? t('pace.own') : t('pace.speed', { percent: share * 100 }),
                  onChoose: () => choose(() => onTempo(speed)),
                }
              }),
            },
          ]}
        />
        <Slider
          min={TEMPO_RANGE.min}
          max={TEMPO_RANGE.max}
          step={1}
          value={tempo}
          onValueChange={onTempo}
          className="flex flex-col gap-3"
        >
          <div className="flex justify-between">
            <SliderLabel>{t('tempo')}</SliderLabel>
            <span className="font-semibold tabular-nums">{t('bpm', { tempo })}</span>
          </div>
        </Slider>
        {mode === 'listen' && tempo < ownTempo ? (
          <label className="flex min-h-11 items-center justify-between gap-3">
            <span className="flex flex-col">
              <span>{t('pace.speedTraining')}</span>
              <span className="text-sm text-muted-foreground">{t('pace.speedTrainingDetail')}</span>
            </span>
            <Switch checked={speedTraining} onCheckedChange={onSpeedTraining} />
          </label>
        ) : null}
      </PopoverContent>
    </Popover>
  )
}
