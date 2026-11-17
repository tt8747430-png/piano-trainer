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
import { PinnedKeyboard } from '@/features/live-keyboard'
import { arrangePiece, ownChoice, playerRange } from '@/features/practice'
import { useKeyName } from '@/shared/i18n'
import { NO_KEYS } from '@/shared/ui'
import { ChordChart, useChartPlayback, WHOLE_SONG } from '@/widgets/chord-chart'

/**
 * A song from outside the library (a shared link's, the Public library's) as Flat's score page
 * reads it: a slim toolbar over the music (Play from the start, its tempo, on a wider screen its key
 * and time), then its chart, its bars under their sections' headings, each to tap and hear on the
 * keys, so the learner hears the song before adding it.
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
  const label = whole ? t('public.stopAll') : t('public.playAll')
  return (
    <>
      <div
        role="toolbar"
        aria-label={label}
        className="card flex items-center gap-3 rounded-pill py-1.5 pr-4 pl-1.5 whitespace-nowrap"
      >
        <button
          type="button"
          aria-pressed={whole}
          aria-label={label}
          onClick={toggleAll}
          className="grid size-11 shrink-0 place-items-center rounded-pill bg-primary text-primary-foreground transition-colors duration-150 ease-out hover:brightness-95"
        >
          {whole ? (
            <Square aria-hidden className="size-4 fill-current" />
          ) : (
            <Play aria-hidden className="size-4.5 translate-x-px fill-current" />
          )}
        </button>
        <span aria-hidden className="text-[0.9375rem] font-semibold">
          {label}
        </span>
        <span className="flex-1" />
        <span className="text-[0.9375rem] text-muted-foreground tabular-nums">{tempo}</span>
        <span aria-hidden className="h-5 w-px bg-border max-sm:hidden" />
        <span className="text-[0.9375rem] text-muted-foreground max-sm:hidden">
          {keyName(pieceKey(piece))} · {piece.meter}
        </span>
      </div>
      <PinnedKeyboard shown={NO_KEYS} range={playerRange(performance)} />
      <ChordChart
        performance={performance}
        headings={headings}
        playing={whole ? null : playing}
        onBar={toggleBar}
      />
    </>
  )
}
