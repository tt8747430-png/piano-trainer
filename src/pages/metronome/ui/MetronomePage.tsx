import { Hand } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { BeatSquares, useMetronome } from '@/features/metronome'
import { useShortcuts } from '@/shared/lib/shortcuts'
import { BPM_RANGE } from '@/shared/lib/schedule'
import { InfoTip } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { Slider, SliderLabel } from '@/shared/ui/primitives/slider'
import { ToolPage } from '@/widgets/tool-page'
import { MetronomeSettings } from './MetronomeSettings'
import { TempoSteps } from '@/shared/ui'
import { TempoWordTip } from './TempoWordTip'

/**
 * The Metronome (ADR 0052), a tool on Practice (R29 B11), on the tools' one layout, every setting in
 * place as Chordify's (R32): the tempo large between its steps and its word, the bar's beats as
 * squares to tap (accent · beat · silent), the slider with Tap tempo; then, under it on a phone and
 * beside it on a laptop, Sound (time signature, sound, subdivision) and Practice aids (the speed
 * trainer, silent bars); Start floating. No gear: nothing of it is anywhere else. Space starts and
 * stops it, ↑ ↓ change the tempo by 1, with Shift by 10. What it does is its bar's ⓘ.
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
    <ToolPage
      title={name}
      actions={
        <InfoTip name={name} bar>
          {t('practice:metronome.info')}
        </InfoTip>
      }
      play={{
        label: t('practice:metronome.start'),
        playing: metronome.playing,
        onToggle: metronome.toggle,
      }}
      side={<MetronomeSettings metronome={metronome} />}
    >
      <div className="flex flex-col items-center gap-2">
        <TempoSteps bpm={metronome.tempoNow} onStep={metronome.nudge} />
        <TempoWordTip bpm={metronome.tempoNow} />
      </div>
      <BeatSquares
        levels={metronome.beatLevels}
        sounding={metronome.beat}
        muted={metronome.muted}
        onTap={metronome.tapBeat}
      />
      <div className="flex w-full max-w-md items-center gap-3" data-setting="metronome.bpm">
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
    </ToolPage>
  )
}
