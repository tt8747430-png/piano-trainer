import { Link, useParams, useSearch } from '@tanstack/react-router'
import { Play } from 'lucide-react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import {
  exerciseChoice,
  exerciseOf,
  isExerciseId,
  tempoKey,
  type Exercise,
  type ExerciseChoice,
  HANON_TRAINS,
} from '@/entities/exercise'
import { selectTempo, useProgress } from '@/entities/progress'
import { arrangeExercise } from '@/features/practice'
import { localText, useLocale } from '@/shared/i18n'
import { useSetSearch } from '@/shared/lib'
import { HANON_NUMBERS } from '@/shared/lib/exercise'
import { noteParam, printedNote, type Hand } from '@/shared/lib/music'
import { HANDS, TEMPO_RANGE } from '@/shared/lib/schedule'
import {
  BackButton,
  Dropdown,
  FabLink,
  FloatingActions,
  HandCard,
  Labelled,
  NamedSegmented,
  KeyPicker,
  ScreenHeader,
  Stepper,
} from '@/shared/ui'
import type { ExercisePageSearch } from '../model/exercise-page-search'
import { firstPosition } from '../model/first-position'

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
 * What it trains, how to play it with its fingering's picture, then what to start it at: its Key
 * (none for an exercise that runs through every key), its Hands (none for one written for both),
 * its Octaves where it has them and its Tempo, the tempo it reached in that key where it has one.
 * Start, the capsule's primary, opens it in the Player.
 */
function ExerciseScreen({ exercise }: { exercise: Exercise }) {
  const { t } = useTranslation(['practice', 'player'])
  const locale = useLocale()
  const search = useSearch({ from: '/shell/practice/exercises/$exerciseId' })
  const setSearch = useSetSearch<ExercisePageSearch>()
  const { root, tonality, octaves, hanon, order, target } = search
  const choice: ExerciseChoice = useMemo(
    () => exerciseChoice(exercise, { root, tonality, octaves, hanon }),
    [exercise, root, tonality, octaves, hanon],
  )
  const hands = exercise.options.bothHands ? 'both' : (search.hands ?? 'both')
  const performance = useMemo(() => arrangeExercise(exercise.id, choice), [exercise.id, choice])
  const shownHand: Hand = hands === 'lh' ? 'lh' : 'rh'
  const position = useMemo(() => firstPosition(performance, shownHand), [performance, shownHand])
  const reached = useProgress(selectTempo(tempoKey(exercise, choice)))
  const tempo = search.tempo ?? reached ?? exercise.tempo
  const name = exercise.fields.hanon
    ? t('player:exercise.hanon.name', { number: choice.hanon })
    : localText(exercise.name, locale)
  const handName =
    shownHand === 'rh' ? t('practice:exercisePage.rh') : t('practice:exercisePage.lh')
  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader title={name} back={<BackButton />} />
      <section aria-labelledby="exercise-trains" className="flex flex-col gap-2">
        <h2 id="exercise-trains" className="text-xl">
          {t('practice:exercisePage.trains')}
        </h2>
        <p className="max-w-prose text-pretty">{localText(exercise.trains, locale)}</p>
      </section>
      <section aria-labelledby="exercise-how" className="flex flex-col gap-3">
        <h2 id="exercise-how" className="text-xl">
          {t('practice:exercisePage.how')}
        </h2>
        <p className="max-w-prose text-pretty">{localText(exercise.how, locale)}</p>
        {position.length > 0 ? (
          <HandCard
            hand={shownHand}
            notes={position}
            label={`${handName}: ${position
              .map(({ key, finger }) => {
                const spelled = performance.notes.find((each) => each.midi === key)?.spelled
                return `${spelled ? printedNote(spelled) : key} ${finger}`
              })
              .join(', ')}`}
            className="w-full max-w-56 self-start"
          />
        ) : null}
      </section>
      <section aria-labelledby="exercise-options" className="flex flex-col gap-4">
        <h2 id="exercise-options" className="text-xl">
          {t('practice:exercisePage.options')}
        </h2>
        {exercise.fields.hanon ? (
          <Labelled label={t('player:exercise.hanon.label')}>
            <Dropdown
              bare
              label={t('player:exercise.hanon.label')}
              value={choice.hanon}
              options={HANON_NUMBERS.map((number) => ({
                value: number,
                label: t('player:exercise.hanon.number', { number }),
                detail: localText(HANON_TRAINS[number], locale),
              }))}
              onChange={(next) => setSearch({ hanon: next, tempo: undefined })}
              className="w-full"
            />
          </Labelled>
        ) : null}
        {exercise.options.oneKey ? null : (
          <Labelled label={t('practice:exercisePage.key')}>
            <KeyPicker
              bare
              label={t('practice:exercisePage.key')}
              value={{
                tonic: choice.root,
                minor: exercise.fields.tonality === true && choice.tonality === 'minor',
              }}
              onChange={(key) =>
                setSearch({
                  root: noteParam(key.tonic),
                  ...(exercise.fields.tonality ? { tonality: key.minor ? 'minor' : 'major' } : {}),
                  tempo: undefined,
                })
              }
            />
          </Labelled>
        )}
        {exercise.options.oneKey ? null : (
          <NamedSegmented
            label={t('practice:exercisePage.order')}
            value={order ?? 'fifths'}
            options={(['fifths', 'chromatic'] as const).map((each) => ({
              value: each,
              label: t(`practice:exercisePage.orders.${each}`),
            }))}
            onChange={(each) => setSearch({ order: each === 'chromatic' ? each : undefined })}
          />
        )}
        {exercise.options.bothHands ? null : (
          <NamedSegmented
            label={t('practice:exercisePage.hands')}
            value={hands}
            options={HANDS.map((each) => ({
              value: each,
              label: t(`player:modes.hands.${each}`),
            }))}
            onChange={(each) => setSearch({ hands: each })}
          />
        )}
        {exercise.fields.octaves ? (
          <NamedSegmented
            label={t('practice:exercisePage.octaves')}
            value={choice.octaves}
            options={exercise.fields.octaves.map((each) => ({ value: each, label: String(each) }))}
            onChange={(each) => setSearch({ octaves: each })}
          />
        ) : null}
        <Labelled label={t('practice:exercisePage.tempo')}>
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
        </Labelled>
        {/* The tempo speed training climbs to, from the Tempo above: set, the Player starts it. */}
        <Labelled label={t('practice:exercisePage.target')}>
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
        </Labelled>
      </section>
      <FloatingActions>
        <FabLink
          extended
          label={t('practice:exercisePage.start')}
          icon={Play}
          render={
            <Link
              to="/play/exercise/$exerciseId"
              params={{ exerciseId: exercise.id }}
              search={{
                root: noteParam(choice.root),
                ...(exercise.fields.tonality ? { tonality: choice.tonality } : {}),
                ...(exercise.fields.octaves ? { octaves: choice.octaves } : {}),
                ...(exercise.fields.hanon ? { hanon: choice.hanon } : {}),
                ...(order ? { order } : {}),
                hands,
                tempo,
                ...(target !== undefined && target > tempo ? { target, speedTraining: true } : {}),
              }}
            />
          }
        />
      </FloatingActions>
    </div>
  )
}
