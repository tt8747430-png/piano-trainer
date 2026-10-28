import { useMemo } from 'react'
import { exerciseChoice, tempoKey, type ExerciseChoice, type Exercise } from '@/entities/exercise'
import { selectTempo, useProgress, useProgressStoreApi } from '@/entities/progress'
import { keepTempo } from '@/features/keep-tempo'
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
 * and the Player's view (the exercise's own swing where the URL names none). It opens at its last
 * tempo, and each tempo chosen is kept as its last.
 */
export function useExercisePlayer(
  exercise: Exercise,
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
    hanon,
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
        hanon,
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
      hanon,
    ],
  )
  const performance = useMemo(() => arrangeExercise(exercise.id, choice), [exercise.id, choice])
  const view = exerciseView(exercise, search)
  // It opens at the tempo it was last played at, so its ladder goes on from the rung it reached.
  const progress = useProgressStoreApi()
  const kept = tempoKey(exercise, choice)
  const ownTempo = useProgress(selectTempo(kept)) ?? exercise.tempo
  const player = usePracticePlayer(
    performance,
    view,
    (patch) => {
      if (patch.tempo !== undefined) keepTempo(progress, kept, patch.tempo)
      setSearch(viewPatch(exercise, patch))
    },
    ownTempo,
  )
  return {
    choice,
    performance,
    player,
    view,
    changeSetup: (change) => setSearch(exercisePatch(exercise, change)),
  }
}
