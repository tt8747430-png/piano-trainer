import { Link } from '@tanstack/react-router'
import { Hand } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useMetronome } from '@/features/metronome'
import { useShortcuts } from '@/shared/lib/shortcuts'
import { BPM_RANGE, METRONOME_METERS, type MetronomeMeter } from '@/shared/lib/schedule'
import { Dropdown, InfoTip, SettingsGroup } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { Slider, SliderLabel } from '@/shared/ui/primitives/slider'
import { ToolPage } from '@/widgets/tool-page'
import { BeatSquares } from './BeatSquares'
import { MetronomeRow } from './MetronomeRow'
import { TempoSteps } from './TempoSteps'
import { TempoWordTip } from './TempoWordTip'

/**
 * The Metronome (ADR 0052), a tool on Practice (R29 B11), on the tools' one layout: the tempo large
 * between its steps and its word, the bar's beats as squares to tap (accent · beat · silent), then the
 * slider with Tap tempo and the time signature; Start floating. How it sounds and its two trainers
 * are its Settings page, off its gear. Space starts and stops it, ↑ ↓ change the tempo by 1, with
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
    <ToolPage
      title={name}
      actions={
        <InfoTip name={name} bar>
          {t('practice:metronome.info')}
        </InfoTip>
      }
      settings={<Link to="/practice/metronome/settings" />}
      play={{
        label: t('practice:metronome.start'),
        playing: metronome.playing,
        onToggle: metronome.toggle,
      }}
      controls={
        <div className="mx-auto flex w-full max-w-md flex-col gap-6">
          <div className="flex w-full items-center gap-3" data-setting="metronome.bpm">
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
          <SettingsGroup>
            <MetronomeRow label={t('practice:metronome.meter')} setting="metronome.meter">
              <Dropdown<MetronomeMeter>
                label={t('practice:metronome.meter')}
                value={metronome.meter}
                onChange={metronome.setMeter}
                options={METRONOME_METERS.map((meter) => ({ value: meter, label: meter }))}
                bare
                align="end"
              />
            </MetronomeRow>
          </SettingsGroup>
        </div>
      }
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
    </ToolPage>
  )
}
