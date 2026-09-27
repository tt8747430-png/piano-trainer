import { Square } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { PRACTICE_RHYTHM_IDS, TEMPO_RANGE, type NoteSound } from '@/shared/lib/schedule'
import { usePlayback } from '@/shared/lib/services'
import { Dropdown, Segmented } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { Slider, SliderLabel } from '@/shared/ui/primitives/slider'
import type { ScaleView } from '../model/scale-view'

/** The scale practised: its rhythm, tempo and hands, and Play up and down, which turns into Stop. */
export function ScalePractice({
  scale,
  run,
  onChange,
}: {
  scale: ScaleView
  run: readonly NoteSound[]
  onChange: (change: Partial<ScaleView>) => void
}) {
  const { t } = useTranslation(['learn', 'common'])
  const playback = usePlayback<'run'>()
  return (
    <section className="flex flex-col gap-4 rounded-3xl border border-border bg-card p-5">
      <h3 className="text-2xl">{t('learn:practice')}</h3>
      <Dropdown
        label={t('learn:rhythmLabel')}
        value={scale.rhythm}
        options={PRACTICE_RHYTHM_IDS.map((r) => ({ value: r, label: t(`learn:rhythm.${r}`) }))}
        onChange={(rhythm) => onChange({ rhythm })}
      />
      <Slider
        min={TEMPO_RANGE.min}
        max={TEMPO_RANGE.max}
        step={4}
        value={scale.tempo}
        onValueChange={(tempo) => onChange({ tempo })}
        className="flex flex-col gap-3"
      >
        <div className="flex justify-between">
          <SliderLabel>{t('learn:tempo')}</SliderLabel>
          <span className="font-semibold tabular-nums">
            {t('learn:bpm', { tempo: scale.tempo })}
          </span>
        </div>
      </Slider>
      <Segmented
        label={t('learn:handsLabel')}
        value={scale.hands}
        options={[
          { value: 'rh', label: t('common:hands.rh') },
          { value: 'lh', label: t('common:hands.lh') },
          { value: 'both', label: t('learn:together') },
        ]}
        onChange={(hands) => onChange({ hands })}
      />
      <Button size="pill" onClick={() => playback.toggle('run', run)}>
        {playback.playing === 'run' ? (
          <>
            <Square data-icon="inline-start" />
            {t('common:stop')}
          </>
        ) : (
          t('learn:playUpDown')
        )}
      </Button>
    </section>
  )
}
