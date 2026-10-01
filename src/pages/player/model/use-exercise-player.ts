import { useMemo } from 'react'
import { exerciseChoice, type ExerciseChoice, type RuleExercise } from '@/entities/exercise'
import { arrangeExercise } from '@/features/practice'
import { usePracticePlayer } from '@/widgets/practice-player'
import {
  exercisePatch,
  exerciseView,
  viewPatch,
  type ExerciseChange,
  type ExerciseSearch,
} from './exercise-search'
import type { PlayerOf } from './player-of'

/** An exercise as the Player plays it: its rule over the URL's choice, practised from the widget's hook. */
export function useExercisePlayer(
  exercise: RuleExercise,
  search: ExerciseSearch,
  setSearch: (patch: Partial<ExerciseSearch>) => void,
): PlayerOf<ExerciseChoice, ExerciseChange> {
  const {
    root,
    kind,
    octaves,
    start,
    fingering,
    quality,
    inversion,
    figure,
    voicing,
    from,
    tonality,
  } = search
  const choice = useMemo(
    () =>
      exerciseChoice(exercise, {
        root,
        kind,
        octaves,
        start,
        fingering,
        quality,
        inversion,
        figure,
        voicing,
        from,
        tonality,
      }),
    [
      exercise,
      root,
      kind,
      octaves,
      start,
      fingering,
      quality,
      inversion,
      figure,
      voicing,
      from,
      tonality,
    ],
  )
  const performance = useMemo(() => arrangeExercise(exercise.id, choice), [exercise.id, choice])
  const player = usePracticePlayer(
    performance,
    exerciseView(exercise, search),
    (patch) => setSearch(viewPatch(exercise, patch)),
    exercise.tempo,
  )
  return {
    choice,
    performance,
    player,
    changeSetup: (change) => setSearch(exercisePatch(exercise, change)),
  }
}
