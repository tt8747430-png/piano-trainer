import { Play, Square } from 'lucide-react'
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
import { arrangePiece, ownChoice } from '@/features/practice'
import { useKeyName } from '@/shared/i18n'
import { ChordChart, useChartPlayback, WHOLE_SONG } from '@/widgets/chord-chart'

/**
 * A song from outside the library (a shared link's, the Public library's) as its page reads it:
 * a head line (its key, time and tempo, then Play, which plays it from the start, on the music it
 * plays), then its chart, its bars under their sections' headings, each to tap and hear, so the
 * learner hears the song before adding it. No keyboard and no toolbar box (owner, 2026-11-17).
 */
export function SongPreview({ song }: { song: SharedSong }) {
  const { t } = useTranslation('songs')
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
  const keyName = useKeyName()
  const { playing, toggleBar, toggleAll } = useChartPlayback(performance, piece.tempo)
  const whole = playing === WHOLE_SONG
  return (
    <div className="flex min-w-0 flex-col gap-4">
      <div className="flex min-h-11 items-center justify-between gap-3">
        <span className="text-[0.9375rem] text-muted-foreground tabular-nums">
          {keyName(pieceKey(piece))} · {piece.meter} · {tempo}
        </span>
        <button
          type="button"
          aria-pressed={whole}
          onClick={toggleAll}
          className="flex h-11 shrink-0 items-center gap-2 rounded-pill bg-muted pr-[1.125rem] pl-3.5 text-[0.9375rem] font-bold transition-colors duration-150 ease-out hover:bg-accent"
        >
          {whole ? (
            <Square aria-hidden className="size-3 fill-current" />
          ) : (
            <Play aria-hidden className="size-3 fill-current" />
          )}
          {whole ? t('public.stop') : t('public.play')}
        </button>
      </div>
      <ChordChart
        performance={performance}
        headings={headings}
        playing={whole ? null : playing}
        onBar={toggleBar}
      />
    </div>
  )
}
