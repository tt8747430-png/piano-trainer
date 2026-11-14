import { useMemo, useState, type ReactNode } from 'react'
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
import { usePlayback } from '@/shared/lib/services'
import {
  ActionMenu,
  Dropdown,
  FloatingActions,
  FloatingPiece,
  FloatingPieces,
  FloatingPlaySplit,
  HandsPicture,
  Labelled,
  MenuPicker,
  Segmented,
  Sheet,
  SheetContent,
  Stepper,
  usePlayKey,
} from '@/shared/ui'
import { runStaff } from '../model/run-staff'
import { runShown, scaleRunOf } from '../model/scale-run'
import { MAX_OCTAVES, MIN_OCTAVES, type RunOctaves, type ScaleView } from '../model/scale-view'
import { ModeVamp } from './ModeVamp'
import { ScaleExercises } from './ScaleExercises'
import { ScaleLayout } from './ScaleLayout'
import { ScaleSheet } from './ScaleSheet'

/** The run's octaves, one to four as the scale books practise them (R29-P9). */
const OCTAVES = Array.from(
  { length: MAX_OCTAVES - MIN_OCTAVES + 1 },
  (_, at) => (MIN_OCTAVES + at) as RunOctaves,
)
/** The tempo the Tempo sheet steps through, in BPM, as a practised scale is taken. */
const TEMPO_STEPS = { min: 40, max: 240 } as const

/** The most notes a run offers to start on: a diminished scale's eight. */
const MOST_STARTS = 8

/**
 * Scale view (canvas 174): the run from its start note on the keys at the top, engraved with its
 * fingers over the notes and each hand's fingers in a line under it; its choices; its exercises in the
 * Player; and the floating bar of the Chords page: Tempo, Play scale with how it plays (Up, Up and
 * down, Down; its octaves), the hands.
 */
export function RunView({
  scale,
  onChange,
  choice,
}: {
  scale: ScaleView
  onChange: (change: Partial<ScaleView>) => void
  /** Which scale: the explorer's own fields, before this view's. */
  choice: ReactNode
}) {
  const { t } = useTranslation(['practice', 'common', 'music'])
  const { root, kind, start, octaves, fingering, rhythm, hands, direction, compare } = scale
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
      'fingers',
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
  }, [music, placed, down, hands, layers, t, root, kind, compare])
  const playback = usePlayback<'up-down'>()
  const play = () => playback.toggle('up-down', () => runSounds(run.music, scale.tempo))
  usePlayKey(play)
  const [tempoOpen, setTempoOpen] = useState(false)
  const standard = hasStandardFingering(kind)
  const handsShown = hands === 'both' ? (['rh', 'lh'] as const) : ([hands] as const)
  return (
    <ScaleLayout
      keyboard={<PinnedKeyboard shown={runShown(run, hands)} place="top" />}
      heading={choice}
      music={
        <section className="flex flex-col gap-3 rounded-2xl bg-card px-3 py-4 ring-1 ring-border">
          <ScaleSheet music={written} hands={hands} fingers />
          {/* Each hand's fingers in a line under the run (canvas 174), as the Chords page's. */}
          <p className="flex min-h-11 flex-col items-center justify-center gap-1 text-sm text-muted-foreground">
            {standard
              ? handsShown.map((side) => (
                  <span key={side} className="whitespace-nowrap">
                    {t(`common:hands.${side}`)}
                    <b className="ms-1.5 font-bold whitespace-pre text-foreground tabular-nums">
                      {run.fingers[side].join(' ')}
                    </b>
                  </span>
                ))
              : t('practice:scales.noFingering')}
          </p>
        </section>
      }
      fields={
        <>
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
        </>
      }
      bar={
        <FloatingActions>
          {/* The canvas's three pieces of glass, as the Chords page's: the tempo, Play with how it
              plays, the hands. */}
          <FloatingPieces label={t('practice:transport')}>
            <FloatingPiece
              label={`${t('practice:scales.tempo')}: ${t('music:bpm', { tempo: scale.tempo })}`}
              caption="BPM"
              aria-haspopup="dialog"
              onClick={() => setTempoOpen(true)}
            >
              <span className="text-lg font-bold tabular-nums">{scale.tempo}</span>
            </FloatingPiece>
            <FloatingPlaySplit
              label={t('practice:scales.playScale')}
              playing={playback.playing === 'up-down'}
              onPlay={play}
              menu={(trigger) => (
                <ActionMenu
                  label={t('practice:scales.playHow')}
                  align="end"
                  render={trigger}
                  trigger={null}
                  actions={[
                    ...RUN_DIRECTIONS.map((way) => ({
                      key: way,
                      label: t(`practice:scales.direction.${way}`),
                      checked: (direction ?? 'both') === way,
                      onSelect: () => onChange({ direction: way === 'both' ? undefined : way }),
                    })),
                    ...OCTAVES.map((count) => ({
                      key: `octaves-${count}`,
                      group: 'octaves',
                      unnamed: true,
                      label: t('practice:scales.octaveCount', { count }),
                      checked: octaves === count,
                      onSelect: () => onChange({ octaves: count }),
                    })),
                  ]}
                />
              )}
            />
            <ActionMenu
              label={t('practice:hands')}
              align="end"
              render={
                <FloatingPiece
                  label={`${t('practice:hands')}: ${t(`common:hands.${hands}`)}`}
                  caption={t('practice:hands')}
                >
                  <HandsPicture hands={hands} />
                </FloatingPiece>
              }
              trigger={null}
              actions={(['both', 'rh', 'lh'] as const).map((each) => ({
                key: each,
                label: t(`common:hands.${each}`),
                checked: hands === each,
                onSelect: () => onChange({ hands: each }),
              }))}
            />
          </FloatingPieces>
          <Sheet open={tempoOpen} onOpenChange={setTempoOpen}>
            <SheetContent title={t('practice:scales.tempo')}>
              <Stepper
                label={t('practice:scales.tempo')}
                value={scale.tempo}
                min={TEMPO_STEPS.min}
                max={TEMPO_STEPS.max}
                step={4}
                format={(tempo) => t('music:bpm', { tempo })}
                decrease={t('practice:exercisePage.slower')}
                increase={t('practice:exercisePage.faster')}
                onChange={(tempo) => onChange({ tempo })}
              />
            </SheetContent>
          </Sheet>
        </FloatingActions>
      }
    >
      <ModeVamp root={tonic} kind={kind} />
      <ScaleExercises root={tonic} kind={kind} />
    </ScaleLayout>
  )
}
