import { useParams, useSearch } from '@tanstack/react-router'
import { ChevronRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { isExerciseId, exerciseOf, type ExerciseChoice, type Exercise } from '@/entities/exercise'
import { useProgressStoreApi } from '@/entities/progress'
import { recordExercised } from '@/features/record-practised'
import { localText, useKeyName, useLocale, useScaleName } from '@/shared/i18n'
import { useUp, useSetSearch } from '@/shared/lib'
import { pitchClassOf, printedChord, type SpelledNote } from '@/shared/lib/music'
import { exercisePatch, type ExerciseSearch } from '../model/exercise-search'
import { nextKey } from '../model/next-key'
import { useExercisePlayer } from '../model/use-exercise-player'
import { HandsSegmented, Labelled, Segmented } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { SettingsSheet } from '@/widgets/player-setup'
import { PlayingSection } from '@/widgets/practice-player'
import { SheetMusic, type SheetViewChoice } from '@/widgets/sheet-music'
import { ExerciseMusicFields } from './ExerciseMusicFields'
import { ExerciseWayFields } from './ExerciseWayFields'
import { RunLayout } from './RunLayout'
import { ScalePracticeFields } from './ScalePracticeFields'

/**
 * What an exercise is played on, as its title says it: its scale, its chord (printed as the sheets
 * print it) or its key.
 */
function useExerciseOf(exercise: Exercise, choice: ExerciseChoice): string {
  const scaleName = useScaleName()
  const keyName = useKeyName()
  switch (exercise.fields.root) {
    case 'scale':
      return scaleName(choice.root, choice.kind)
    case 'chord':
      return printedChord({ root: choice.root, quality: choice.quality })
    case 'key':
      return keyName({ tonic: choice.root, minor: choice.tonality === 'minor' })
  }
}

/** An exercise's line on the paper: its music in lines, as the run boards' (`PV_RUN`). */
const RUN_SHEET: SheetViewChoice = {
  layout: 'vertical',
  chordNames: false,
  lyrics: false,
  hidden: [],
}
/** An exercise's line has no sections. */
const NO_HEADINGS: readonly string[] = []

/** A key's place, from 1, in the round Next key walks from C: by fifths (C G D …) or by half steps. */
const keyPlace = (root: SpelledNote, order?: 'chromatic') =>
  ((pitchClassOf(root) * (order === 'chromatic' ? 1 : 7)) % 12) + 1

/** An exercise in the run view: its rule's line engraved in the learner's key and choices, its keys round the circle. */
export function ExercisePlayerPage() {
  const { exerciseId } = useParams({ from: '/shell/play/exercise/$exerciseId' })
  return isExerciseId(exerciseId) ? (
    <ExerciseScreen key={exerciseId} exercise={exerciseOf(exerciseId)} />
  ) : null
}

function ExerciseScreen({ exercise }: { exercise: Exercise }) {
  const { t } = useTranslation('player')
  const { t: tp } = useTranslation('practice')
  const [page, setPage] = useState('main')
  const locale = useLocale()
  const search = useSearch({ from: '/shell/play/exercise/$exerciseId' })
  const close = useUp()
  const setSearch = useSetSearch<ExerciseSearch>()
  const { choice, performance, player, view, changeSetup } = useExercisePlayer(
    exercise,
    search,
    setSearch,
  )
  const of = useExerciseOf(exercise, choice)
  // After each pass (its music played to its end or stopped), Next key moves round the circle of
  // fifths or up a half step as the exercise's page chose, at the tempo that key last reached (A41).
  const { playing } = player.practice.state
  const [passed, setPassed] = useState(false)
  const [wasPlaying, setWasPlaying] = useState(playing)
  if (wasPlaying !== playing) {
    setWasPlaying(playing)
    if (!playing) setPassed(true)
  }
  // A pass played ticks the exercise's row for the day (A41).
  const progress = useProgressStoreApi()
  useEffect(() => {
    if (passed) recordExercised(progress, exercise.id, new Date())
  }, [passed, progress, exercise.id])
  const goOn =
    passed && !playing && !exercise.options.oneKey
      ? () => {
          setPassed(false)
          const minor = exercise.fields.tonality === true && choice.tonality === 'minor'
          setSearch({
            ...exercisePatch(exercise, { root: nextKey(choice.root, minor, search.order) }),
            tempo: undefined,
          })
        }
      : null
  // Where it stands: the key's place in the round Next key walks from C (Key 1 of 12); one key, none.
  const place = exercise.options.oneKey
    ? null
    : { unit: 'key' as const, at: keyPlace(choice.root, search.order), of: 12 }
  return (
    <RunLayout
      title={t('exercise.title', {
        name: exercise.fields.hanon
          ? t('exercise.hanon.name', { number: choice.hanon })
          : localText(exercise.name, locale),
        of,
      })}
      onClose={close}
      view={view}
      player={player}
      performance={performance}
      keys={1}
      place={place}
      tempoInfo={{ name: t('tempoLadder.label'), text: t('tempoLadder.info') }}
      music={
        // Two lines in sight, the playhead bringing its line, as the run boards' two lines of bars.
        <div className="h-80 w-full [--float-room:0px] lg:h-68">
          <SheetMusic
            view={RUN_SHEET}
            title=""
            performance={performance}
            headings={NO_HEADINGS}
            current={player.practice.state.beatGroup}
            loop={player.loop}
            playing={playing}
            fingers={player.fingers}
            names={player.names}
            positions={player.positions}
            muted={player.muted}
            onJump={player.practice.jumpToBeatGroup}
            onLoopChange={player.setLoop}
          />
        </div>
      }
      next={
        goOn ? (
          <Button variant="link" className="shrink-0 px-0 text-sm" onClick={goOn}>
            {t('exercise.nextKey')}
            <ChevronRight data-icon="inline-end" aria-hidden />
          </Button>
        ) : null
      }
      setup={
        <>
          <ExerciseMusicFields exercise={exercise} choice={choice} onChange={changeSetup} />
          <ExerciseWayFields exercise={exercise} choice={choice} onChange={changeSetup} />
          {exercise.fields.handOctaves ? (
            <ScalePracticeFields
              choice={choice}
              player={player}
              hands={view.hands}
              onChange={changeSetup}
            />
          ) : (
            <Labelled label={tp('exercisePage.hands')}>
              <HandsSegmented
                label={tp('exercisePage.hands')}
                value={view.hands}
                onChange={player.setHands}
                painted
              />
            </Labelled>
          )}
          {exercise.options.oneKey ? null : (
            <Labelled label={tp('exercisePage.order')}>
              <Segmented
                label={tp('exercisePage.order')}
                value={search.order ?? 'fifths'}
                options={(['fifths', 'chromatic'] as const).map((each) => ({
                  value: each,
                  label: tp(`exercisePage.orders.${each}`),
                }))}
                onChange={(each) => setSearch({ order: each === 'chromatic' ? each : undefined })}
              />
            </Labelled>
          )}
        </>
      }
      settings={
        <SettingsSheet page={page} onPage={setPage}>
          <PlayingSection swing={view.swing} onSwing={player.setSwing} />
        </SettingsSheet>
      }
    />
  )
}
