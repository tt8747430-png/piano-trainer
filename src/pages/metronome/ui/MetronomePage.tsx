import {
  Hand,
  Metronome as MetronomeIcon,
  Play,
  Square,
  Volume2,
  type LucideIcon,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useShortcuts } from '@/shared/lib/shortcuts'
import {
  BPM_RANGE,
  beatsOf,
  METRONOME_METERS,
  METRONOME_SOUNDS,
  type MetronomeMeter,
  type MetronomeSound,
} from '@/shared/lib/schedule'
import { BackButton, Dropdown, InfoTip, ScreenHeader } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { Slider, SliderLabel } from '@/shared/ui/primitives/slider'
import { useMetronome } from '../model/use-metronome'
import { BeatSquares } from './BeatSquares'
import { TempoSteps } from './TempoSteps'

/** The two pop-up buttons, round as the steps; on the narrowest phones a size down, so their words fit. */
const POP_UP = 'rounded-full narrow-phone:gap-1 narrow-phone:px-2.5 narrow-phone:text-sm'

/** A pop-up button's face here: its picture, then the value. */
const face = (Icon: LucideIcon, value: string) => (
  <span className="flex items-center justify-center gap-2 narrow-phone:gap-1.5">
    <Icon aria-hidden className="size-5 shrink-0 text-muted-foreground narrow-phone:size-4" />
    <span className="truncate">{value}</span>
  </span>
)

/**
 * The Metronome (ADR 0113), a page of Practice: the tempo large between its steps, the slider and
 * Tap tempo under it; the sound and the time signature side by side; one round Play in the middle;
 * the beat shown as a row of squares. Space starts and stops it, ↑ ↓ change the tempo by 1, with
 * Shift by 10. What it does is its bar's ⓘ.
 */
export function MetronomePage() {
  const { t } = useTranslation(['practice', 'common'])
  const metronome = useMetronome()
  const name = t('practice:pages.metronome')
  const toggleName = metronome.playing
    ? t('practice:metronome.stop')
    : t('practice:metronome.start')
  useShortcuts(name, [
    { label: toggleName, combo: { key: ' ' }, run: metronome.toggle },
    {
      label: t('practice:metronome.faster', { step: 1 }),
      combo: { key: 'ArrowUp' },
      repeat: true,
      run: () => metronome.nudge(1),
    },
    {
      label: t('practice:metronome.slower', { step: 1 }),
      combo: { key: 'ArrowDown' },
      repeat: true,
      run: () => metronome.nudge(-1),
    },
    {
      label: t('practice:metronome.faster', { step: 10 }),
      combo: { key: 'ArrowUp', shift: true },
      repeat: true,
      run: () => metronome.nudge(10),
    },
    {
      label: t('practice:metronome.slower', { step: 10 }),
      combo: { key: 'ArrowDown', shift: true },
      repeat: true,
      run: () => metronome.nudge(-10),
    },
  ])
  return (
    <div className="flex min-h-screen-free flex-col">
      <ScreenHeader
        title={name}
        back={<BackButton fallback={{ to: '/practice' }} />}
        actions={
          <InfoTip name={name} className="size-11 [&_svg]:size-5">
            {t('practice:metronome.info')}
          </InfoTip>
        }
      />
      <div className="mx-auto grid w-full max-w-md flex-1 content-center items-center justify-items-center gap-8 pb-4 narrow-phone:gap-5 sm:max-w-lg sm:gap-10 landscape-phone:max-w-3xl landscape-phone:grid-cols-2 landscape-phone:gap-x-10 landscape-phone:gap-y-5">
        <div className="flex w-full flex-col items-center gap-5 narrow-phone:gap-4 landscape-phone:gap-4">
          <TempoSteps bpm={metronome.bpm} onStep={metronome.nudge} />
          <div className="flex w-full flex-wrap items-center justify-center gap-3">
            <Slider
              value={metronome.bpm}
              min={BPM_RANGE.min}
              max={BPM_RANGE.max}
              onValueChange={(bpm) => metronome.setBpm(bpm)}
              className="min-w-24 flex-1"
            >
              <SliderLabel className="sr-only">{t('practice:metronome.slider')}</SliderLabel>
            </Slider>
            <Button variant="soft" onClick={metronome.tap} className="shrink-0 rounded-full">
              <Hand aria-hidden />
              {t('practice:metronome.tap')}
            </Button>
          </div>
          <div className="grid w-full grid-cols-2 gap-3 narrow-phone:gap-2">
            <Dropdown<MetronomeSound>
              label={t('practice:metronome.sound')}
              value={metronome.sound}
              onChange={metronome.setSound}
              options={METRONOME_SOUNDS.map((sound) => ({
                value: sound,
                label: t(`practice:metronome.sounds.${sound}`),
              }))}
              bare
              face={(sound) => face(Volume2, t(`practice:metronome.sounds.${sound}`))}
              className={POP_UP}
            />
            <Dropdown<MetronomeMeter>
              label={t('practice:metronome.meter')}
              value={metronome.meter}
              onChange={metronome.setMeter}
              options={METRONOME_METERS.map((meter) => ({ value: meter, label: meter }))}
              bare
              face={(meter) => face(MetronomeIcon, meter)}
              className={POP_UP}
            />
          </div>
        </div>
        <div className="flex w-full flex-col items-center gap-8 narrow-phone:gap-5 landscape-phone:gap-6">
          <Button
            aria-label={toggleName}
            title={toggleName}
            onClick={metronome.toggle}
            className="size-24 rounded-full narrow-phone:size-20 sm:size-28 landscape-phone:size-20"
          >
            {metronome.playing ? (
              <Square aria-hidden className="size-9 fill-current" />
            ) : (
              <Play aria-hidden className="size-10 translate-x-0.5 fill-current" />
            )}
          </Button>
          <BeatSquares beats={beatsOf(metronome.meter)} sounding={metronome.beat} />
        </div>
      </div>
    </div>
  )
}
