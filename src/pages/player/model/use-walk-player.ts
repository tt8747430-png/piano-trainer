import { usePatternBook } from '@/entities/pattern'
import { useEffect, useMemo } from 'react'
import { useProgressStoreApi } from '@/entities/progress'
import { arrangeWalk, WALK, type WalkChoice } from '@/features/practice'
import { recordKeyPractised, usePracticeClock } from '@/features/record-practised'
import { keyParam, noteFromParam, scaleKey } from '@/shared/lib/music'
import { usePracticePlayer } from '@/widgets/practice-player'
import { walkChoice, walkPatch, type WalkChange, type WalkSearch } from './walk-search'
import type { PlayerOf } from './player-of'

/** Walk the chords as the Player plays it: the URL's scale and choices arranged, practised from the widget's hook. */
export function useWalkPlayer(
  search: WalkSearch,
  setSearch: (patch: Partial<WalkSearch>) => void,
): PlayerOf<WalkChoice, WalkChange> {
  const book = usePatternBook()
  const { root, kind, pattern, rh, lh, inversion, nearest, chordSize } = search
  const choice = useMemo(
    () => walkChoice({ root, kind, pattern, rh, lh, inversion, nearest, chordSize }, book),
    [root, kind, pattern, rh, lh, inversion, nearest, chordSize, book],
  )
  const performance = useMemo(() => arrangeWalk(choice, book), [choice, book])
  const player = usePracticePlayer(performance, search, setSearch, WALK.tempo)
  // Its key practised once its chords are played (Scale Master, B1), and the time it is played.
  const progress = useProgressStoreApi()
  const { playing } = player.practice.state
  usePracticeClock(playing)
  useEffect(() => {
    if (playing)
      recordKeyPractised(progress, keyParam(scaleKey(noteFromParam(root), kind)), new Date())
  }, [playing, progress, root, kind])
  return { choice, performance, player, changeSetup: (change) => setSearch(walkPatch(change)) }
}
