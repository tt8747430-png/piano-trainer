import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { METHODS } from '@/entities/pattern'
import { beatCells } from '@/features/practice'
import { localText, useLocale } from '@/shared/i18n'
import { cn } from '@/shared/lib'
import type { Performance } from '@/shared/lib/arrangement'
import type { Tick } from '@/shared/lib/music'
import type { BarWords } from '../model/bar-words'
import {
  chartBar,
  chartSections,
  gridColumns,
  gridRows,
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
/** No words under the bars. */
const NO_WORDS: ReadonlyMap<number, BarWords> = new Map()

/**
 * Beats of a row where no bar stands: before a pickup, or after a section's last bar, the barline
 * closing that bar before them (`closes`).
 */
function Blank({ from, beats, closes = false }: { from: number; beats: number; closes?: boolean }) {
  return (
    <span
      aria-hidden
      data-blank=""
      className={cn('bg-muted/40', closes && 'border-l-2 border-l-foreground')}
      style={{ gridColumn: `${from + 1} / span ${beats}` }}
    />
  )
}

/**
 * A Chart's bars as written, in beats (ADR 0099, 0108, Chordify's grid, a lead sheet's), by section,
 * each section under a heading that says its bars (a walk's one section has none): a bar a group of
 * beat cells, a chord named in the beat it starts in. Every row is as wide as every other, with as
 * many beats (`gridColumns`: whole bars of the music's commonest length, as many as the screen
 * holds), every beat as wide, so beats and barlines line up down the chart; a section's bars run on
 * from row to row as written, a bar never split (`gridRows`), a section starting a row of its own. A
 * pickup stands at the end of a whole bar's place, the beats before it blank, so the bars after it
 * fall in step; the beats after a section's last bar are blank too. The bar playing is marked: on a
 * song's chart a tap plays a bar, pressed while it sounds; on the Player's (`tap="go"`, ADR 0098) a
 * tap goes to the beat tapped (`onBar`, the bar and the tick of that beat, its first time), the bar
 * the Player is in current and its beat sounding filled. With `words`, each bar's words under its
 * beats (ADR 0108). A meter that changes is named under its bar; a pickup's length is its beats.
 * Printed (`tap="print"`, ADR 0107), its bars to read alone.
 */
export function ChordChart({
  performance,
  headings,
  tap = 'play',
  playing,
  beat = null,
  looped = NO_BARS,
  words = NO_WORDS,
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
  /** Each bar's words as written, verse by verse, by its number from 0: the Grid's Lyrics. */
  words?: ReadonlyMap<number, BarWords>
  /** How many beats a row holds: the screen's room by default. */
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
    const counted = beatCells(performance)
    const cells = new Map(counted.map((bar) => [bar.written, bar]))
    const meterOf = (played: number) => performance.bars[played]?.meter ?? performance.meter
    // A whole bar's beats in each meter: the most any of its bars has.
    const whole = new Map<string, number>()
    for (const bar of counted) {
      const meter = meterOf(bar.played)
      whole.set(meter, Math.max(whole.get(meter) ?? 0, bar.cells.length))
    }
    return chartSections(performance).map((lines, section) => ({
      heading: headings[section],
      bars: sectionBars(lines),
      shown: lines.flat().flatMap((written, index) => {
        const bar = chartBar(performance, written)
        const each = cells.get(written)
        if (!bar || !each) return []
        const methods = bar.methods.map((code) => localText(METHODS[code].label, locale))
        const beats = each.cells.length
        // A section's first bar short of its meter's is a pickup: it takes a whole bar's place.
        const pickup = index === 0 && bar.short
        return [
          {
            written,
            symbols: bar.symbols,
            notes: bar.signature ? [...methods, bar.signature] : methods,
            cells: each.cells.map(({ chords }) =>
              chords.flatMap((chord) => performance.chords[chord]?.symbol ?? []),
            ),
            slot: pickup ? Math.max(beats, whole.get(meterOf(each.played)) ?? beats) : beats,
            starts: each.cells.map(
              ({ from }) => (performance.bars[each.played]?.startTick ?? 0) + from,
            ),
          },
        ]
      }),
    }))
  }, [performance, headings, locale])
  const columns = gridColumns(
    sections.flatMap(({ shown }) =>
      shown.map(({ cells, slot }) => ({ cells: cells.length, slot })),
    ),
    room,
  )
  return (
    <div
      className={cn('flex flex-col gap-6', className)}
      style={{ maxWidth: `${columns * BEAT_MOST}rem` }}
    >
      {sections.map(({ heading, bars, shown }, section) => (
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
          {gridRows(
            shown.map(({ cells, slot }) => ({ cells: cells.length, slot })),
            columns,
          ).map((row, index) => {
            const last = row.at(-1)
            const end = last ? last.column + (shown[last.index]?.slot ?? 0) : 0
            return (
              <div
                key={index}
                className={cn(
                  'grid overflow-hidden rounded-xs border-y border-y-border bg-card break-inside-avoid',
                  end === columns && 'border-r-2 border-r-foreground',
                )}
                style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
              >
                {row.flatMap(({ index: at, column, lead }) => {
                  const bar = shown[at]
                  if (!bar) return []
                  const { written, symbols, notes, cells, starts } = bar
                  const place = { gridColumn: `${column + lead + 1} / span ${cells.length}` }
                  return [
                    lead > 0 ? <Blank key={`lead-${written}`} from={column} beats={lead} /> : null,
                    tap === 'print' ? (
                      <PrintedBar
                        key={written}
                        number={written + 1}
                        symbols={symbols}
                        cells={cells}
                        notes={notes}
                        style={place}
                      />
                    ) : (
                      <BarButton
                        key={written}
                        tap={tap}
                        number={written + 1}
                        symbols={symbols}
                        cells={cells}
                        notes={notes}
                        words={words.get(written)}
                        marked={playing === written}
                        sounding={playing === written ? beat : null}
                        looped={looped.has(written)}
                        onTap={(tapped) => onBar?.(written, starts[tapped] ?? starts[0] ?? 0)}
                        style={place}
                      />
                    ),
                  ]
                })}
                {end < columns ? <Blank from={end} beats={columns - end} closes /> : null}
              </div>
            )
          })}
        </section>
      ))}
    </div>
  )
}
