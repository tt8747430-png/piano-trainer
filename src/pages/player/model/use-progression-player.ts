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
import { useKeyName } from '@/shared/i18n'
import type { WalkingPlayerOf } from './player-of'
import { walkHeadings } from './walk-headings'

/** A progression as the Player plays it: the URL's numerals arranged in its key, practised from the widget's hook. */
export function useProgressionPlayer(
  search: ProgressionSearch,
  setSearch: (patch: Partial<ProgressionSearch>) => void,
): WalkingPlayerOf<ProgressionChoice, ProgressionChange> {
  const { p, key, pattern, rh, lh, inversion, chordSize, walk } = search
  const choice = useMemo(
    () => progressionChoice({ p, key, pattern, rh, lh, inversion, chordSize, walk }),
    [p, key, pattern, rh, lh, inversion, chordSize, walk],
  )
  const performance = useMemo(() => arrangeProgression(choice), [choice])
  const player = usePracticePlayer(performance, search, setSearch, PROGRESSION.tempo)
  const keyName = useKeyName()
  // Walked through the keys, each key's section is named by its key; in one, the line is unnamed.
  const headings = useMemo(
    () => (choice.walk ? walkHeadings(choice.key, choice.walk, keyName) : []),
    [choice.walk, choice.key, keyName],
  )
  return {
    choice,
    performance,
    player,
    fit: progressionFit(choice.walk),
    headings,
    changeSetup: (change) => setSearch(progressionPatch(change)),
  }
}
