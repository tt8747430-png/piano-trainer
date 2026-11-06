import type { Performance } from '@/shared/lib/arrangement'
import { feedbackOf, type Feedback } from './feedback'
import type { Take } from './types'

/** What a song's page says of the learner's takes (R34, Piano Forte's meter). */
export interface PracticeSummary {
  /** The last take's share right, a whole percent. */
  readonly last: number
  /** The best take's share right, a whole percent. */
  readonly best: number
  /** The last take's share right in each bar of the piece, 0–1; null for a bar it judged nothing in. */
  readonly bars: readonly (number | null)[]
  /** The last take's tempo against the song's own: 0.7 at 70 %. */
  readonly speed: number
}

/** Each bar's share of its judged notes played right; null where nothing in it was judged. */
export function barShares(
  feedback: Pick<Feedback, 'notes'>,
  bars: Performance['bars'],
): (number | null)[] {
  const right = bars.map(() => 0)
  const judged = bars.map(() => 0)
  for (const note of feedback.notes) {
    const bar = bars.findLastIndex((each) => each.startTick <= note.tick)
    if (bar < 0) continue
    judged[bar] = (judged[bar] ?? 0) + 1
    if (note.verdict === 'right') right[bar] = (right[bar] ?? 0) + 1
  }
  return judged.map((count, bar) => (count === 0 ? null : (right[bar] ?? 0) / count))
}

/**
 * The learner's takes of a song against its music, the last one made the latest: its share right,
 * the best of them, its bars one by one, and how fast it was played. None before the first take.
 */
export function practiceSummary(
  performance: Pick<Performance, 'notes' | 'bars'>,
  takes: readonly Take[],
  tempo: number,
): PracticeSummary | null {
  const ordered = [...takes].sort((a, b) => a.made - b.made)
  const last = ordered.at(-1)
  if (!last) return null
  const judged = ordered.map((take) => feedbackOf(performance, take))
  const lastFeedback = judged.at(-1) ?? feedbackOf(performance, last)
  return {
    last: lastFeedback.percent,
    best: Math.max(...judged.map((feedback) => feedback.percent)),
    bars: barShares(lastFeedback, performance.bars),
    speed: last.tempo / tempo,
  }
}

/** Bars counted from 0, first to last. */
export interface Bars {
  readonly first: number
  readonly last: number
}

/**
 * The one next step a song's page offers (R34, Piano Forte's pace): the two weakest bars side by
 * side looped at 70 % while they are under 80 % right; else the tempo climbed, 50 → 75 → 100 %.
 * None once the last take was at full speed with no weak bars.
 */
export type NextStep =
  | { readonly kind: 'loop'; readonly bars: Bars; readonly speed: number }
  | { readonly kind: 'tempo'; readonly speed: number }

/** A pair of bars under this share right is looped. */
const WEAK = 0.8
/** The speed a weak passage is looped at. */
const LOOP_SPEED = 0.7

export function nextStep(summary: Pick<PracticeSummary, 'bars' | 'speed'>): NextStep | null {
  const worst = weakestBars(summary.bars)
  if (worst && worst.share < WEAK) return { kind: 'loop', bars: worst.bars, speed: LOOP_SPEED }
  if (summary.speed < 0.99) return { kind: 'tempo', speed: summary.speed < 0.74 ? 0.75 : 1 }
  return null
}

/** The weakest bar, or pair of bars side by side, of those judged: the lowest share right. */
function weakestBars(bars: readonly (number | null)[]): { bars: Bars; share: number } | null {
  let worst: { bars: Bars; share: number } | null = null
  for (const [bar, share] of bars.entries()) {
    if (share === null) continue
    const next = bars[bar + 1]
    const found =
      next === null || next === undefined
        ? { bars: { first: bar, last: bar }, share }
        : { bars: { first: bar, last: bar + 1 }, share: (share + next) / 2 }
    if (!worst || found.share < worst.share) worst = found
  }
  return worst
}
