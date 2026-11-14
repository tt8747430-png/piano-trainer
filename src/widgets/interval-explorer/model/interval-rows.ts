import { intervalExample, writesInterval } from '@/features/play-example'
import {
  INTERVAL_GROUP_IDS,
  INTERVAL_GROUPS,
  type IntervalGroup,
  type ReferenceInterval,
  type SpelledNote,
} from '@/shared/lib/music'
import type { IntervalSpeed } from '@/entities/settings'
import { intervalSounds, type IntervalWay, type NoteSound } from '@/shared/lib/schedule'

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

/** The time from one interval's start to the next as Play all plays them. */
export const EVERY_INTERVAL_GAP = 2

/** Every interval the page shows, in its order. */
export const ROW_INTERVALS: readonly RowInterval[] = INTERVAL_GROUP_IDS.flatMap(
  (group) => INTERVAL_ROWS[group],
)

/** How long each speed takes over an interval, as a share of Medium's (Interval settings, canvas 176). */
export const INTERVAL_PACE: Readonly<Record<IntervalSpeed, number>> = {
  slow: 1.5,
  medium: 1,
  fast: 0.6,
}

/** One interval over the root, the way chosen, at the speed chosen. */
export function oneInterval(
  root: SpelledNote,
  name: RowInterval,
  way: IntervalWay,
  speed: IntervalSpeed,
): NoteSound[] {
  const { low, high } = intervalExample(root, name)
  const pace = INTERVAL_PACE[speed]
  return intervalSounds(low, high, way).map((sound) => ({
    ...sound,
    at: sound.at * pace,
    duration: sound.duration * pace,
  }))
}

/**
 * The intervals named, over the root, in turn, each the way chosen and at the speed chosen: what
 * Play all plays, in the page's order or shuffled. One no letter writes over the root is left out.
 */
export function everyInterval(
  root: SpelledNote,
  way: IntervalWay,
  speed: IntervalSpeed,
  names: readonly RowInterval[] = ROW_INTERVALS,
): NoteSound[] {
  const gap = EVERY_INTERVAL_GAP * INTERVAL_PACE[speed]
  return names
    .filter((name) => writesInterval(root, name))
    .flatMap((name, i) =>
      oneInterval(root, name, way, speed).map((sound) => ({ ...sound, at: sound.at + i * gap })),
    )
}

export const isRowInterval = (raw: unknown): raw is RowInterval =>
  ROW_INTERVALS.some((name) => name === raw)

/** The group an interval is in: within the octave, or past it. */
export const groupOf = (name: RowInterval): IntervalGroup =>
  INTERVAL_ROWS.compound.some((each) => each === name) ? 'compound' : 'simple'

/** What an interval within the octave turns into upside down (the 3rd into the 6th, 9 between them). */
export const INVERSIONS: Readonly<Partial<Record<RowInterval, RowInterval>>> = {
  r: 'P8',
  m2: 'M7',
  M2: 'm7',
  m3: 'M6',
  M3: 'm6',
  P4: 'P5',
  A4: 'd5',
  d5: 'A4',
  P5: 'P4',
  m6: 'M3',
  M6: 'm3',
  m7: 'M2',
  M7: 'm2',
  P8: 'r',
}
