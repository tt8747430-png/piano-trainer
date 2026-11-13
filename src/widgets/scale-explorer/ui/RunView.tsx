import { Link } from '@tanstack/react-router'
import { useMemo, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { useScaleName } from '@/shared/i18n'
import { selectScaleStaff, useSettings } from '@/entities/settings'
import { PinnedKeyboard } from '@/features/live-keyboard'
import {
  characteristicDegree,
  COMPARED_SCALES,
  scaleDifferences,
  hasStandardFingering,
  noteFromParam,
  spellScale,
  printedNote,
} from '@/shared/lib/music'
import { PRACTICE_RHYTHM_IDS, RUN_DIRECTIONS, runSounds } from '@/shared/lib/schedule'
import { Dropdown, HandsSegmented, Labelled, MenuPicker, Segmented, Stepper } from '@/shared/ui'
import { runStaff } from '../model/run-staff'
import { runShown, scaleRunOf } from '../model/scale-run'
import {
  MAX_OCTAVES,
  MIN_OCTAVES,
  STAFF_MARKS,
  type RunOctaves,
  type ScaleView,
} from '../model/scale-view'
import { ModeVamp } from './ModeVamp'
import { PlayUpDown } from './PlayUpDown'
import { firstScaleExercise, ScaleExercises } from './ScaleExercises'
import { ScaleFingering } from './ScaleFingering'
import { ScaleLayout } from './ScaleLayout'
import { ScaleSheet } from './ScaleSheet'
import { TempoSlider } from './TempoSlider'

/** The most notes a run offers to start on: a diminished scale's eight. */
const MOST_STARTS = 8

/**
 * Scale view: the run from its start note, its keys marked by degree with the playing hand's fingers
 * (the right hand's when both play), played up and down; on the staff first, under the choice of its
 * one layer of labels (fingers, degrees or steps, R34), then its choices; and its exercises in the
 * Player.
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
  const { root, kind, start, octaves, fingering, rhythm, hands, direction, compare, marks } = scale
  const scaleName = useScaleName()
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
    const own = spellScale(noteFromParam(root), kind)
    // The compared scale's notes where they differ, over this scale's notes on those degrees.
    const compared = new Map(
      compare
        ? scaleDifferences(noteFromParam(root), kind, compare).flatMap(({ at: place, note }) => {
            const degree = own[place]?.degree
            return degree ? [[degree, printedNote(note)] as const] : []
          })
        : [],
    )
    return runStaff(
      music,
      hands === 'lh' ? 'lh' : 'rh',
      [...placed, ...down.placed],
      marks,
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
      at === undefined ? undefined : own[at]?.degree,
      compared,
    )
  }, [music, placed, down, hands, marks, layers, t, root, kind, compare])
  const practised = firstScaleExercise(kind)
  return (
    <ScaleLayout
      keyboard={<PinnedKeyboard shown={runShown(run, hands)} />}
      heading={choice}
      facts={facts}
      action={
        <PlayUpDown
          sounds={runSounds(run.music, scale.tempo)}
          practise={
            practised ? (
              <Link
                to="/play/exercise/$exerciseId"
                params={{ exerciseId: practised.id }}
                search={{ root, kind }}
              />
            ) : undefined
          }
        />
      }
      music={
        <div className="flex flex-col gap-3">
          {/* One layer of labels on the staff at a time, chosen in place (R34, D3). */}
          <Segmented
            label={t('practice:scales.marks.label')}
            value={marks}
            options={STAFF_MARKS.map((value) => ({
              value,
              label: t(`practice:scales.marks.${value}`),
            }))}
            onChange={(next) => onChange({ marks: next })}
          />
          <ScaleSheet music={written} hands={hands} fingers={marks === 'fingers'} />
        </div>
      }
      fields={
        <>
          <Labelled label={t('practice:hands')}>
            <HandsSegmented
              label={t('practice:hands')}
              value={hands}
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
          {/* Compare with the major or minor on the same tonic (A43): its other notes over the run. */}
          {tones.length === 7 ? (
            <Labelled label={t('practice:scales.compare.label')}>
              <MenuPicker
                bare
                label={t('practice:scales.compare.label')}
                value={compare ?? 'none'}
                options={[
                  { value: 'none' as const, label: t('practice:scales.compare.none') },
                  ...COMPARED_SCALES.filter((other) => other !== kind).map((other) => ({
                    value: other,
                    label: scaleName(tonic, other),
                  })),
                ]}
                onChange={(next) => onChange({ compare: next === 'none' ? undefined : next })}
              />
            </Labelled>
          ) : null}
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
      <ModeVamp root={tonic} kind={kind} />
      <ScaleFingering run={run} standard={hasStandardFingering(kind)} />
      <ScaleExercises root={tonic} kind={kind} />
    </ScaleLayout>
  )
}
