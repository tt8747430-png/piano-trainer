import { isMethodCode, type MethodCode } from '@/entities/pattern'
import { firstPlayedBar, writtenBarOf } from '@/features/practice'
import type { Performance } from '@/shared/lib/arrangement'
import { beatsPerBar, beatsToTicks, timeSignature, timeSignatureText } from '@/shared/lib/music'

/**
 * The performance's bars as written (their indexes, counted from 0) by section, then line by line as
 * the chart writes them: each once, where the Player plays the repeats (ADR 0067, 0098).
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

/** What a bar's button shows: its chords' symbols, the methods they name, and a short bar's time signature (a pickup's). */
interface ChartBar {
  readonly symbols: readonly string[]
  readonly methods: readonly MethodCode[]
  readonly signature: string | null
}

/** A bar as written, as the chart shows it: as it is played the first time; null past the last. */
export function chartBar(performance: Performance, written: number): ChartBar | null {
  const played = firstPlayedBar(performance, written)
  const bar = played === null ? undefined : performance.bars[played]
  if (!bar) return null
  const chords = bar.chords.flatMap((i) => performance.chords[i] ?? [])
  return {
    symbols: chords.map((chord) => chord.symbol),
    methods: [...new Set(chords.flatMap((chord) => chord.method ?? []))].filter(isMethodCode),
    signature:
      beatsToTicks(bar.beats) === beatsToTicks(beatsPerBar(performance.meter))
        ? null
        : timeSignatureText(timeSignature(bar.beats, performance.meter)),
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

/** A section's place in the chart, which its heading's id names (`section-2`). */
export const sectionAnchor = (section: number) => `section-${section}`
