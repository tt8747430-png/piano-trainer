import { Hand } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { BeatSquares, useMetronome } from '@/features/metronome'
import { useShortcuts } from '@/shared/lib/shortcuts'
import { tempoWord } from '@/shared/lib/music'
import { BPM_RANGE } from '@/shared/lib/schedule'
import { FloatingPiece } from '@/shared/ui'
import { Slider, SliderLabel } from '@/shared/ui/primitives/slider'
import { ToolPage } from '@/widgets/tool-page'
import { MetronomeGear } from './MetronomeGear'
import { MetronomeSettings } from './MetronomeSettings'
import { TempoSteps } from '@/shared/ui'

/**
 * The Metronome (canvas 179), a tool on Practice, on the tools' one layout, every setting in place as
 * Chordify's: the tempo's word and BPM over its number between its steps, the slider, the bar's beats as tall
 * tiles to tap (accent · beat · silent); then, under them on a phone and beside them on a laptop, one
 * group of rows (time signature, sound, subdivision, the speed trainer, silent bars); Tap and Start
 * floating. No gear: nothing of it is anywhere else. Space starts and stops it, ↑ ↓ change the tempo
 * by 1, with Shift by 10.
 */
export function MetronomePage() {
  const { t } = useTranslation(['practice', 'music'])
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
      play={{
        label: t('practice:metronome.start'),
        playing: metronome.playing,
        onToggle: metronome.toggle,
      }}
      bar={
        <FloatingPiece
          label={t('practice:metronome.tap')}
          caption={t('practice:metronome.tapShort')}
          onClick={metronome.tap}
        >
          <Hand aria-hidden />
        </FloatingPiece>
      }
      side={<MetronomeSettings metronome={metronome} />}
      gear={<MetronomeGear metronome={metronome} />}
    >
      <TempoSteps
        bpm={metronome.tempoNow}
        mark={t(`music:tempoWord.${tempoWord(metronome.tempoNow)}.name`)}
        large
        onStep={metronome.nudge}
      />
      <div className="flex w-full items-center" data-setting="metronome.bpm">
        <Slider
          value={metronome.tempoNow}
          min={BPM_RANGE.min}
          max={BPM_RANGE.max}
          onValueChange={(bpm) => metronome.setBpm(bpm)}
          className="min-w-24 flex-1"
        >
          <SliderLabel className="sr-only">{t('practice:metronome.slider')}</SliderLabel>
        </Slider>
      </div>
      {metronome.flash && metronome.playing && metronome.beat !== null ? (
        // Flash on the beat: a honey wash over the screen as each beat sounds, keyed to the beat
        // so it flashes anew each time; it never takes a tap.
        <span
          key={`${metronome.bar ?? 0}.${metronome.beat}`}
          aria-hidden
          className="beat-flash pointer-events-none fixed inset-0 z-40 bg-primary/25"
        />
      ) : null}
      <BeatSquares
        tall
        levels={metronome.beatLevels}
        sounding={metronome.beat}
        muted={metronome.muted}
        onTap={metronome.tapBeat}
      />
    </ToolPage>
  )
}
