import { useMemo, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { ExplorerKeyboard } from '@/features/live-keyboard'
import { scaleShown } from '@/features/play-example'
import { noteFromParam, noteName, spellScale } from '@/shared/lib/music'
import { PRACTICE_RHYTHM_IDS, runSounds } from '@/shared/lib/schedule'
import { Dropdown, Labelled, Segmented } from '@/shared/ui'
import { scaleRunOf } from '../model/scale-run'
import type { ScaleView } from '../model/scale-view'
import { FingeringTable } from './FingeringTable'
import { PlayUpDown } from './PlayUpDown'
import { ScaleExercises } from './ScaleExercises'
import { ScaleLayout } from './ScaleLayout'
import { ScaleSheet } from './ScaleSheet'
import { TempoSlider } from './TempoSlider'

/**
 * Scale view: the run from its start note, its keys marked by degree with the playing hand's fingers
 * (the right hand's when both play), played up and down; on the staff and in a table of both hands'
 * fingers; and its exercises in the Player.
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
  const { t } = useTranslation(['learn', 'common'])
  const { root, kind, start, fingering, rhythm, hands } = scale
  const run = useMemo(
    () => scaleRunOf({ root, kind, start, fingering, rhythm, hands }),
    [root, kind, start, fingering, rhythm, hands],
  )
  const tonic = noteFromParam(root)
  const tones = spellScale(tonic, kind)
  return (
    <ScaleLayout
      keyboard={
        <ExplorerKeyboard
          shown={{
            keys: run.music.notes.map((n) => n.midi),
            marks: scaleShown(run.placed, run.fingers[hands === 'lh' ? 'lh' : 'rh']).marks,
          }}
        />
      }
      name={name}
      facts={facts}
      action={<PlayUpDown sounds={runSounds(run.music, scale.tempo)} />}
      fields={
        <>
          {choice}
          <Labelled label={t('learn:handsLabel')}>
            <Segmented
              label={t('learn:handsLabel')}
              value={hands}
              options={[
                { value: 'rh', label: t('common:hands.rh') },
                { value: 'lh', label: t('common:hands.lh') },
                { value: 'both', label: t('learn:together') },
              ]}
              onChange={(next) => onChange({ hands: next })}
            />
          </Labelled>
          <Labelled label={t('learn:startOn')}>
            <Dropdown
              label={t('learn:startOn')}
              value={start}
              options={tones.map((tone, i) => ({
                value: i + 1,
                label: noteName(tone.note),
                detail: tone.degree,
              }))}
              onChange={(next) => onChange({ start: next })}
              className="w-full"
            />
          </Labelled>
          {run.fingerings.length > 1 ? (
            <Labelled label={t('learn:fingering.label')}>
              <Segmented
                label={t('learn:fingering.label')}
                value={run.fingering}
                options={run.fingerings.map((value) => ({
                  value,
                  label: t(`learn:fingering.${value}`),
                }))}
                onChange={(value) => onChange({ fingering: value === run.own ? undefined : value })}
              />
            </Labelled>
          ) : null}
          <Labelled label={t('learn:rhythmLabel')}>
            <Dropdown
              label={t('learn:rhythmLabel')}
              value={rhythm}
              options={PRACTICE_RHYTHM_IDS.map((r) => ({
                value: r,
                label: t(`learn:rhythm.${r}`),
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
      <FingeringTable
        notes={run.placed.map((key) => noteName(key.tone.note))}
        rh={run.fingers.rh}
        lh={run.fingers.lh}
      />
      <ScaleExercises root={tonic} kind={kind} />
    </ScaleLayout>
  )
}
