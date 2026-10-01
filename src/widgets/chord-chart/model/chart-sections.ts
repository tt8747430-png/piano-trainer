import { isMethodCode, type MethodCode } from '@/entities/pattern'
import type { Performance } from '@/shared/lib/arrangement'
import { beatsPerBar, timeSignature, timeSignatureText } from '@/shared/lib/music'

/** The performance's bars (their indexes) by section, then line by line as the chart writes them. */
export function chartSections(performance: Performance): number[][][] {
  const sections: number[][][] = []
  performance.bars.forEach((bar, index) => {
    const lines = (sections[bar.section] ??= [])
    const line = (lines[bar.line] ??= [])
    line.push(index)
  })
  return sections.map((lines) => lines.filter((line) => line !== undefined))
}

/** What a bar's button shows: its chords' symbols, the methods they name, and a short bar's time signature (a pickup's). */
export interface ChartBar {
  readonly symbols: readonly string[]
  readonly methods: readonly MethodCode[]
  readonly signature: string | null
}

/** The performance's bar at `index` as the chart shows it; null past its last bar. */
export function chartBar(performance: Performance, index: number): ChartBar | null {
  const bar = performance.bars[index]
  if (!bar) return null
  const chords = bar.chords.flatMap((i) => performance.chords[i] ?? [])
  return {
    symbols: chords.map((chord) => chord.symbol),
    methods: [...new Set(chords.flatMap((chord) => chord.method ?? []))].filter(isMethodCode),
    signature:
      bar.beats === beatsPerBar(performance.meter)
        ? null
        : timeSignatureText(timeSignature(bar.beats, performance.meter)),
  }
}
