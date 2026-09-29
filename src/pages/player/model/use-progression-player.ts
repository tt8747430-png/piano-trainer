import { useMemo } from 'react'
import { arrangeProgression, PROGRESSION, type ProgressionChoice } from '@/features/practice'
import type { Performance } from '@/shared/lib/arrangement'
import { usePracticePlayer, type PracticePlayer } from '@/widgets/practice-player'
import {
  progressionChoice,
  progressionPatch,
  type ProgressionChange,
  type ProgressionSearch,
} from './progression-search'

export interface ProgressionPlayer {
  readonly choice: ProgressionChoice
  readonly performance: Performance
  readonly player: PracticePlayer
  changeSetup(change: ProgressionChange): void
}

/** A progression as the Player plays it: the URL's numerals arranged in its key, practised from the widget's hook. */
export function useProgressionPlayer(
  search: ProgressionSearch,
  setSearch: (patch: Partial<ProgressionSearch>) => void,
): ProgressionPlayer {
  const { p, key, pattern, rh, lh, chordSize } = search
  const choice = useMemo(
    () => progressionChoice({ p, key, pattern, rh, lh, chordSize }),
    [p, key, pattern, rh, lh, chordSize],
  )
  const performance = useMemo(() => arrangeProgression(choice), [choice])
  const player = usePracticePlayer(performance, search, setSearch, PROGRESSION.tempo)
  return {
    choice,
    performance,
    player,
    changeSetup: (change) => setSearch(progressionPatch(change)),
  }
}
