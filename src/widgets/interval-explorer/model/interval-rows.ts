import { intervalExample, writesInterval } from '@/features/play-example'
import {
  INTERVAL_GROUP_IDS,
  INTERVAL_GROUPS,
  type IntervalGroup,
  type ReferenceInterval,
  type SpelledNote,
} from '@/shared/lib/music'
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

/**
 * Every interval over the root in turn, as the list shows them, each the way chosen: what Play all
 * plays. An interval no letter writes over the root is left out, as its row is.
 */
export function everyInterval(root: SpelledNote, way: IntervalWay): NoteSound[] {
  return INTERVAL_GROUP_IDS.flatMap((group) => INTERVAL_ROWS[group])
    .filter((name) => writesInterval(root, name))
    .flatMap((name, i) => {
      const { low, high } = intervalExample(root, name)
      return intervalSounds(low, high, way).map((sound) => ({
        ...sound,
        at: sound.at + i * EVERY_INTERVAL_GAP,
      }))
    })
}
