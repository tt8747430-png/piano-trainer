import { useMemo } from 'react'
import { arrangeWalk, WALK, type WalkChoice } from '@/features/practice'
import { usePracticePlayer } from '@/widgets/practice-player'
import { walkChoice, walkPatch, type WalkChange, type WalkSearch } from './walk-search'
import type { PlayerOf } from './player-of'

/** Walk the chords as the Player plays it: the URL's scale and choices arranged, practised from the widget's hook. */
export function useWalkPlayer(
  search: WalkSearch,
  setSearch: (patch: Partial<WalkSearch>) => void,
): PlayerOf<WalkChoice, WalkChange> {
  const { root, kind, pattern, rh, lh, chordSize } = search
  const choice = useMemo(
    () => walkChoice({ root, kind, pattern, rh, lh, chordSize }),
    [root, kind, pattern, rh, lh, chordSize],
  )
  const performance = useMemo(() => arrangeWalk(choice), [choice])
  const player = usePracticePlayer(performance, search, setSearch, WALK.tempo)
  return { choice, performance, player, changeSetup: (change) => setSearch(walkPatch(change)) }
}
