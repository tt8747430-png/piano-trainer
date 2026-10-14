import { useMemo, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { PinnedKeyboard } from '@/features/live-keyboard'
import { scaleShown } from '@/features/play-example'
import { noteFromParam, noteName, spellScale } from '@/shared/lib/music'
import { PRACTICE_RHYTHM_IDS, runSounds } from '@/shared/lib/schedule'
import { Dropdown, Labelled, Segmented } from '@/shared/ui'
import { scaleRunOf } from '../model/scale-run'
import type { ScaleView } from '../model/scale-view'
import { PlayUpDown } from './PlayUpDown'
import { ScaleExercises } from './ScaleExercises'
import { ScaleLayout } from './ScaleLayout'
import { ScaleSheet } from './ScaleSheet'
import { TempoSlider } from './TempoSlider'

/**
 * Scale view: the run from its start note, its keys marked by degree with the playing hand's fingers
 * (the right hand's when both play), played up and down; on the staff with its hands' fingers; and its
 * exercises in the Player.
 */
export function RunView({
  scale,
  name,
  onChange,
  choice,
  facts,
}: {
  scale: ScaleView
  name: string
  onChange: (change: Partial<ScaleView>) => void
  /** Which scale: the explorer's own fields, before this view's. */
  choice: ReactNode
  /** What the scale is made of, under its name. */
  facts: ReactNode
}) {
  const { t } = useTranslation(['practice', 'common'])
  const { root, kind, start, fingering, rhythm, hands } = scale
  const run = useMemo(
    () => scaleRunOf({ root, kind, start, fingering, rhythm, hands }),
    [root, kind, start, fingering, rhythm, hands],
  )
  const hand = hands === 'lh' ? 'lh' : 'rh'
  const tonic = noteFromParam(root)
  const tones = spellScale(tonic, kind)
  return (
    <ScaleLayout
      keyboard={
        <PinnedKeyboard
          shown={{
            keys: run.music.notes.map((n) => n.midi),
            // The keys coming down marked too: melodic minor's natural 6th and 7th are no blank keys.
            marks: new Map([
              ...scaleShown(run.down.placed, run.down.fingers[hand]).marks,
              ...scaleShown(run.placed, run.fingers[hand]).marks,
            ]),
          }}
        />
      }
      name={name}
      facts={facts}
      action={<PlayUpDown sounds={runSounds(run.music, scale.tempo)} />}
      fields={
        <>
          {choice}
          <Labelled label={t('practice:hands')}>
            <Segmented
              label={t('practice:hands')}
              value={hands}
              options={[
                { value: 'rh', label: t('common:handsShort.rh') },
                { value: 'lh', label: t('common:handsShort.lh') },
                { value: 'both', label: t('common:handsShort.both') },
              ]}
              onChange={(next) => onChange({ hands: next })}
            />
          </Labelled>
          <Labelled label={t('practice:scales.startOn')}>
            <Segmented
              label={t('practice:scales.startOn')}
              value={start}
              options={tones.map((tone, i) => ({ value: i + 1, label: noteName(tone.note) }))}
              onChange={(next) => onChange({ start: next })}
            />
          </Labelled>
          {run.fingerings.length > 1 ? (
            <Labelled label={t('practice:scales.fingering.label')}>
              <Segmented
                label={t('practice:scales.fingering.label')}
                value={run.fingering}
                options={run.fingerings.map((value) => ({
                  value,
                  label: t(`practice:scales.fingering.${value}`),
                }))}
                onChange={(value) => onChange({ fingering: value === run.own ? undefined : value })}
              />
            </Labelled>
          ) : null}
          <Labelled label={t('practice:scales.rhythmLabel')}>
            <Dropdown
              bare
              label={t('practice:scales.rhythmLabel')}
              value={rhythm}
              options={PRACTICE_RHYTHM_IDS.map((r) => ({
                value: r,
                label: t(`practice:scales.rhythm.${r}`),
              }))}
              onChange={(next) => onChange({ rhythm: next })}
              className="w-full"
            />
          </Labelled>
          <TempoSlider tempo={scale.tempo} onChange={(tempo) => onChange({ tempo })} />
        </>
      }
    >
      <ScaleSheet music={run.music} hands={hands} fingers />
      <ScaleExercises root={tonic} kind={kind} />
    </ScaleLayout>
  )
}
