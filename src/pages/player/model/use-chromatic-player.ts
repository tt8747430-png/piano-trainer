import { useMemo } from 'react'
import { arrangeChromatic, CHROMATIC, type ChromaticChoice } from '@/features/practice'
import { usePracticePlayer } from '@/widgets/practice-player'
import {
  chromaticChoice,
  chromaticPatch,
  type ChromaticChange,
  type ChromaticSearch,
} from './chromatic-search'
import type { PlayerOf } from './player-of'

/** The chromatic walk as the Player plays it: the URL's chords arranged, practised from the widget's hook. */
export function useChromaticPlayer(
  search: ChromaticSearch,
  setSearch: (patch: Partial<ChromaticSearch>) => void,
): PlayerOf<ChromaticChoice, ChromaticChange> {
  const { chords, root, direction, pattern, rh, lh, inversion } = search
  const choice = useMemo(
    () => chromaticChoice({ chords, root, direction, pattern, rh, lh, inversion }),
    [chords, root, direction, pattern, rh, lh, inversion],
  )
  const performance = useMemo(() => arrangeChromatic(choice), [choice])
  const player = usePracticePlayer(performance, search, setSearch, CHROMATIC.tempo)
  return {
    choice,
    performance,
    player,
    changeSetup: (change) => setSearch(chromaticPatch(change)),
  }
}
