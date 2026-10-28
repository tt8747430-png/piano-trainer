import {
  INTERVAL_GROUPS,
  midi,
  type IntervalGroup,
  type KeyRange,
  type Midi,
  type ReferenceInterval,
} from '@/shared/lib/music'

/** An interval the page lists: the reference's, and the diminished 5th beside the augmented 4th. */
export type RowInterval = ReferenceInterval | 'd5'

/**
 * The Intervals page's rows, group by group, as the reference app lists them: every interval of the
 * reference, and the tritone twice, as the augmented 4th and the diminished 5th it is written as
 * (the same keys, two spellings), each a row of its own.
 */
export const INTERVAL_ROWS: Readonly<Record<IntervalGroup, readonly RowInterval[]>> = {
  simple: INTERVAL_GROUPS.simple.flatMap((name): RowInterval[] =>
    name === 'A4' ? ['A4', 'd5'] : [name],
  ),
  compound: INTERVAL_GROUPS.compound,
}

/** How many keys a group's rows draw: enough for its widest interval from where the drawing starts. */
const SPAN: Readonly<Record<IntervalGroup, number>> = { simple: 20, compound: 28 }

/**
 * The keys a row draws, as many for every row of its group: from the C or the F at or under the root,
 * whichever is nearer, so the root stands near the left and the widest interval still fits.
 */
export function rowRange(low: Midi, group: IntervalGroup): KeyRange {
  const inOctave = low % 12
  const from = low - (inOctave < 5 ? inOctave : inOctave - 5)
  return { from: midi(from), to: midi(from + SPAN[group] - 1) }
}
