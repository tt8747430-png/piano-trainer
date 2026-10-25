import { usePatternBook } from '@/entities/pattern'
import { useEffect, useMemo } from 'react'
import { isLeadSheet, isOwnKey, pieceFit, usePieceHeadings, type Piece } from '@/entities/piece'
import { useProgressStoreApi } from '@/entities/progress'
import { selectPractice, useSettings } from '@/entities/settings'
import { arrangePiece, type PracticeChoice } from '@/features/practice'
import { recordPractised } from '@/features/record-practised'
import type { SetupChange } from '@/widgets/player-setup'
import { usePracticePlayer } from '@/widgets/practice-player'
import { resolveChoice, searchPatch, type PlayerSearch } from './player-search'
import type { WalkingPlayerOf } from './player-of'

/** The piece as the Player plays it (spec §2.1): its URL's choices arranged, practised from the widget's hook. */
export function usePlayer(
  piece: Piece,
  search: PlayerSearch,
  setSearch: (patch: Partial<PlayerSearch>) => void,
): WalkingPlayerOf<PracticeChoice, SetupChange> {
  const { tune: heard, recording: withRecording } = useSettings(selectPractice)
  // A lead sheet's tune is always heard: it is what its sheet shows (ADR 0083).
  const tune = heard || isLeadSheet(piece)
  const progress = useProgressStoreApi()
  const book = usePatternBook()
  const { key, pattern, rh, lh, inversion, nearest, chordSize } = search
  const choice = useMemo(
    () => resolveChoice(piece, { key, pattern, rh, lh, inversion, nearest, chordSize }, tune, book),
    [piece, key, pattern, rh, lh, inversion, nearest, chordSize, tune, book],
  )
  // The Player plays the repeats taken, the bars unrolled as they are played.
  const performance = useMemo(
    () => arrangePiece(piece, choice, book, { unfold: true }),
    [piece, choice, book],
  )
  const headings = usePieceHeadings(piece)
  useEffect(() => recordPractised(progress, piece.id, new Date()), [progress, piece.id])
  // The recording plays along in the piece's own key only: another would put the voice over other chords.
  const recording =
    piece.recording && withRecording && isOwnKey(piece, choice.tonic) ? piece.recording : null
  const player = usePracticePlayer(performance, search, setSearch, piece.tempo, recording)
  // Read once a piece: the Player renders each beat, and a fit reads the piece's chart.
  const fit = useMemo(() => pieceFit(piece), [piece])
  return {
    choice,
    performance,
    player,
    fit,
    headings,
    changeSetup: (change) => setSearch(searchPatch(piece, change)),
  }
}
