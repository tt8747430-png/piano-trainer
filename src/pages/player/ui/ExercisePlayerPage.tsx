import { useParams, useSearch } from '@tanstack/react-router'
import { SkipForward } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { isExerciseId, exerciseOf, type ExerciseChoice, type Exercise } from '@/entities/exercise'
import { localText, useKeyName, useLocale, useScaleName } from '@/shared/i18n'
import { useUp, useSetSearch } from '@/shared/lib'
import { printedChord } from '@/shared/lib/music'
import { exercisePatch, type ExerciseSearch } from '../model/exercise-search'
import { nextKey } from '../model/next-key'
import { useExercisePlayer } from '../model/use-exercise-player'
import { Button } from '@/shared/ui/primitives/button'
import { ExerciseSetup } from './ExerciseSetup'
import { PlayerLayout } from './PlayerLayout'

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

/** An exercise in the Player: its rule's line in the learner's key and choices, sheet music and all. */
export function ExercisePlayerPage() {
  const { exerciseId } = useParams({ from: '/full-screen/play/exercise/$exerciseId' })
  return isExerciseId(exerciseId) ? (
    <ExerciseScreen key={exerciseId} exercise={exerciseOf(exerciseId)} />
  ) : null
}

function ExerciseScreen({ exercise }: { exercise: Exercise }) {
  const { t } = useTranslation('player')
  const locale = useLocale()
  const search = useSearch({ from: '/full-screen/play/exercise/$exerciseId' })
  const close = useUp()
  const setSearch = useSetSearch<ExerciseSearch>()
  const { choice, performance, player, view, changeSetup } = useExercisePlayer(
    exercise,
    search,
    setSearch,
  )
  const of = useExerciseOf(exercise, choice)
  // After each pass (its music played to its end or stopped), Next key moves round the circle of
  // fifths, at the tempo that key last reached (A41).
  const { playing } = player.practice.state
  const [passed, setPassed] = useState(false)
  const [wasPlaying, setWasPlaying] = useState(playing)
  if (wasPlaying !== playing) {
    setWasPlaying(playing)
    if (!playing) setPassed(true)
  }
  const goOn =
    passed && !playing && !exercise.options.oneKey
      ? () => {
          setPassed(false)
          const minor = exercise.fields.tonality === true && choice.tonality === 'minor'
          setSearch({
            ...exercisePatch(exercise, { root: nextKey(choice.root, minor) }),
            tempo: undefined,
          })
        }
      : null
  return (
    <PlayerLayout
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
      status={
        goOn ? (
          <Button variant="soft" size="pill" onClick={goOn}>
            {t('exercise.nextKey')}
            <SkipForward data-icon="inline-end" aria-hidden />
          </Button>
        ) : null
      }
      setup={
        <ExerciseSetup
          exercise={exercise}
          choice={choice}
          player={player}
          hands={view.hands}
          swing={view.swing}
          onChange={changeSetup}
          onSwing={player.setSwing}
        />
      }
    />
  )
}
