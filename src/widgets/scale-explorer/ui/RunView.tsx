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
  placeMinorKeyChords,
  placeScaleChords,
  keysAround,
  spellScale,
  printedNote,
} from '@/shared/lib/music'
import { PRACTICE_RHYTHM_IDS, RUN_DIRECTIONS, runSounds } from '@/shared/lib/schedule'
import { usePlayback } from '@/shared/lib/services'
import {
  ActionMenu,
  FloatingActions,
  FloatingPiece,
  FloatingPieces,
  FloatingPlaySplit,
  GroupLink,
  GroupRows,
  GroupSegmented,
  HandsPicture,
  MenuPicker,
  Sheet,
  SheetContent,
  Stepper,
  usePlayKey,
} from '@/shared/ui'
import { ScaleChordGrid } from '@/features/play-example'
import { keyOfScale } from '../model/scale-key'
import { runStaff } from '../model/run-staff'
import { runShown, scaleRunOf } from '../model/scale-run'
import { RUN_OCTAVES, type ScaleView } from '../model/scale-view'
import { KeyFifths } from './KeyFifths'
import { ScaleExercises } from './ScaleExercises'
import { ScaleLayout } from './ScaleLayout'
import { ScaleSheet } from './ScaleSheet'

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
  const shown = runShown(run, hands)
  // The boards' keys round the run's first key: a fifth under it to a twelfth over it on a phone,
  // an octave under it to three over it on a laptop.
  const least = keysAround(Math.min(...shown.keys), [5, 19], [12, 36])
  const tones = spellScale(tonic, kind)
  const layers = useSettings(selectScaleStaff)
  const musicKey = keyOfScale(root, kind)
  // Each degree's triad, a minor key's as the books write it (its harmonic V and vii° over v and VII).
  const chords = useMemo(
    () =>
      kind === 'natural'
        ? placeMinorKeyChords(tonic, 3, 0)
        : tones.length === 7
          ? placeScaleChords(tonic, kind, 3, 0)
          : [],
    [tonic, kind, tones.length],
  )
  // The staff engraves the scale up one octave from its start, as its board draws it (GRANDSTAFF):
  // the run's octaves and direction are how it plays, not what is printed.
  const engraved = useMemo(
    () => scaleRunOf({ root, kind, start, octaves: 1, fingering, rhythm, hands, direction: 'up' }),
    [root, kind, start, fingering, rhythm, hands],
  )
  // The theory written on the playing hand's staff (A43), the right hand's when both play.
  const { music, placed } = engraved
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
      placed,
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
  }, [music, placed, hands, layers, t, root, kind, compare])
  const startTone = tones[start - 1] ?? tones[0]
  const startName = startTone ? printedNote(startTone.note) : ''
  const playback = usePlayback<'up-down'>()
  const play = () => playback.toggle('up-down', () => runSounds(run.music, scale.tempo))
  usePlayKey(play)
  const [tempoOpen, setTempoOpen] = useState(false)
  const standard = hasStandardFingering(kind)
  return (
    <ScaleLayout
      keyboard={<PinnedKeyboard shown={shown} place="top" least={least} />}
      heading={choice}
      music={
        <section className="card flex flex-col gap-3 overflow-hidden px-3 py-4">
          <ScaleSheet music={written} hands={hands} fingers />
          {/* The fingers stand on the staves; only a scale with none says so (the board's FING60). */}
          {standard ? null : (
            <p className="text-center text-subhead text-muted-foreground">
              {t('practice:scales.noFingering')}
            </p>
          )}
        </section>
      }
      fields={
        <GroupRows label={t('practice:scales.settings')}>
          {run.fingerings.length > 1 ? (
            <GroupSegmented
              label={t('practice:scales.fingering.label')}
              value={run.fingering}
              options={run.fingerings.map((value) => ({
                value,
                label: t(`practice:scales.fingering.${value}`),
              }))}
              onChange={(value) => onChange({ fingering: value === run.own ? undefined : value })}
            />
          ) : null}
          {/* The chromatic scale from another note is the chromatic scale on that root. */}
          {tones.length <= MOST_STARTS ? (
            <MenuPicker
              label={t('practice:scales.startOn')}
              value={start}
              options={tones.map((tone, i) => ({ value: i + 1, label: printedNote(tone.note) }))}
              onChange={(next) => onChange({ start: next })}
              trigger={<GroupLink label={t('practice:scales.startOn')} value={startName} />}
            />
          ) : null}
          {/* Compare with the major or minor on the same tonic (A43): its other notes over the run. */}
          {tones.length === 7 ? (
            <MenuPicker
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
              trigger={
                <GroupLink
                  label={t('practice:scales.compare.label')}
                  value={compare ? scaleName(tonic, compare) : t('practice:scales.compare.none')}
                />
              }
            />
          ) : null}
          <MenuPicker
            label={t('practice:scales.rhythmLabel')}
            value={rhythm}
            options={PRACTICE_RHYTHM_IDS.map((r) => ({
              value: r,
              label: t(`practice:scales.rhythm.${r}`),
            }))}
            onChange={(next) => onChange({ rhythm: next })}
            trigger={
              <GroupLink
                label={t('practice:scales.rhythmLabel')}
                value={t(`practice:scales.rhythm.${rhythm}`)}
              />
            }
          />
        </GroupRows>
      }
      bar={
        <FloatingActions>
          {/* The canvas's three pieces of glass, as the Chords page's: the tempo, Play with how it
              plays, the hands. */}
          <FloatingPieces label={t('practice:transport')}>
            <FloatingPiece
              label={`${t('practice:scales.tempo')}: ${t('music:bpm', { tempo: scale.tempo })}`}
              caption={t('music:tempoField.bpm')}
              round
              aria-haspopup="dialog"
              onClick={() => setTempoOpen(true)}
            >
              <span className="text-lg font-bold tabular-nums">{scale.tempo}</span>
            </FloatingPiece>
            <FloatingPlaySplit
              label={t('practice:scales.playScale')}
              playing={playback.playing === 'up-down'}
              onPlay={play}
              menuLabel={t('practice:scales.playHow')}
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
                    ...RUN_OCTAVES.map((count) => ({
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
                  round
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
          <Sheet at={{ side: 'top' }} open={tempoOpen} onOpenChange={setTempoOpen}>
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
      {chords.length > 0 ? (
        <section className="flex flex-col gap-2">
          <h3 className="font-sans text-sm font-semibold">
            {t('practice:scales.chordsInScale', { scale: scaleName(tonic, kind) })}
          </h3>
          <ScaleChordGrid chords={chords} />
        </section>
      ) : null}
      {musicKey ? <KeyFifths value={musicKey} kind={kind} /> : null}
      <ScaleExercises root={tonic} kind={kind} />
    </ScaleLayout>
  )
}
