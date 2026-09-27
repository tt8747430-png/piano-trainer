import { useTranslation } from 'react-i18next'
import type { PlacedScaleChord } from '@/shared/lib/music'
import { walkSounds } from '@/shared/lib/schedule'
import { Segmented } from '@/shared/ui'
import type { ScaleView } from '../model/scale-view'
import { PlayUpDown } from './PlayUpDown'
import { TempoSlider } from './TempoSlider'

/** Walk the chords: the seven up to the tonic's octave and back, struck or rolled at the tempo, each on the keys as it sounds. */
export function WalkCard({
  scale,
  walk,
  onChange,
}: {
  scale: ScaleView
  walk: readonly PlacedScaleChord[]
  onChange: (change: Partial<ScaleView>) => void
}) {
  const { t } = useTranslation('learn')
  const sounds = walkSounds(
    walk.map((placed) => placed.tones.map((tone) => tone.midi)),
    { arpeggio: scale.arpeggio, tempo: scale.tempo },
  )
  return (
    <section className="flex flex-col gap-4 rounded-3xl border border-border bg-card p-5">
      <h3 className="text-2xl">{t('walk.title')}</h3>
      <Segmented
        label={t('walk.played')}
        value={scale.arpeggio ? 'arpeggio' : 'block'}
        options={[
          { value: 'block', label: t('walk.block') },
          { value: 'arpeggio', label: t('arpeggio') },
        ]}
        onChange={(played) => onChange({ arpeggio: played === 'arpeggio' })}
      />
      <TempoSlider tempo={scale.tempo} onChange={(tempo) => onChange({ tempo })} />
      <PlayUpDown sounds={sounds} />
    </section>
  )
}
