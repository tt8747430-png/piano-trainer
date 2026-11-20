import { PracticeFavouriteButton, useMarkPracticeUsed } from '@/features/manage-practice-library'
import { Link, useParams, useSearch } from '@tanstack/react-router'
import { Volume2 } from 'lucide-react'
import { useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import {
  exerciseChoice,
  exerciseOf,
  isExerciseId,
  shelfOf,
  tempoKey,
  type Exercise,
  type ExerciseChoice,
} from '@/entities/exercise'
import { selectTempo, useProgress } from '@/entities/progress'
import { PinnedKeyboard } from '@/features/live-keyboard'
import { PianoButton } from '@/widgets/practice-pages'
import { TappableStaff } from '@/features/play-example'
import { arrangeExercise } from '@/features/practice'
import { localText, useLocale } from '@/shared/i18n'
import { useElementSize, useSetSearch } from '@/shared/lib'
import { HANON_NUMBERS, HANON_RHYTHMS } from '@/shared/lib/exercise'
import { keysAround, midiOf, noteParam, printedNote, type Hand } from '@/shared/lib/music'
import { notate } from '@/shared/lib/notation'
import { TEMPO_RANGE } from '@/shared/lib/schedule'
import {
  BackButton,
  FloatingActions,
  FloatingPiece,
  FloatingPieceLink,
  FloatingPieces,
  FloatingPlayLink,
  GroupRow,
  GroupRows,
  Segmented,
  HandsSegmented,
  KeyPicker,
  ScreenHeader,
  Stepper,
} from '@/shared/ui'
import type { ExercisePageSearch } from '../model/exercise-page-search'
import { firstPosition } from '../model/first-position'
import { openingSystems } from '../model/opening-bars'
import { EndRow } from './EndRow'

/** How many bars the page writes, in two systems: the figure's first climbs (canvas v552). */
const OPENING_BARS = 4
const BARS_A_SYSTEM = 2
/** The column's width at which a staff space is the board's 12.3px (scale 1 draws 10), and the largest it grows to. */
const STAFF_WIDTH = 301
const MAX_SCALE = 1.3
/** How far one press of Tempo's − or + moves it. */
const TEMPO_STEP = 4

/** An exercise's page, before the Player (A41). */
export function ExercisePage() {
  const { exerciseId } = useParams({ from: '/shell/practice/exercises/$exerciseId' })
  return isExerciseId(exerciseId) ? (
    <ExerciseScreen key={exerciseId} exercise={exerciseOf(exerciseId)} />
  ) : null
}

/**
 * An exercise's page in the Chords page's shape (canvas 185, v552): the keys at the top with its
 * first position lit, its name with its ♡ and its group, its first four bars leading the page,
 * The exercise as one group (its Number, Hands, Rhythm, Next key, Octaves, Tempo and Target), How to
 * play in words, and one floating bar: Key (where it has one) · Start (the Player) · Listen.
 */
function ExerciseScreen({ exercise }: { exercise: Exercise }) {
  const { t } = useTranslation(['practice', 'player'])
  const locale = useLocale()
  const column = useRef<HTMLDivElement>(null)
  const { width } = useElementSize(column)
  useMarkPracticeUsed('exercises', exercise.id)
  const search = useSearch({ from: '/shell/practice/exercises/$exerciseId' })
  const setSearch = useSetSearch<ExercisePageSearch>()
  const { root, tonality, octaves, hanon, rhythm, order, target } = search
  const choice: ExerciseChoice = useMemo(
    () => exerciseChoice(exercise, { root, tonality, octaves, hanon, rhythm }),
    [exercise, root, tonality, octaves, hanon, rhythm],
  )
  const hands = exercise.options.bothHands ? 'both' : (search.hands ?? 'both')
  const performance = useMemo(() => arrangeExercise(exercise.id, choice), [exercise.id, choice])
  const shownHand: Hand = hands === 'lh' ? 'lh' : 'rh'
  const shown = useMemo(
    () => firstPosition(performance, shownHand, midiOf(choice.root, 4) % 12),
    [performance, shownHand, choice.root],
  )
  const systems = useMemo(
    () =>
      openingSystems(performance, OPENING_BARS, BARS_A_SYSTEM).map((system) => ({
        ...system,
        score: notate(system.music),
      })),
    [performance],
  )
  const shownBars = Math.min(OPENING_BARS, performance.bars.length)
  const group = t(`practice:exercises.groups.${exercise.group}`)
  const shelf = shelfOf(exercise.group)
  const source = shelf ? `${group} · ${t(`practice:exercises.shelves.${shelf}`)}` : group
  const reached = useProgress(selectTempo(tempoKey(exercise, choice)))
  const tempo = search.tempo ?? reached ?? exercise.tempo
  const name = exercise.fields.hanon
    ? t('player:exercise.hanon.name', { number: choice.hanon })
    : localText(exercise.name, locale)
  const musicKey = {
    tonic: choice.root,
    minor: exercise.fields.tonality === true && choice.tonality === 'minor',
  }
  // What the Player opens on, the same for Listen and Start.
  const playSearch = {
    root: noteParam(choice.root),
    ...(exercise.fields.tonality ? { tonality: choice.tonality } : {}),
    ...(exercise.fields.octaves ? { octaves: choice.octaves } : {}),
    ...(exercise.fields.hanon ? { hanon: choice.hanon } : {}),
    ...(exercise.fields.rhythm && choice.rhythm !== 'even' ? { rhythm: choice.rhythm } : {}),
    ...(order ? { order } : {}),
    hands,
    tempo,
    ...(target !== undefined && target > tempo ? { target, speedTraining: true } : {}),
  }
  return (
    <div className="flex flex-col gap-4">
      <ScreenHeader
        title={t('practice:exercisePage.title')}
        back={<BackButton />}
        settings={<PianoButton />}
      />
      <PinnedKeyboard
        shown={shown}
        place="top"
        // The board's keys round the first key: a fifth under it to a twelfth over on a phone, an
        // octave under to three over on a laptop.
        least={keysAround(Math.min(...shown.keys, 60), [5, 19], [12, 36])}
      />
      {/* One column, as the board's (canvas v552): its name with its ♡ and its book, then the score,
          which leads the page at reading size on the paper, then The exercise and How to play,
          each heading 24 under what is above it and 8 over its group. On a laptop the column is
          880 wide, centred. */}
      <div className="mx-auto flex w-full flex-col gap-4 lg:max-w-220 lg:gap-6 lg:pt-3">
        <div className="flex flex-col gap-4 lg:gap-5">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-0.5">
              <h2 className="subject-title">{name}</h2>
              <PracticeFavouriteButton kind="exercises" id={exercise.id} />
            </div>
            <p className="ms-0.5 text-[0.9375rem]/[normal] text-muted-foreground">{source}</p>
          </div>
          <figure className="mt-1 flex flex-col gap-2">
            {/* Each system spans the column, its staff the board's size (12.3 a space at 370, 13 at 880). */}
            <div ref={column} className="flex min-w-0 flex-col gap-2">
              {width > 0
                ? systems.map((system) => (
                    // the board's system: 138 tall, its staff 49 under its top (r68_exercise)
                    <div key={system.from} className="pt-2.5 pb-1">
                      <TappableStaff
                        music={system.music}
                        score={system.score}
                        staff={shownHand === 'lh' ? 'bass' : 'treble'}
                        scale={Math.min(MAX_SCALE, width / STAFF_WIDTH)}
                        fill={width}
                        firstBar={system.from + 1}
                        continues={system.from > 0}
                        bands={false}
                        tempo={tempo}
                      />
                    </div>
                  ))
                : null}
            </div>
            <figcaption className="text-[0.8125rem] leading-[normal] text-muted-foreground tabular-nums">
              {t('practice:exercisePage.bars', {
                last: shownBars,
                count: performance.bars.length,
              })}
            </figcaption>
          </figure>
        </div>
        <div className="mt-2 flex flex-col gap-6 lg:mt-0">
          <section className="flex min-w-0 flex-col gap-2">
            <h3 className="section-head">{t('practice:exercisePage.options')}</h3>
            <GroupRows surface="sheet">
              {exercise.fields.hanon ? (
                <GroupRow label={t('practice:exercisePage.number')}>
                  <Stepper
                    label={t('practice:exercisePage.number')}
                    value={choice.hanon}
                    min={Math.min(...HANON_NUMBERS)}
                    max={Math.max(...HANON_NUMBERS)}
                    step={1}
                    format={(number) => t('player:exercise.hanon.number', { number })}
                    onChange={(next) =>
                      setSearch({
                        hanon: HANON_NUMBERS.find((number) => number === next),
                        tempo: undefined,
                      })
                    }
                    decrease={t('practice:exercisePage.previous')}
                    increase={t('practice:exercisePage.next')}
                  />
                </GroupRow>
              ) : null}
              {exercise.options.bothHands ? null : (
                <EndRow label={t('practice:exercisePage.hands')}>
                  <HandsSegmented
                    label={t('practice:exercisePage.hands')}
                    value={hands}
                    onChange={(each) => setSearch({ hands: each })}
                  />
                </EndRow>
              )}
              {exercise.fields.rhythm ? (
                <EndRow label={t('player:exercise.rhythm.label')} width="wide">
                  <Segmented
                    label={t('player:exercise.rhythm.label')}
                    value={choice.rhythm}
                    options={HANON_RHYTHMS.map((each) => ({
                      value: each,
                      label: t(`player:exercise.rhythm.${each}`),
                    }))}
                    onChange={(each) => setSearch({ rhythm: each === 'even' ? undefined : each })}
                  />
                </EndRow>
              ) : null}
              {exercise.options.oneKey ? null : (
                <EndRow label={t('practice:exercisePage.order')}>
                  <Segmented
                    label={t('practice:exercisePage.order')}
                    value={order ?? 'fifths'}
                    options={(['fifths', 'chromatic'] as const).map((each) => ({
                      value: each,
                      label: t(`practice:exercisePage.orders.${each}`),
                    }))}
                    onChange={(each) =>
                      setSearch({ order: each === 'chromatic' ? each : undefined })
                    }
                  />
                </EndRow>
              )}
              {exercise.fields.octaves ? (
                <EndRow label={t('practice:exercisePage.octaves')}>
                  <Segmented
                    label={t('practice:exercisePage.octaves')}
                    value={choice.octaves}
                    options={exercise.fields.octaves.map((each) => ({
                      value: each,
                      label: String(each),
                    }))}
                    onChange={(each) => setSearch({ octaves: each })}
                  />
                </EndRow>
              ) : null}
              <GroupRow label={t('practice:exercisePage.tempo')}>
                <Stepper
                  label={t('practice:exercisePage.tempo')}
                  value={tempo}
                  min={TEMPO_RANGE.min}
                  max={TEMPO_RANGE.max}
                  step={TEMPO_STEP}
                  typed
                  format={(bpm) => t('practice:exercisePage.bpm', { bpm })}
                  onChange={(bpm) => setSearch({ tempo: bpm })}
                  decrease={t('practice:exercisePage.slower')}
                  increase={t('practice:exercisePage.faster')}
                />
              </GroupRow>
              {/* The tempo speed training climbs to, from the Tempo above: set, the Player starts it. */}
              <GroupRow label={t('practice:exercisePage.target')}>
                <Stepper
                  label={t('practice:exercisePage.target')}
                  value={Math.max(target ?? tempo, tempo)}
                  min={tempo}
                  max={TEMPO_RANGE.max}
                  step={TEMPO_STEP}
                  typed
                  format={(bpm) =>
                    bpm > tempo
                      ? t('practice:exercisePage.bpm', { bpm })
                      : t('practice:exercisePage.noTarget')
                  }
                  onChange={(bpm) => setSearch({ target: bpm > tempo ? bpm : undefined })}
                  decrease={t('practice:exercisePage.lowerTarget')}
                  increase={t('practice:exercisePage.raiseTarget')}
                />
              </GroupRow>
            </GroupRows>
          </section>
          <section className="flex flex-col gap-2">
            <h3 className="section-head">{t('practice:exercisePage.how')}</h3>
            <p className="card p-4 text-[0.9375rem] leading-[1.45] text-pretty">
              {localText(exercise.how, locale)}
            </p>
          </section>
        </div>
      </div>
      <FloatingActions>
        <FloatingPieces label={t('practice:transport')}>
          {exercise.options.oneKey ? (
            <span aria-hidden />
          ) : (
            <KeyPicker
              label={t('practice:exercisePage.key')}
              value={musicKey}
              onChange={(key) =>
                setSearch({
                  root: noteParam(key.tonic),
                  ...(exercise.fields.tonality ? { tonality: key.minor ? 'minor' : 'major' } : {}),
                  tempo: undefined,
                })
              }
              trigger={
                <FloatingPiece
                  label={`${t('practice:exercisePage.key')}: ${printedNote(choice.root)}`}
                  caption={t('practice:exercisePage.key')}
                  round
                  aria-haspopup="dialog"
                >
                  <span className="text-lg font-bold">{printedNote(choice.root)}</span>
                </FloatingPiece>
              }
            />
          )}
          <FloatingPlayLink
            label={t('practice:exercisePage.start')}
            render={
              <Link
                to="/play/exercise/$exerciseId"
                params={{ exerciseId: exercise.id }}
                search={{ ...playSearch, mode: 'wait' }}
              />
            }
          />
          <FloatingPieceLink
            label={t('practice:exercisePage.listen')}
            caption={t('practice:exercisePage.listen')}
            round
            render={
              <Link
                to="/play/exercise/$exerciseId"
                params={{ exerciseId: exercise.id }}
                search={{ ...playSearch, mode: 'listen' }}
              />
            }
          >
            <Volume2 aria-hidden />
          </FloatingPieceLink>
        </FloatingPieces>
      </FloatingActions>
    </div>
  )
}
