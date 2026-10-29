import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { BUILT_IN_PATTERNS } from '@/entities/pattern'
import {
  pieceKey,
  usePieceHeadings,
  useTempoText,
  type ChartPiece,
  type SharedSong,
} from '@/entities/piece'
import { PinnedKeyboard } from '@/features/live-keyboard'
import { arrangePiece, ownChoice, playerRange } from '@/features/practice'
import { keySymbol, printedSymbol } from '@/shared/lib/music'
import { NO_KEYS } from '@/shared/ui'
import { ChordChart, useChartPlayback } from '@/widgets/chord-chart'

/**
 * A song from outside the library (a shared link's, the Public library's) as every song reads: its key, meter and tempo in a line, then its chart, its bars
 * under their sections' headings, each to tap and hear on the keys, so the learner hears the song
 * before adding it.
 */
export function SongPreview({ song }: { song: SharedSong }) {
  const { t } = useTranslation(['songs', 'music'])
  const piece = useMemo<ChartPiece>(
    () => ({ id: 'shared', kind: 'song', title: song.title, ...song.music }),
    [song],
  )
  const performance = useMemo(
    () => arrangePiece(piece, ownChoice(piece), BUILT_IN_PATTERNS),
    [piece],
  )
  const headings = usePieceHeadings(piece)
  const tempo = useTempoText(piece)
  const { playing, toggleBar } = useChartPlayback(performance, piece.tempo)
  return (
    <>
      <p className="-mt-3 text-lg text-muted-foreground">
        {t('shared.facts', {
          key: printedSymbol(keySymbol(pieceKey(piece))),
          meter: piece.meter,
          bpm: tempo,
        })}
      </p>
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
