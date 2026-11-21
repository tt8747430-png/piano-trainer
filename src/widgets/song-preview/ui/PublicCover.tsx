import { AudioWaveform } from 'lucide-react'
import { itemPaint } from '@/features/publish'
import type { PublicEntry } from '@/shared/api/public-library'
import { cn } from '@/shared/lib'
import { ChordText, PAINT } from '@/shared/ui'
import { openingBars } from '../model/opening-bars'

/**
 * A published song's picture (the Explore board's FEEDCARD cover): what it really holds, its opening
 * chords as a chart reads them, set large on the song's paint, a bar line between bars; `tile`, the
 * square of a phone's row, its first chord alone. A song with no chart shows a wave.
 */
export function PublicCover({
  entry,
  tile = false,
  cell = false,
  className,
}: {
  entry: PublicEntry
  tile?: boolean
  /** A table row's 40 tile: its chord in the book's serif at 13, so Gmaj7 fits. */
  cell?: boolean
  className?: string
}) {
  const paint = PAINT[itemPaint(entry.id)]
  const bars = openingBars(entry)
  const first = bars?.[0]?.[0]
  return (
    <span
      aria-hidden
      className={cn(
        'grid place-items-center overflow-hidden',
        tile ? 'aspect-square' : 'aspect-[16/9] px-4',
        paint.fill,
        paint.ink,
        className,
      )}
    >
      {!bars || !first ? (
        <AudioWaveform className={tile ? 'size-6' : 'size-8'} />
      ) : tile ? (
        <ChordText
          symbol={first}
          className={cn(
            '[&_*]:text-current',
            cell ? 'font-display text-footnote font-bold' : 'text-xl font-semibold',
          )}
        />
      ) : (
        <span className="flex max-w-full items-center gap-3 font-display text-[1.375rem] font-semibold">
          {bars.map((bar, index) => (
            <span key={index} className="flex items-center gap-3">
              {index > 0 ? <span className="h-7 w-px bg-current opacity-30" /> : null}
              <span className="flex gap-2">
                {bar.map((symbol, at) => (
                  <ChordText key={at} symbol={symbol} className="[&_*]:text-current" />
                ))}
              </span>
            </span>
          ))}
        </span>
      )}
    </span>
  )
}
