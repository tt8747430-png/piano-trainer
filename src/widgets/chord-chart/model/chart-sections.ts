import { isMethodCode, type MethodCode } from '@/entities/pattern'
import { firstPlayedBar, writtenBarOf } from '@/features/practice'
import type { Performance } from '@/shared/lib/arrangement'
import { beatsPerBar, beatsToTicks, timeSignature, timeSignatureText } from '@/shared/lib/music'

/**
 * The performance's bars as written (their indexes, counted from 0) by section, then line by line as
 * the chart writes them: each once, where the Player plays the repeats (ADR 0097, 0108).
 */
export function chartSections(performance: Performance): number[][][] {
  const sections: number[][][] = []
  const shown = new Set<number>()
  performance.bars.forEach((bar, played) => {
    const written = writtenBarOf(performance, played)
    if (shown.has(written)) return
    shown.add(written)
    const lines = (sections[bar.section] ??= [])
    const line = (lines[bar.line] ??= [])
    line.push(written)
  })
  return sections.map((lines) => lines.filter((line) => line !== undefined))
}

/**
 * What a bar's button shows: its chords' symbols, the methods they name, and its time signature where
 * its meter changes there (ADR 0097); whether it is short of its meter's bar (a pickup), which the
 * Grid shows by its beats alone (ADR 0108).
 */
interface ChartBar {
  readonly symbols: readonly string[]
  readonly methods: readonly MethodCode[]
  readonly signature: string | null
  readonly short: boolean
}

/** A bar as written as it is played the first time; none past the last. */
function writtenBar(performance: Performance, written: number) {
  const played = firstPlayedBar(performance, written)
  return played === null ? undefined : performance.bars[played]
}

/** A bar as written, as the chart shows it: as it is played the first time; null past the last. */
export function chartBar(performance: Performance, written: number): ChartBar | null {
  const bar = writtenBar(performance, written)
  if (!bar) return null
  const chords = bar.chords.flatMap((i) => performance.chords[i] ?? [])
  // Its section's meter, else the piece's.
  const meter = bar.meter ?? performance.meter
  const before = written > 0 ? writtenBar(performance, written - 1) : undefined
  const changes = before !== undefined && (before.meter ?? performance.meter) !== meter
  const full = beatsToTicks(bar.beats) === beatsToTicks(beatsPerBar(meter))
  return {
    symbols: chords.map((chord) => chord.symbol),
    methods: [...new Set(chords.flatMap((chord) => chord.method ?? []))].filter(isMethodCode),
    signature: changes ? timeSignatureText(timeSignature(beatsPerBar(meter), meter)) : null,
    short: !full,
  }
}

/** A section's bars: the first and the last, by index. */
export interface SectionBars {
  readonly first: number
  readonly last: number
}

/** A section's bars from its lines (`chartSections`): its first and last; none where it has no bars. */
export function sectionBars(lines: readonly (readonly number[])[]): SectionBars | null {
  const all = lines.flat()
  return all.length === 0 ? null : { first: Math.min(...all), last: Math.max(...all) }
}

/** A bar of the Grid: the beats it lasts, and the beats its place takes (a pickup's, a whole bar's). */
export interface GridBar {
  readonly cells: number
  /** At least `cells`: a pickup takes a whole bar's place, standing at its end. */
  readonly slot: number
}

/** A bar placed on the Grid's row: which, the column its place starts in, and the beats left blank before it. */
export interface PlacedBar {
  readonly index: number
  readonly column: number
  readonly lead: number
}

/**
 * How many beat columns every row of the Grid has (ADR 0108): as many whole bars of the music's
 * commonest length as `room` beats hold (two 4-beat bars on a phone held upright, two of 3/4 in six),
 * one at least, and never fewer than its longest bar's place.
 */
export function gridColumns(bars: readonly GridBar[], room: number): number {
  if (bars.length === 0) return 1
  const counts = new Map<number, number>()
  for (const { slot } of bars) counts.set(slot, (counts.get(slot) ?? 0) + 1)
  const [common = 1] = [...counts].sort((a, b) => b[1] - a[1] || b[0] - a[0])[0] ?? []
  const fits = common * Math.max(1, Math.floor(room / common))
  return Math.max(fits, ...bars.map(({ slot }) => slot))
}

/**
 * A section's bars laid on the Grid's rows of `columns` beats (ADR 0108, a lead sheet's): one after
 * another as they are written, a row holding as many whole places as fit, a bar never split; a
 * pickup at the end of its place, the beats before it blank, so the bars after it fall on the
 * beats of every row.
 */
export function gridRows(bars: readonly GridBar[], columns: number): PlacedBar[][] {
  const rows: PlacedBar[][] = []
  let used = columns
  bars.forEach(({ cells, slot }, index) => {
    if (used + slot > columns || rows.length === 0) {
      rows.push([])
      used = 0
    }
    rows.at(-1)?.push({ index, column: used, lead: slot - cells })
    used += slot
  })
  return rows
}

/** A section's place in the chart, which its heading's id names (`section-2`). */
export const sectionAnchor = (section: number) => `section-${section}`
