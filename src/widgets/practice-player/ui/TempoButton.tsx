import { Gauge } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { PracticeMode } from '@/features/practice'
import { formatPercent, useLocale } from '@/shared/i18n'
import { TEMPO_RANGE } from '@/shared/lib/schedule'
import { Listbox } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/primitives/popover'
import { Slider, SliderLabel } from '@/shared/ui/primitives/slider'
import { Switch } from '@/shared/ui/primitives/switch'
import { useDockSide } from '../model/dock-side'
import { percentOf, SPEEDS, speedTempo } from '../model/speeds'

/**
 * The transport's round look: a pill along the bar, a little smaller under 360px and on a phone on
 * its side, so the transport fits with the gauge beside the value at every size (ADR 0094).
 */
const TRIGGER = 'h-12 rounded-full px-3 narrow-phone:h-11 narrow-phone:px-2 landscape-phone:h-10'

/**
 * The tempo button and its popover (spec §2.7): Wait mode, or a speed of the piece's tempo, or any
 * tempo; speed training below the piece's tempo. The button says the pass's tempo while it plays.
 * Without `onWait` and `onSpeedTraining` it only sets how fast the music plays back: the score
 * editor's, which checks what was written at the learner's speed (ADR 0089).
 */
export function TempoButton({
  mode = 'listen',
  tempo,
  shownTempo = tempo,
  ownTempo,
  speedTraining = false,
  onWait,
  onTempo,
  onSpeedTraining,
  side: popupSide,
}: {
  /** Where its pop-up opens: the Player's dock's way (left of it on a phone on its side) unless said. */
  side?: 'top' | 'left'
  mode?: PracticeMode
  tempo: number
  shownTempo?: number
  ownTempo: number
  speedTraining?: boolean
  /** Wait mode chosen; without it, none is offered. */
  onWait?: () => void
  /** Listen at this tempo. */
  onTempo: (tempo: number) => void
  /** Speed training on or off; without it, none is offered. */
  onSpeedTraining?: (on: boolean) => void
}) {
  const { t } = useTranslation(['player', 'music'])
  const locale = useLocale()
  const [open, setOpen] = useState(false)
  const dockSide = useDockSide()
  const side = popupSide ?? dockSide
  const value =
    mode === 'wait' ? t('pace.waitShort') : formatPercent(locale, percentOf(shownTempo, ownTempo))
  const choose = (act: () => void) => {
    act()
    setOpen(false)
  }
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            variant="ghost"
            aria-label={t('pace.of', { value })}
            title={t('tempo')}
            className={TRIGGER}
          />
        }
      >
        {/* The gauge beside the value at every size (ADR 0094): the pill is sized to fit it. */}
        <Gauge data-icon="inline-start" />
        <span className="tabular-nums">{value}</span>
      </PopoverTrigger>
      <PopoverContent
        aria-label={t('tempo')}
        side={side}
        align="start"
        className="max-h-(--available-height) w-80 gap-4 overflow-y-auto overscroll-contain p-4"
      >
        <Listbox
          label={t('tempo')}
          className="gap-4"
          optionClassName="min-h-11 rounded-lg px-2 text-base"
          groups={[
            ...(onWait
              ? [
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
                ]
              : []),
            {
              // Without Wait mode it only sets how fast the music plays back: a plain Playback speed.
              label: t(onWait ? 'pace.playAlong' : 'pace.playback'),
              options: SPEEDS.map((share) => {
                const speed = speedTempo(ownTempo, share)
                return {
                  key: String(share),
                  selected: mode === 'listen' && tempo === speed,
                  content:
                    share === 1
                      ? t('pace.own')
                      : t('pace.speed', { percent: formatPercent(locale, share * 100) }),
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
          // Room under the track for the thumb's 44px reach, which the popover's edge would cut.
          className="flex flex-col gap-3 pb-2.5"
        >
          <div className="flex justify-between">
            <SliderLabel>{t('tempo')}</SliderLabel>
            <span className="font-semibold tabular-nums">{t('music:bpm', { tempo })}</span>
          </div>
        </Slider>
        {onSpeedTraining && mode === 'listen' && tempo < ownTempo ? (
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
