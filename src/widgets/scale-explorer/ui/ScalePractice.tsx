import { useTranslation } from 'react-i18next'
import { PRACTICE_RHYTHM_IDS, type NoteSound } from '@/shared/lib/schedule'
import { Dropdown, NamedSegmented } from '@/shared/ui'
import type { ScaleView } from '../model/scale-view'
import { PlayUpDown } from './PlayUpDown'
import { TempoSlider } from './TempoSlider'

/** The scale practised: its rhythm, tempo and hands, and Play up and down, which turns into Stop. */
export function ScalePractice({
  scale,
  sounds,
  onChange,
}: {
  scale: ScaleView
  sounds: readonly NoteSound[]
  onChange: (change: Partial<ScaleView>) => void
}) {
  const { t } = useTranslation(['learn', 'common'])
  return (
    <section className="flex flex-col gap-4 card p-5">
      <h3 className="text-2xl">{t('learn:playScale')}</h3>
      <Dropdown
        label={t('learn:rhythmLabel')}
        value={scale.rhythm}
        options={PRACTICE_RHYTHM_IDS.map((r) => ({ value: r, label: t(`learn:rhythm.${r}`) }))}
        onChange={(rhythm) => onChange({ rhythm })}
      />
      <TempoSlider tempo={scale.tempo} onChange={(tempo) => onChange({ tempo })} />
      <NamedSegmented
        label={t('learn:handsLabel')}
        value={scale.hands}
        options={[
          { value: 'rh', label: t('common:hands.rh') },
          { value: 'lh', label: t('common:hands.lh') },
          { value: 'both', label: t('learn:together') },
        ]}
        onChange={(hands) => onChange({ hands })}
      />
      <PlayUpDown sounds={sounds} />
    </section>
  )
}
