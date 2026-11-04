import { useMemo, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { selectScaleStaff, useSettings } from '@/entities/settings'
import { PinnedKeyboard } from '@/features/live-keyboard'
import {
  characteristicDegree,
  hasStandardFingering,
  noteFromParam,
  spellScale,
  printedNote,
} from '@/shared/lib/music'
import { PRACTICE_RHYTHM_IDS, RUN_DIRECTIONS, runSounds } from '@/shared/lib/schedule'
import { Dropdown, Labelled, MenuPicker, Segmented, Stepper } from '@/shared/ui'
import { runStaff } from '../model/run-staff'
import { runShown, scaleRunOf } from '../model/scale-run'
import {
  MAX_OCTAVES,
  MIN_OCTAVES,
  runKeyShow,
  type RunOctaves,
  type ScaleView,
} from '../model/scale-view'
import { ModeVamp } from './ModeVamp'
import { PlayUpDown } from './PlayUpDown'
import { ScaleExercises } from './ScaleExercises'
import { ScaleFingering } from './ScaleFingering'
import { ScaleLayout } from './ScaleLayout'
import { ScaleSheet } from './ScaleSheet'
import { TempoSlider } from './TempoSlider'

/** The most notes a run offers to start on: a diminished scale's eight. */
const MOST_STARTS = 8

/**
 * Scale view: the run from its start note, its keys marked by degree with the playing hand's fingers
 * (the right hand's when both play), played up and down; on the staff with its hands' fingers; and its
 * exercises in the Player.
 */
export function RunView({
  scale,
  onChange,
  choice,
  facts,
}: {
  scale: ScaleView
  onChange: (change: Partial<ScaleView>) => void
  /** Which scale: the explorer's own fields, before this view's. */
  choice: ReactNode
  /** What the scale is made of, under its name. */
  facts: ReactNode
}) {
  const { t } = useTranslation(['practice', 'common'])
  const { root, kind, start, octaves, fingering, rhythm, hands, direction } = scale
  const run = useMemo(
    () => scaleRunOf({ root, kind, start, octaves, fingering, rhythm, hands, direction }),
    [root, kind, start, octaves, fingering, rhythm, hands, direction],
  )
  const tonic = noteFromParam(root)
  const tones = spellScale(tonic, kind)
  const layers = useSettings(selectScaleStaff)
  // The theory written on the playing hand's staff (A43), the right hand's when both play.
  const { music, placed, down } = run
  const written = useMemo(() => {
    const at = characteristicDegree(kind)
    return runStaff(
      music,
      hands === 'lh' ? 'lh' : 'rh',
      [...placed, ...down.placed],
      layers,
      {
        whole: t('practice:scaleStaff.whole'),
        half: t('practice:scaleStaff.half'),
        wholeAndHalf: t('practice:scaleStaff.wholeAndHalf'),
        tonic: t('practice:scaleStaff.tonicName'),
        leading: t('practice:scaleStaff.leadingName'),
        lower: t('practice:scaleStaff.lower'),
        upper: t('practice:scaleStaff.upper'),
        characteristic: t('practice:scaleStaff.characteristic'),
      },
      at === undefined ? undefined : spellScale(noteFromParam(root), kind)[at]?.degree,
    )
  }, [music, placed, down, hands, layers, t, root, kind])
  return (
    <ScaleLayout
      keyboard={<PinnedKeyboard shown={runShown(run, hands, runKeyShow(scale))} />}
      heading={choice}
      facts={facts}
      action={<PlayUpDown sounds={runSounds(run.music, scale.tempo)} />}
      fields={
        <>
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
          <Labelled label={t('practice:scales.octaves')}>
            {/* One to four octaves, as the scale books practise them (R29-P9). */}
            <Stepper
              label={t('practice:scales.octaves')}
              value={octaves}
              min={MIN_OCTAVES}
              max={MAX_OCTAVES}
              onChange={(next) => onChange({ octaves: next as RunOctaves })}
              decrease={t('practice:scales.fewerOctaves')}
              increase={t('practice:scales.moreOctaves')}
            />
          </Labelled>
          <Labelled label={t('practice:scales.direction.label')}>
            <MenuPicker
              bare
              label={t('practice:scales.direction.label')}
              value={direction ?? 'both'}
              options={RUN_DIRECTIONS.map((way) => ({
                value: way,
                label: t(`practice:scales.direction.${way}`),
              }))}
              onChange={(way) => onChange({ direction: way === 'both' ? undefined : way })}
            />
          </Labelled>
          {/* The chromatic scale from another note is the chromatic scale on that root. A menu of the
              scale's notes: seven or eight outgrow a narrow phone's row. */}
          {tones.length <= MOST_STARTS ? (
            <Labelled label={t('practice:scales.startOn')}>
              <MenuPicker
                bare
                label={t('practice:scales.startOn')}
                value={start}
                options={tones.map((tone, i) => ({ value: i + 1, label: printedNote(tone.note) }))}
                onChange={(next) => onChange({ start: next })}
              />
            </Labelled>
          ) : null}
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
      <ScaleSheet music={written} hands={hands} fingers />
      <ModeVamp root={tonic} kind={kind} />
      <ScaleFingering run={run} standard={hasStandardFingering(kind)} />
      <ScaleExercises root={tonic} kind={kind} />
    </ScaleLayout>
  )
}
