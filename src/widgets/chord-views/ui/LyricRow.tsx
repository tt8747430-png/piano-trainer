import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/lib'
import type { Performance } from '@/shared/lib/arrangement'
import type { LyricLine } from '../model/lyric-lines'
import { ChordChip } from './ChordChip'
import { LineSegments } from './LineSegments'

/**
 * A line of Chords over lyrics (ADR 0099): its segments (`LineSegments`), each its chord as a chip
 * over the words sung up to the next. The line playing reads in ink, bold; the others are muted. A
 * chip opens its chord's sheet; the line anywhere else takes the cursor to its first beat (a
 * pointer's way only: the transport is the keys'). On the loop's band where the loop holds it.
 */
export function LyricRow({
  line,
  index,
  performance,
  playing,
  sounding,
  looped,
  onGo,
  onChord,
}: {
  line: LyricLine
  /** Its place among the lines, which the view finds it by. */
  index: number
  performance: Performance
  playing: boolean
  /** Its segment whose chord sounds. */
  sounding: number | null
  looped: boolean
  onGo: () => void
  onChord: (chord: number) => void
}) {
  const { t } = useTranslation('player')
  const first = line.bars[0] ?? 0
  const last = line.bars.at(-1) ?? first
  return (
    <div
      data-line={index}
      data-looped={looped ? '' : undefined}
      className={cn(
        'relative -mx-2 rounded-lg px-2 py-1 transition-colors duration-200 ease-out',
        looped && 'bg-ring/15',
        playing ? 'font-semibold text-foreground' : 'text-muted-foreground',
      )}
    >
      <button
        type="button"
        tabIndex={-1}
        aria-label={
          first === last
            ? t('line.one', { n: first + 1 })
            : t('line.many', { first: first + 1, last: last + 1 })
        }
        aria-current={playing ? 'step' : undefined}
        onClick={onGo}
        className="absolute inset-0 cursor-pointer rounded-lg"
      />
      <LineSegments
        line={line}
        className="pointer-events-none"
        chord={(chord, segment) => (
          <ChordChip
            symbol={performance.chords[chord]?.symbol ?? ''}
            sounding={segment === sounding}
            onOpen={() => onChord(chord)}
          />
        )}
      />
    </div>
  )
}
