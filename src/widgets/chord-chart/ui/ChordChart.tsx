import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { METHODS } from '@/entities/pattern'
import { beatCells } from '@/features/practice'
import { localText, useLocale } from '@/shared/i18n'
import { cn } from '@/shared/lib'
import type { Performance } from '@/shared/lib/arrangement'
import type { Tick } from '@/shared/lib/music'
import {
  chartBar,
  chartSections,
  rowsOf,
  sectionAnchor,
  sectionBars,
} from '../model/chart-sections'
import { useRowRoom } from '../model/use-row-room'
import { BarButton, type BarTap } from './BarButton'
import { PrintedBar } from './PrintedBar'

/** The widest a beat is drawn, in rem: a 4-beat bar reads at a glance on a laptop, not across it. */
const BEAT_MOST = 4
/** No bar in the loop. */
const NO_BARS: ReadonlySet<number> = new Set()

/**
 * A Chart's bars as written, in beats (ADR 0099, Chordify's grid), by section, line by line, each
 * section under a heading that says its bars (a walk's one section has none): a bar a group of beat
 * cells, a chord named in the beat it starts in, a line wider than the screen's room wrapping to
 * more rows, every beat as wide as every other so bars line up down the chart. The bar playing is
 * marked: on a song's chart a tap plays a bar, pressed while it sounds; on the Player's (`tap="go"`,
 * ADR 0098) a tap goes to the beat tapped (`onBar`, the bar and the tick of that beat, its first
 * time), the bar the Player is in current and its beat sounding filled; printed (`tap="print"`,
 * ADR 0107), its bars to read alone.
 */
export function ChordChart({
  performance,
  headings,
  tap = 'play',
  playing,
  beat = null,
  looped = NO_BARS,
  onBar,
  rowBeats,
  className,
}: {
  performance: Performance
  /** Each section's name, by section; none for music of one section, named nowhere. */
  headings: readonly string[]
  /** The bar playing, as written: the one sounding, or the one the Player is in. */
  playing: number | null
  /** The beat sounding in the bar playing: the Player's, filled. */
  beat?: number | null
  /** The bars as written the loop goes round. */
  looped?: ReadonlySet<number>
  /** How many beats a row holds before a line wraps: the screen's room by default. */
  rowBeats?: number
  /** Where it stands in its page. */
  className?: string
} & (
  | {
      tap?: BarTap
      /** A bar tapped, as written, and the tick its beat tapped is first played at. */
      onBar: (bar: number, at: Tick) => void
    }
  // As it prints (ADR 0107): its bars to read, none to tap.
  | { tap: 'print'; onBar?: undefined }
)) {
  const { t } = useTranslation('piece')
  const locale = useLocale()
  const screenRoom = useRowRoom()
  const room = rowBeats ?? screenRoom
  // Read once a performance: the Player's chart renders again as each beat plays.
  const sections = useMemo(() => {
    const cells = new Map(beatCells(performance).map((bar) => [bar.written, bar]))
    return chartSections(performance).map((lines, section) => ({
      heading: headings[section],
      bars: sectionBars(lines),
      lines: lines.map((line) =>
        line.flatMap((written) => {
          const bar = chartBar(performance, written)
          const counted = cells.get(written)
          if (!bar || !counted) return []
          const methods = bar.methods.map((code) => localText(METHODS[code].label, locale))
          return [
            {
              written,
              symbols: bar.symbols,
              notes: bar.signature ? [...methods, bar.signature] : methods,
              cells: counted.cells.map(({ chords }) =>
                chords.flatMap((chord) => performance.chords[chord]?.symbol ?? []),
              ),
              starts: counted.cells.map(
                ({ from }) => (performance.bars[counted.played]?.startTick ?? 0) + from,
              ),
            },
          ]
        }),
      ),
    }))
  }, [performance, headings, locale])
  // Each line in rows of the beats the screen holds; every beat as wide, so bars line up down it.
  const rows = sections.map(({ lines }) =>
    lines.flatMap((line) =>
      rowsOf(
        line.map(({ cells }) => cells.length),
        room,
      ).map((row) => row.flatMap((index) => line[index] ?? [])),
    ),
  )
  const beats = (row: readonly { cells: readonly unknown[] }[]) =>
    row.reduce((sum, bar) => sum + bar.cells.length, 0)
  const widest = Math.max(1, ...rows.flat().map(beats))

  return (
    <div
      className={cn('flex flex-col gap-6', className)}
      style={{ maxWidth: `${widest * BEAT_MOST}rem` }}
    >
      {sections.map(({ heading, bars }, section) => (
        <section
          key={section}
          id={sectionAnchor(section)}
          aria-labelledby={heading ? `${sectionAnchor(section)}-heading` : undefined}
          className="flex flex-col gap-2"
        >
          {heading ? (
            <header className="flex items-baseline gap-2">
              <h2 id={`${sectionAnchor(section)}-heading`} className="text-xl">
                {heading}
              </h2>
              {bars ? (
                <span className="text-sm text-muted-foreground tabular-nums">
                  {bars.first === bars.last
                    ? t('barOne', { n: bars.first + 1 })
                    : t('barsFromTo', { first: bars.first + 1, last: bars.last + 1 })}
                </span>
              ) : null}
            </header>
          ) : null}
          {(rows[section] ?? []).map((row, index) => (
            <div
              key={index}
              className="grid rounded-xs border-y border-r-2 border-y-border border-r-foreground bg-card break-inside-avoid"
              style={{
                gridTemplateColumns: `repeat(${beats(row)}, minmax(0, 1fr))`,
                width: `${(beats(row) / widest) * 100}%`,
              }}
            >
              {row.map(({ written, symbols, notes, cells, starts }) =>
                tap === 'print' ? (
                  <PrintedBar
                    key={written}
                    number={written + 1}
                    symbols={symbols}
                    cells={cells}
                    notes={notes}
                    style={{ gridColumn: `span ${cells.length}` }}
                  />
                ) : (
                  <BarButton
                    key={written}
                    tap={tap}
                    number={written + 1}
                    symbols={symbols}
                    cells={cells}
                    notes={notes}
                    marked={playing === written}
                    sounding={playing === written ? beat : null}
                    looped={looped.has(written)}
                    onTap={(tapped) => onBar?.(written, starts[tapped] ?? starts[0] ?? 0)}
                    style={{ gridColumn: `span ${cells.length}` }}
                  />
                ),
              )}
            </div>
          ))}
        </section>
      ))}
    </div>
  )
}
