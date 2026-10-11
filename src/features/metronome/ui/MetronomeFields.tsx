import { Square, Timer } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TEMPO_RANGE } from '@/shared/lib/schedule'
import { Segmented } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { Slider, SliderLabel } from '@/shared/ui/primitives/slider'
import { METRONOME_BEATS, type MetronomeBeats } from '@/shared/lib/schedule'
import { tappedTempo, withTap } from '../model/metronome'
import { useMetronome } from '../model/use-metronome'

/**
 * A metronome on its own: Start and Stop, its tempo on a slider or tapped, and its beats a bar. The
 * tempo and beats are the screen's to keep (its URL); whether it clicks is this control's.
 */
export function MetronomeFields({
  tempo,
  beats,
  onChange,
}: {
  tempo: number
  beats: MetronomeBeats
  onChange: (change: { tempo?: number; beats?: MetronomeBeats }) => void
}) {
  const { t } = useTranslation('common')
  const [on, setOn] = useState(false)
  const [taps, setTaps] = useState<readonly number[]>([])
  useMetronome({ on, tempo, beats })
  const tap = () => {
    const next = withTap(taps, performance.now())
    setTaps(next)
    const tapped = tappedTempo(next)
    if (tapped !== null) onChange({ tempo: tapped })
  }
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <Button variant={on ? 'secondary' : 'outline'} onClick={() => setOn((going) => !going)}>
          {on ? <Square aria-hidden /> : <Timer aria-hidden />}
          {on ? t('stop') : t('metronome.start')}
        </Button>
        <Button variant="outline" aria-label={t('metronome.tapLabel')} onClick={tap}>
          {t('metronome.tap')}
        </Button>
      </div>
      <Slider
        min={TEMPO_RANGE.min}
        max={TEMPO_RANGE.max}
        step={1}
        value={tempo}
        onValueChange={(value: number) => onChange({ tempo: value })}
        className="flex flex-col gap-3"
      >
        <div className="flex justify-between">
          <SliderLabel>{t('metronome.tempo')}</SliderLabel>
          <span className="font-semibold tabular-nums">{t('metronome.bpm', { tempo })}</span>
        </div>
      </Slider>
      <Segmented
        label={t('metronome.beats')}
        value={beats}
        options={METRONOME_BEATS.map((value) => ({ value, label: String(value) }))}
        onChange={(value) => onChange({ beats: value })}
      />
    </div>
  )
}
