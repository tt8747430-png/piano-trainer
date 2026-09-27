import { useEffect, useMemo } from 'react'
import type { Piece } from '@/entities/piece'
import { useProgressStoreApi } from '@/entities/progress'
import { selectPractice, useSettings } from '@/entities/settings'
import { arrangePiece, type PracticeChoice } from '@/features/practice'
import { recordPractised } from '@/features/record-practised'
import type { Performance } from '@/shared/lib/arrangement'
import type { SetupChange } from '@/widgets/player-setup'
import { usePracticePlayer, type PracticePlayer } from '@/widgets/practice-player'
import { resolveChoice, searchPatch, type PlayerSearch } from './player-search'

export interface Player {
  readonly choice: PracticeChoice
  readonly performance: Performance
  readonly player: PracticePlayer
  changeSetup(change: SetupChange): void
}

/** The piece as the Player plays it (spec §2.1): its URL's choices arranged, practised from the widget's hook. */
export function usePlayer(
  piece: Piece,
  search: PlayerSearch,
  setSearch: (patch: Partial<PlayerSearch>) => void,
): Player {
  const { melody } = useSettings(selectPractice)
  const progress = useProgressStoreApi()
  const { key, pattern, rh, lh, chordSize } = search
  const choice = useMemo(
    () => resolveChoice(piece, { key, pattern, rh, lh, chordSize }, melody),
    [piece, key, pattern, rh, lh, chordSize, melody],
  )
  const performance = useMemo(() => arrangePiece(piece, choice), [piece, choice])
  useEffect(() => recordPractised(progress, piece.id, new Date()), [progress, piece.id])
  const player = usePracticePlayer(performance, search, setSearch, piece.tempo)
  return {
    choice,
    performance,
    player,
    changeSetup: (change) => setSearch(searchPatch(piece, change)),
  }
}
