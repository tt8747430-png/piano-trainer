import { useMemo } from 'react'
import { exerciseChoice, type ExerciseChoice, type RuleExercise } from '@/entities/exercise'
import { arrangeExercise } from '@/features/practice'
import { usePracticePlayer, type PracticeView } from '@/widgets/practice-player'
import {
  exercisePatch,
  exerciseView,
  viewPatch,
  type ExerciseChange,
  type ExerciseSearch,
} from './exercise-search'
import type { PlayerOf } from './player-of'

/**
 * An exercise as the Player plays it: its rule over the URL's choice, practised from the widget's hook,
 * and the Player's view (the exercise's own swing where the URL names none).
 */
export function useExercisePlayer(
  exercise: RuleExercise,
  search: ExerciseSearch,
  setSearch: (patch: Partial<ExerciseSearch>) => void,
): PlayerOf<ExerciseChoice, ExerciseChange> & { readonly view: PracticeView } {
  // Each choice by itself, so a change of tempo or hands keeps the same choice and its music.
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
  const view = exerciseView(exercise, search)
  const player = usePracticePlayer(
    performance,
    view,
    (patch) => setSearch(viewPatch(exercise, patch)),
    exercise.tempo,
  )
  return {
    choice,
    performance,
    player,
    view,
    changeSetup: (change) => setSearch(exercisePatch(exercise, change)),
  }
}
