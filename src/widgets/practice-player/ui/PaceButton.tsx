import { Hourglass, Waves, type LucideIcon } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { selectPlayback, useSettings } from '@/entities/settings'
import { OWN_PACE_MODES, type OwnPaceMode, type PracticeMode } from '@/features/practice'
import { unitNote } from '@/shared/lib/music'
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
 * its side, so the transport fits at every size (ADR 0114).
 */
const TRIGGER =
  'h-12 min-w-12 rounded-pill px-3 small-phone:h-11 small-phone:min-w-11 small-phone:px-2 narrow-phone:gap-1 narrow-phone:px-1 landscape-phone:h-10 landscape-phone:min-w-10'

/** The picture of each mode at the learner's own pace, which the button wears while it plays. */
const OWN_PACE_ICON: Readonly<Record<OwnPaceMode, LucideIcon>> = {
  wait: Hourglass,
  follow: Waves,
}

/**
 * The transport's Pace (R36, flowkey's Tempo menu): at the learner's own pace, Wait mode or Interpret,
 * each with a line of what it does; or Listen and play along, at a speed of the piece's tempo, its
 * presets or any 5% step from 50% to 200% on the slider (ADR 0105), which says the beats a minute it
 * plays at, with speed training below the piece's tempo. The button says the tempo as a metronome
 * mark in Listen (the pass's while speed training climbs), else the mode: its picture, and its name
 * where the transport has room.
 */
export function PaceButton({
  mode,
  tempo,
  shownTempo = tempo,
  ownTempo,
  speedTraining,
  piano,
  handsAtKeys = false,
  onMode,
  onListen,
  onSpeedTraining,
  click,
}: {
  mode: PracticeMode
  tempo: number
  shownTempo?: number
  ownTempo: number
  speedTraining: boolean
  /** Whether a piano is there to play: a MIDI keyboard connected, or the keys on screen. */
  piano: boolean
  /** The hands stand in the keys' place: the keys on screen are theirs, not to be played. */
  handsAtKeys?: boolean
  /** Play at the learner's own pace. */
  onMode: (mode: OwnPaceMode) => void
  /** Listen and play along at this tempo. */
  onListen: (tempo: number) => void
  onSpeedTraining: (on: boolean) => void
  /** The metronome's click with the music (B7, A35), a switch at the foot of the menu. */
  click: { readonly on: boolean; readonly onChange: (on: boolean) => void }
}) {
  const { t } = useTranslation(['player', 'music'])
  const locale = useLocale()
  const { speedStep: trainingStep } = useSettings(selectPlayback)
  const [open, setOpen] = useState(false)
  const side = useDockSide()
  const listening = mode === 'listen'
  const value = listening
    ? formatPercent(locale, percentOf(shownTempo, ownTempo))
    : t(`modes.${mode}.name`)
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
            aria-label={
              listening ? t('pace.ofTempo', { value, tempo: shownTempo }) : t('pace.of', { value })
            }
            title={t('pace.title')}
            className={TRIGGER}
          />
        }
      >
        {mode === 'listen' ? (
          // The tempo as a metronome mark (R32: MuseScore's BPM, Songscription's ♩ = 87), the share
          // of the piece's tempo in its name and its popover.
          <span aria-hidden className="flex items-baseline gap-1 tabular-nums">
            <span className="font-music text-lg leading-none">{unitNote('4')}</span>
            {`= ${shownTempo}`}
          </span>
        ) : (
          <OwnPace mode={mode} name={value} />
        )}
      </PopoverTrigger>
      {/* Tighter on a phone on its side, so all of it fits above the home indicator. */}
      <PopoverContent
        aria-label={t('pace.title')}
        side={side}
        align="start"
        className="max-h-(--available-height) w-80 gap-4 overflow-y-auto overscroll-contain p-4 landscape-phone:gap-2 landscape-phone:p-3"
      >
        <Listbox
          label={t('pace.title')}
          className="gap-4 landscape-phone:gap-2"
          optionClassName="min-h-11 rounded-control px-2 text-base"
          groups={[
            {
              label: t('pace.ownPace'),
              options: OWN_PACE_MODES.map((each) => ({
                key: each,
                selected: mode === each,
                content: (
                  <span className="flex min-w-0 flex-col py-1.5 landscape-phone:py-0.5">
                    <span>{t(`modes.${each}.name`)}</span>
                    <span className="text-sm break-words text-muted-foreground">
                      {piano
                        ? t(`modes.${each}.line`)
                        : t(handsAtKeys ? 'pace.needsKeysNotHands' : 'pace.needsPiano')}
                    </span>
                  </span>
                ),
                onChoose: () => choose(() => onMode(each)),
              })),
            },
            {
              label: t('pace.playAlong'),
              options: SPEEDS.map((share) => {
                const speed = speedTempo(ownTempo, share)
                return {
                  key: String(share),
                  selected: listening && tempo === speed,
                  content:
                    share === 1
                      ? t('pace.own')
                      : t('pace.speed', { percent: formatPercent(locale, share * 100) }),
                  onChoose: () => choose(() => onListen(speed)),
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
          onValueChange={(percent) => onListen(speedTempo(ownTempo, percent / 100))}
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
        {listening && tempo < ownTempo ? (
          <SwitchRow
            label={t('pace.speedTraining')}
            info={t('pace.speedTrainingDetail', { percent: formatPercent(locale, trainingStep) })}
            checked={speedTraining}
            onCheckedChange={onSpeedTraining}
            className="min-h-11 border-b-0 py-0 text-base"
          />
        ) : null}
        <SwitchRow
          label={t('sound.click')}
          info={t('sound.clickInfo')}
          checked={click.on}
          onCheckedChange={click.onChange}
          className="min-h-11 border-b-0 py-0 text-base"
        />
      </PopoverContent>
    </Popover>
  )
}

/** A mode at the learner's own pace on the button: its picture; its name too from 640px. */
function OwnPace({ mode, name }: { mode: OwnPaceMode; name: string }) {
  const Icon = OWN_PACE_ICON[mode]
  return (
    <span aria-hidden className="flex items-center gap-2">
      <Icon className="size-5" />
      <span className="text-sm font-semibold max-sm:hidden">{name}</span>
    </span>
  )
}
