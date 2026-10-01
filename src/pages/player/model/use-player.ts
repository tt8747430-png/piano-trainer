import { useEffect, useMemo } from 'react'
import { isOwnKey, pieceKey, usePieceHeadings, type Piece } from '@/entities/piece'
import { useProgressStoreApi } from '@/entities/progress'
import { selectPractice, useSettings } from '@/entities/settings'
import { arrangePiece, type PracticeChoice } from '@/features/practice'
import { recordPractised } from '@/features/record-practised'
import type { SetupChange } from '@/widgets/player-setup'
import { usePracticePlayer } from '@/widgets/practice-player'
import { useKeyName } from '@/shared/i18n'
import { choiceFit, resolveChoice, searchPatch, type PlayerSearch } from './player-search'
import type { WalkingPlayerOf } from './player-of'
import { walkHeadings } from './walk-headings'

/** The piece as the Player plays it (spec §2.1): its URL's choices arranged, practised from the widget's hook. */
export function usePlayer(
  piece: Piece,
  search: PlayerSearch,
  setSearch: (patch: Partial<PlayerSearch>) => void,
): WalkingPlayerOf<PracticeChoice, SetupChange> {
  const { melody, recording: withRecording } = useSettings(selectPractice)
  const progress = useProgressStoreApi()
  const { key, pattern, rh, lh, inversion, chordSize, walk } = search
  const choice = useMemo(
    () => resolveChoice(piece, { key, pattern, rh, lh, inversion, chordSize, walk }, melody),
    [piece, key, pattern, rh, lh, inversion, chordSize, walk, melody],
  )
  const performance = useMemo(() => arrangePiece(piece, choice), [piece, choice])
  const ownHeadings = usePieceHeadings(piece)
  const keyName = useKeyName()
  const { minor } = pieceKey(piece)
  // Walked through the keys, each key's section is named by its key.
  const headings = useMemo(
    () =>
      choice.walk
        ? walkHeadings({ tonic: choice.tonic, minor }, choice.walk, keyName)
        : ownHeadings,
    [choice.walk, choice.tonic, minor, keyName, ownHeadings],
  )
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
    fit: choiceFit(piece, choice.walk),
    headings,
    changeSetup: (change) => setSearch(searchPatch(piece, change)),
  }
}
