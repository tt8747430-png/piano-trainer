import type { CellBar } from '@/features/practice'

/** Each bar's first beat, counted along the strip from 0. */
export function firstBeats(bars: readonly CellBar[]): number[] {
  const firsts: number[] = []
  let counted = 0
  for (const { cells } of bars) {
    firsts.push(counted)
    counted += cells.length
  }
  return firsts
}
