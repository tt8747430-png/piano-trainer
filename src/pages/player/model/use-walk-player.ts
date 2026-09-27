import { useMemo } from 'react'
import { arrangeWalk, WALK, type WalkChoice } from '@/features/practice'
import type { Performance } from '@/shared/lib/arrangement'
import { usePracticePlayer, type PracticePlayer } from '@/widgets/practice-player'
import { walkChoice, walkPatch, type WalkChange, type WalkSearch } from './walk-search'

export interface WalkPlayer {
  readonly choice: WalkChoice
  readonly performance: Performance
  readonly player: PracticePlayer
  changeSetup(change: WalkChange): void
}

/** Walk the chords as the Player plays it: the URL's scale and choices arranged, practised from the widget's hook. */
export function useWalkPlayer(
  search: WalkSearch,
  setSearch: (patch: Partial<WalkSearch>) => void,
): WalkPlayer {
  const { root, kind, pattern, rh, lh, chordSize } = search
  const choice = useMemo(
    () => walkChoice({ root, kind, pattern, rh, lh, chordSize }),
    [root, kind, pattern, rh, lh, chordSize],
  )
  const performance = useMemo(() => arrangeWalk(choice), [choice])
  const player = usePracticePlayer(performance, search, setSearch, WALK.tempo)
  return { choice, performance, player, changeSetup: (change) => setSearch(walkPatch(change)) }
}
