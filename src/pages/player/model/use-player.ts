import { useEffect, useMemo } from 'react'
import { isOwnKey, type Piece } from '@/entities/piece'
import { useProgressStoreApi } from '@/entities/progress'
import { selectPractice, useSettings } from '@/entities/settings'
import { arrangePiece, type PracticeChoice } from '@/features/practice'
import { recordPractised } from '@/features/record-practised'
import type { SetupChange } from '@/widgets/player-setup'
import { usePracticePlayer } from '@/widgets/practice-player'
import { resolveChoice, searchPatch, type PlayerSearch } from './player-search'
import type { PlayerOf } from './player-of'

/** The piece as the Player plays it (spec §2.1): its URL's choices arranged, practised from the widget's hook. */
export function usePlayer(
  piece: Piece,
  search: PlayerSearch,
  setSearch: (patch: Partial<PlayerSearch>) => void,
): PlayerOf<PracticeChoice, SetupChange> {
  const { melody, recording: withRecording } = useSettings(selectPractice)
  const progress = useProgressStoreApi()
  const { key, pattern, rh, lh, inversion, chordSize, walk } = search
  const choice = useMemo(
    () => resolveChoice(piece, { key, pattern, rh, lh, inversion, chordSize, walk }, melody),
    [piece, key, pattern, rh, lh, inversion, chordSize, walk, melody],
  )
  const performance = useMemo(() => arrangePiece(piece, choice), [piece, choice])
  useEffect(() => recordPractised(progress, piece.id, new Date()), [progress, piece.id])
  // The recording plays along in the piece's own key only: another, or a walk of keys, would put the
  // voice over other chords.
  const recording =
    piece.recording && withRecording && isOwnKey(piece, choice.tonic) && !choice.walk
      ? piece.recording
      : null
  const player = usePracticePlayer(performance, search, setSearch, piece.tempo, recording)
  return {
    choice,
    performance,
    player,
    changeSetup: (change) => setSearch(searchPatch(piece, change)),
  }
}
