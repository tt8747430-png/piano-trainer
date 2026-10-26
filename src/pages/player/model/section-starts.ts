import { writtenBarOf } from '@/features/practice'
import type { Performance } from '@/shared/lib/arrangement'

/** Where a section starts: its first bar, as written (from 0), the first time it is played. */
export interface SectionStart {
  readonly section: number
  readonly bar: number
}

/** Each section of the music where it starts, in order (ADR 0107): what the Player's Sections lists. */
export function sectionStarts(performance: Performance): SectionStart[] {
  const starts = new Map<number, number>()
  performance.bars.forEach(({ section }, played) => {
    if (!starts.has(section)) starts.set(section, writtenBarOf(performance, played))
  })
  return [...starts]
    .map(([section, bar]) => ({ section, bar }))
    .sort((a, b) => a.section - b.section)
}

/** The section of the bar a beat group is in: where the cursor is. */
export const sectionAt = (performance: Performance, beatGroup: number): number | undefined =>
  performance.bars[performance.beatGroups[beatGroup]?.bar ?? 0]?.section
