import { useMemo } from 'react'
import { arrangeProgression, PROGRESSION, type ProgressionChoice } from '@/features/practice'
import { usePracticePlayer } from '@/widgets/practice-player'
import {
  progressionChoice,
  progressionPatch,
  type ProgressionChange,
  type ProgressionSearch,
} from './progression-search'
import type { PlayerOf } from './player-of'

/** A progression as the Player plays it: the URL's numerals arranged in its key, practised from the widget's hook. */
export function useProgressionPlayer(
  search: ProgressionSearch,
  setSearch: (patch: Partial<ProgressionSearch>) => void,
): PlayerOf<ProgressionChoice, ProgressionChange> {
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
