import type { Performance } from '@/shared/lib/arrangement'

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
