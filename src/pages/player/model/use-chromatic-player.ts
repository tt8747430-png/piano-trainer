import { useMemo } from 'react'
import { arrangeChromatic, CHROMATIC, type ChromaticChoice } from '@/features/practice'
import type { Performance } from '@/shared/lib/arrangement'
import type { FigureChange } from '@/widgets/player-setup'
import { usePracticePlayer, type PracticePlayer } from '@/widgets/practice-player'
import { chromaticChoice, chromaticPatch, type ChromaticSearch } from './chromatic-search'

export interface ChromaticPlayer {
  readonly choice: ChromaticChoice
  readonly performance: Performance
  readonly player: PracticePlayer
  changeSetup(change: FigureChange): void
}

/** The chromatic walk as the Player plays it: the URL's chords arranged, practised from the widget's hook. */
export function useChromaticPlayer(
  search: ChromaticSearch,
  setSearch: (patch: Partial<ChromaticSearch>) => void,
): ChromaticPlayer {
  const { chords, root, direction, pattern, rh, lh } = search
  const choice = useMemo(
    () => chromaticChoice({ chords, root, direction, pattern, rh, lh }),
    [chords, root, direction, pattern, rh, lh],
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
