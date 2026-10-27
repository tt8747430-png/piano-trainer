import { Gauge } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { PracticeMode } from '@/features/practice'
import { formatPercent, useLocale } from '@/shared/i18n'
import { Listbox, SwitchRow } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/primitives/popover'
import { Slider, SliderLabel } from '@/shared/ui/primitives/slider'
import { useDockSide } from '../model/dock-side'
import { percentOf, SPEED_RANGE, SPEEDS, speedStep, speedTempo } from '../model/speeds'

/** A speed as a screen reader says it: its percent, as the language writes one. */
const PERCENT = { style: 'unit', unit: 'percent' } as const

/**
 * The transport's round look: a pill along the bar, a little smaller under 360px and on a phone on
 * its side, so the transport fits with the gauge beside the value at every size (ADR 0114).
 */
const TRIGGER =
  'h-12 rounded-full px-3 small-phone:h-11 small-phone:px-2 narrow-phone:gap-1 narrow-phone:px-1 landscape-phone:h-10'

/**
 * The tempo button and its popover: Wait mode, or a speed of the piece's tempo, its
 * presets or any 5% step from 50% to 200% on the slider (ADR 0105, Chordify's), which says the beats
 * a minute it plays at; speed training below the piece's tempo. The button says the pass's tempo
 * while it plays.
 * Without `onWait` and `onSpeedTraining` it only sets how fast the music plays back: the score
 * editor's, which checks what was written at the learner's speed (ADR 0114).
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
        {/* The gauge beside the value at every size (ADR 0114): the pill is sized to fit it. */}
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
          min={SPEED_RANGE.min}
          max={SPEED_RANGE.max}
          step={SPEED_RANGE.step}
          value={speedStep(tempo, ownTempo)}
          onValueChange={(percent) => onTempo(speedTempo(ownTempo, percent / 100))}
          format={PERCENT}
          locale={locale}
          // Room under the track for the thumb's 44px reach, which the popover's edge would cut.
          className="flex flex-col gap-3 pb-2.5"
        >
          <div className="flex justify-between gap-3">
            <SliderLabel>{t('pace.speedLabel')}</SliderLabel>
            <span className="font-semibold tabular-nums">
              {`${formatPercent(locale, percentOf(tempo, ownTempo))} · ${t('music:bpm', { tempo })}`}
            </span>
          </div>
        </Slider>
        {onSpeedTraining && mode === 'listen' && tempo < ownTempo ? (
          <SwitchRow
            label={t('pace.speedTraining')}
            info={t('pace.speedTrainingDetail')}
            checked={speedTraining}
            onCheckedChange={onSpeedTraining}
            className="min-h-11 border-b-0 py-0 text-base"
          />
        ) : null}
      </PopoverContent>
    </Popover>
  )
}
