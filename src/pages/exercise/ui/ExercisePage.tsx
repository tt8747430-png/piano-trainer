import { PracticeFavouriteButton } from '@/features/manage-practice-library'
import { Link, useParams, useSearch } from '@tanstack/react-router'
import { Volume2 } from 'lucide-react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import {
  exerciseChoice,
  exerciseOf,
  isExerciseId,
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
import { useSetSearch } from '@/shared/lib'
import { HANON_NUMBERS, HANON_RHYTHMS } from '@/shared/lib/exercise'
import { midiOf, noteParam, printedNote, type Hand } from '@/shared/lib/music'
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
  GroupSegmented,
  HandsSegmented,
  KeyPicker,
  ScreenHeader,
  Stepper,
} from '@/shared/ui'
import type { ExercisePageSearch } from '../model/exercise-page-search'
import { firstPosition } from '../model/first-position'
import { openingBars } from '../model/opening-bars'

/** How many bars the page's card writes: the figure's first climb. */
const OPENING_BARS = 2
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
 * An exercise's page in the Chords page's shape (canvas 185): the keys at the top with its first
 * position lit, its name with its ♡ and its book, its first bars on the staff with what it trains,
 * The exercise as one group (its Number, Hands, Rhythm, Next key, Octaves, Tempo and Target), How to
 * play in words, and one floating bar: Key (where it has one) · Start (the Player) · Listen.
 */
function ExerciseScreen({ exercise }: { exercise: Exercise }) {
  const { t } = useTranslation(['practice', 'player'])
  const locale = useLocale()
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
  const opening = useMemo(() => openingBars(performance, OPENING_BARS), [performance])
  const score = useMemo(() => notate(opening), [opening])
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
        back={<BackButton variant="glass" />}
        settings={<PianoButton />}
      />
      <PinnedKeyboard shown={shown} place="top" />
      {/* One grid: on a phone the title, the music, The exercise, How to play; on a laptop the
          exercise's rows stand at the right of the other three. */}
      <div className="flex flex-col gap-4 lg:grid lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:grid-rows-[auto_auto_auto_1fr] lg:items-start lg:gap-x-10 lg:gap-y-5">
        <div className="flex flex-col gap-1 lg:col-start-1">
          <div className="flex items-center gap-0.5">
            <h2 className="font-serif text-[2.25rem] leading-[1.1] font-bold tracking-[-0.02em] text-balance">
              {name}
            </h2>
            <PracticeFavouriteButton kind="exercises" id={exercise.id} />
          </div>
          <p className="ms-0.5 text-[0.9375rem] text-muted-foreground">
            {t(`practice:exercises.groups.${exercise.group}`)}
          </p>
        </div>
        <section className="flex flex-col gap-3 rounded-2xl lg:col-start-1 bg-card px-4 pt-4 pb-3.5 ring-1 ring-border">
          <div className="max-w-full overflow-x-auto overscroll-x-contain scrollbar-none">
            <TappableStaff
              music={opening}
              score={score}
              staff={shownHand === 'lh' ? 'bass' : 'treble'}
              tempo={tempo}
            />
          </div>
          <p className="mx-0.5 text-[0.8125rem] text-muted-foreground tabular-nums">
            {t('practice:exercisePage.bars', {
              last: opening.bars.length,
              count: performance.bars.length,
            })}
          </p>
          <p className="mx-1 text-[0.9375rem] leading-snug text-pretty text-muted-foreground">
            {localText(exercise.trains, locale)}
          </p>
        </section>
        <section className="flex min-w-0 flex-col gap-2 lg:col-start-2 lg:row-span-4 lg:row-start-1">
          <h3 className="ms-1 font-sans text-sm font-semibold text-foreground">
            {t('practice:exercisePage.options')}
          </h3>
          <GroupRows className="bg-card ring-1 ring-border">
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
              <HandsSegmented
                label={t('practice:exercisePage.hands')}
                value={hands}
                onChange={(each) => setSearch({ hands: each })}
                grouped
              />
            )}
            {exercise.fields.rhythm ? (
              <GroupSegmented
                label={t('player:exercise.rhythm.label')}
                value={choice.rhythm}
                options={HANON_RHYTHMS.map((each) => ({
                  value: each,
                  label: t(`player:exercise.rhythm.${each}`),
                }))}
                onChange={(each) => setSearch({ rhythm: each === 'even' ? undefined : each })}
              />
            ) : null}
            {exercise.options.oneKey ? null : (
              <GroupSegmented
                label={t('practice:exercisePage.order')}
                value={order ?? 'fifths'}
                options={(['fifths', 'chromatic'] as const).map((each) => ({
                  value: each,
                  label: t(`practice:exercisePage.orders.${each}`),
                }))}
                onChange={(each) => setSearch({ order: each === 'chromatic' ? each : undefined })}
              />
            )}
            {exercise.fields.octaves ? (
              <GroupSegmented
                label={t('practice:exercisePage.octaves')}
                value={choice.octaves}
                options={exercise.fields.octaves.map((each) => ({
                  value: each,
                  label: String(each),
                }))}
                onChange={(each) => setSearch({ octaves: each })}
              />
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
        <section className="flex flex-col gap-2 lg:col-start-1">
          <h3 className="ms-1 font-sans text-sm font-semibold text-foreground">
            {t('practice:exercisePage.how')}
          </h3>
          <p className="rounded-2xl bg-card px-4 py-3.5 text-[0.9375rem] leading-[1.45] text-pretty ring-1 ring-border">
            {localText(exercise.how, locale)}
          </p>
        </section>
      </div>
      <FloatingActions>
        <FloatingPieces label={t('practice:transport')}>
          {exercise.options.oneKey ? null : (
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
