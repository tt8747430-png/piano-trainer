import { useMemo } from 'react'
import { BUILT_IN_PATTERNS } from '@/entities/pattern'
import { PieceFactLine, usePieceHeadings, type ChartPiece, type SharedSong } from '@/entities/piece'
import { PinnedKeyboard } from '@/features/live-keyboard'
import { arrangePiece, ownChoice, playerRange } from '@/features/practice'
import { NO_KEYS } from '@/shared/ui'
import { ChordChart, useChartPlayback } from '@/widgets/chord-chart'

/**
 * A song from outside the library (a shared link's, the Public library's) as every song reads: its key, time and tempo, a line of chips as its page's, then its chart, its bars
 * under their sections' headings, each to tap and hear on the keys, so the learner hears the song
 * before adding it.
 */
export function SongPreview({ song }: { song: SharedSong }) {
  const piece = useMemo<ChartPiece>(
    () => ({ id: 'shared', kind: 'song', title: song.title, ...song.music }),
    [song],
  )
  const performance = useMemo(
    () => arrangePiece(piece, ownChoice(piece), BUILT_IN_PATTERNS),
    [piece],
  )
  const headings = usePieceHeadings(piece)
  const { playing, toggleBar } = useChartPlayback(performance, piece.tempo)
  return (
    <>
      <PieceFactLine piece={piece} />
      <PinnedKeyboard shown={NO_KEYS} range={playerRange(performance)} />
      <ChordChart
        performance={performance}
        headings={headings}
        playing={playing}
        onBar={toggleBar}
      />
    </>
  )
}
