import { useParams, useSearch } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { isExerciseId, exerciseOf, type ExerciseChoice, type Exercise } from '@/entities/exercise'
import { localText, useKeyName, useLocale, useScaleName } from '@/shared/i18n'
import { useGoBack, useViewChange } from '@/shared/lib'
import { chordSymbol } from '@/shared/lib/music'
import type { ExerciseSearch } from '../model/exercise-search'
import { useExercisePlayer } from '../model/use-exercise-player'
import { ExerciseSetup } from './ExerciseSetup'
import { PlayerLayout } from './PlayerLayout'

/** What an exercise is played on, as its title says it: its scale, its chord or its key. */
function useExerciseOf(exercise: Exercise, choice: ExerciseChoice): string {
  const scaleName = useScaleName()
  const keyName = useKeyName()
  switch (exercise.fields.root) {
    case 'scale':
      return scaleName(choice.root, choice.kind)
    case 'chord':
      return chordSymbol({ root: choice.root, quality: choice.quality })
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
  const close = useGoBack({ to: '/practice' })
  const setSearch = useViewChange<ExerciseSearch>()
  const { choice, performance, player, view, changeSetup } = useExercisePlayer(
    exercise,
    search,
    setSearch,
  )
  const of = useExerciseOf(exercise, choice)
  return (
    <PlayerLayout
      title={t('exercise.title', { name: localText(exercise.name, locale), of })}
      onClose={close}
      view={view}
      player={player}
      performance={performance}
      setup={
        <ExerciseSetup
          exercise={exercise}
          choice={choice}
          swing={view.swing}
          onChange={changeSetup}
          onSwing={player.setSwing}
        />
      }
    />
  )
}
