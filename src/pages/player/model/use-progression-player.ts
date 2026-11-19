import { usePatternBook } from '@/entities/pattern'
import { useMemo } from 'react'
import { arrangeProgression, PROGRESSION, type ProgressionChoice } from '@/features/practice'
import { usePracticePlayer } from '@/widgets/practice-player'
import {
  progressionChoice,
  progressionFit,
  progressionPatch,
  type ProgressionChange,
  type ProgressionSearch,
} from './progression-search'
import type { PatternFit } from '@/entities/pattern'
import type { PlayerOf } from './player-of'

/** A progression as the Player plays it: the URL's numerals arranged in its key, practised from the widget's hook. */
export function useProgressionPlayer(
  search: ProgressionSearch,
  setSearch: (patch: Partial<ProgressionSearch>) => void,
): PlayerOf<ProgressionChoice, ProgressionChange> & { readonly fit: PatternFit } {
  const book = usePatternBook()
  const { p, key, pattern, rh, lh, inversion, nearest, chordSize, walk } = search
  const choice = useMemo(
    () => progressionChoice({ p, key, pattern, rh, lh, inversion, nearest, chordSize, walk }, book),
    [p, key, pattern, rh, lh, inversion, nearest, chordSize, walk, book],
  )
  const performance = useMemo(() => arrangeProgression(choice, book), [choice, book])
  const player = usePracticePlayer(performance, search, setSearch, PROGRESSION.tempo)
  return {
    choice,
    performance,
    player,
    fit: progressionFit(choice.walk),
    changeSetup: (change) => setSearch(progressionPatch(change)),
  }
}
