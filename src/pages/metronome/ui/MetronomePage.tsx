import { Hand, Play, Square } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useShortcuts } from '@/shared/lib/shortcuts'
import {
  BPM_RANGE,
  METRONOME_METERS,
  METRONOME_SOUNDS,
  SUBDIVISIONS,
  type MetronomeMeter,
  type MetronomeSound,
  type Subdivision,
} from '@/shared/lib/schedule'
import { BackButton, Dropdown, InfoTip, ScreenHeader, SettingsGroup } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { Slider, SliderLabel } from '@/shared/ui/primitives/slider'
import { useMetronome } from '../model/use-metronome'
import { BarTrainerField } from './BarTrainerField'
import { BeatSquares } from './BeatSquares'
import { MetronomeRow } from './MetronomeRow'
import { SpeedTrainerField } from './SpeedTrainerField'
import { TempoSteps } from './TempoSteps'
import { TempoWordTip } from './TempoWordTip'

/**
 * The Metronome (ADR 0052), a page of Practice, its face as a metronome's (Chordify's order): the
 * tempo large between its steps, the slider and Tap tempo, the bar's beats as squares to tap, one
 * round Play. Under it (beside it on a laptop) its sound as labelled rows, and the two trainers, each
 * a switch whose rows read as a sentence. Space starts and stops it, ↑ ↓ change the tempo by 1, with
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
        back={<BackButton />}
        actions={
          <InfoTip name={name} bar>
            {t('practice:metronome.info')}
          </InfoTip>
        }
      />
      <div className="mx-auto grid w-full max-w-md gap-8 pb-8 narrow-phone:gap-6 sm:max-w-lg landscape-phone:max-w-3xl landscape-phone:grid-cols-2 landscape-phone:gap-x-10 lg:max-w-4xl lg:grid-cols-2 lg:gap-x-12">
        {/* What plays: the tempo, the bar's beats and Play, as a metronome's face. */}
        <div className="flex w-full flex-col items-center gap-6 narrow-phone:gap-4 lg:sticky lg:top-6 lg:self-start">
          <div className="flex flex-col items-center gap-2">
            <TempoSteps bpm={metronome.tempoNow} onStep={metronome.nudge} />
            <TempoWordTip bpm={metronome.tempoNow} />
          </div>
          <div className="flex w-full items-center gap-3">
            <Slider
              value={metronome.tempoNow}
              min={BPM_RANGE.min}
              max={BPM_RANGE.max}
              onValueChange={(bpm) => metronome.setBpm(bpm)}
              className="min-w-24 flex-1"
            >
              <SliderLabel className="sr-only">{t('practice:metronome.slider')}</SliderLabel>
            </Slider>
            <Button variant="soft" onClick={metronome.tap} className="shrink-0 rounded-pill">
              <Hand aria-hidden />
              {t('practice:metronome.tap')}
            </Button>
          </div>
          <BeatSquares
            levels={metronome.beatLevels}
            sounding={metronome.beat}
            muted={metronome.muted}
            onTap={metronome.tapBeat}
          />
          <Button
            aria-label={toggleName}
            title={toggleName}
            onClick={metronome.toggle}
            className="size-24 rounded-pill narrow-phone:size-20 sm:size-28 landscape-phone:size-20"
          >
            {metronome.playing ? (
              <Square aria-hidden className="size-9 fill-current" />
            ) : (
              <Play aria-hidden className="size-10 translate-x-0.5 fill-current" />
            )}
          </Button>
        </div>
        {/* How it sounds, then the two ways to practise with it: each a row that reads as a sentence. */}
        <div className="flex w-full flex-col gap-6">
          <SettingsGroup>
            <MetronomeRow label={t('practice:metronome.sound')}>
              <Dropdown<MetronomeSound>
                label={t('practice:metronome.sound')}
                value={metronome.sound}
                onChange={metronome.setSound}
                options={METRONOME_SOUNDS.map((sound) => ({
                  value: sound,
                  label: t(`practice:metronome.sounds.${sound}`),
                }))}
                bare
                align="end"
              />
            </MetronomeRow>
            <MetronomeRow label={t('practice:metronome.meter')}>
              <Dropdown<MetronomeMeter>
                label={t('practice:metronome.meter')}
                value={metronome.meter}
                onChange={metronome.setMeter}
                options={METRONOME_METERS.map((meter) => ({ value: meter, label: meter }))}
                bare
                align="end"
              />
            </MetronomeRow>
            <MetronomeRow label={t('practice:metronome.subdivision')}>
              <Dropdown<Subdivision>
                label={t('practice:metronome.subdivision')}
                value={metronome.subdivision}
                onChange={metronome.setSubdivision}
                options={SUBDIVISIONS.map((subdivision) => ({
                  value: subdivision,
                  label: t(`practice:metronome.subdivisions.${subdivision}`),
                }))}
                bare
                align="end"
              />
            </MetronomeRow>
          </SettingsGroup>
          <SettingsGroup title={t('practice:metronome.trainers')}>
            <SpeedTrainerField
              speed={metronome.speed}
              tempoNow={metronome.tempoNow}
              bar={metronome.bar}
              playing={metronome.playing}
              onChange={metronome.setSpeed}
            />
            <div className="border-t border-border" />
            <BarTrainerField trainer={metronome.trainer} onChange={metronome.setTrainer} />
          </SettingsGroup>
        </div>
      </div>
    </div>
  )
}
