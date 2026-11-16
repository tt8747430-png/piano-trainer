import { useEffect, useMemo, useRef } from 'react'
import {
  CLEAN_TO_CLIMB,
  exerciseChoice,
  rungAbove,
  rungBelow,
  tempoKey,
  type ExerciseChoice,
  type Exercise,
} from '@/entities/exercise'
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
  // The ladder climbs by itself (its ⓘ's promise; the research's item 5): a rung up after four
  // clean Wait-mode passes in a row, a rung down after a pass with a slip.
  const { passes, lastPassClean } = player.practice.state
  const cleanRun = useRef(0)
  const counted = useRef(passes)
  useEffect(() => {
    if (passes === counted.current) return
    counted.current = passes
    if (lastPassClean === false) {
      cleanRun.current = 0
      player.setTempo(rungBelow(player.tempo))
      return
    }
    cleanRun.current += 1
    if (cleanRun.current < CLEAN_TO_CLIMB) return
    cleanRun.current = 0
    player.setTempo(rungAbove(player.tempo))
  }, [passes, lastPassClean, player])
  return {
    choice,
    performance,
    player,
    view,
    changeSetup: (change) => setSearch(exercisePatch(exercise, change)),
  }
}
