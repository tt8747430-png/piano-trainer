import type { Score, StaffId } from '@/shared/lib/notation'

/**
 * A staff's room as Verovio engraves it at scale 1 (a staff space 10, ADR 0078), its least: ledger
 * lines far over or under take more. Its top line stands `TOP_LINE` down, each staff `STAFF_GAP`
 * under the one over it, and the last takes `LAST_STAFF` from its own top to the engraving's foot.
 */
export const TOP_LINE = 30
export const STAFF_GAP = 101
export const LAST_STAFF = 101
/**
 * A verse of the words under the tune's staff (ADR 0093): Verovio's lyric size, 4.5 half-spaces.
 * Each verse pushes the staff under it (or the engraving's foot) down by as much, less what the gap
 * already held: the first verse under a lone staff, or the first two under the tune's staff over the
 * grand staff, mostly fit the room there already, so a system of them is estimated a little tall.
 */
export const VERSE = 22

/**
 * The height a score takes before fingers: `count` staves' (the grand staff's by default, one for
 * `staff`), and its `verses` under the tune.
 */
export const staffHeight = (staff: StaffId | undefined, count = 2, verses = 0): number =>
  STAFF_GAP * ((staff ? 1 : count) - 1) + LAST_STAFF + verses * VERSE

/** The most verses a note on the `staves` drawn (all of the score's by default) sings. */
export function versesOf(score: Score, staves: readonly StaffId[] = score.staves): number {
  let verses = 0
  const written = staves.filter((staff) => score.staves.includes(staff))
  for (const measure of score.measures)
    for (const staff of written)
      for (const voice of measure.staves[staff])
        for (const event of voice.events)
          if (event.kind === 'notes') verses = Math.max(verses, event.lyrics?.length ?? 0)
  return verses
}

/** The height a score's `staves` (all of them by default) take as engraved, with their verses. */
export const scoreHeight = (score: Score, staves: readonly StaffId[] = score.staves): number =>
  staffHeight(undefined, staves.length, versesOf(score, staves))

/** Where each of `count` staves' top line stands in a score drawn without fingers: a placeholder's lines. */
export const staffTops = (count: number): number[] =>
  Array.from({ length: count }, (_, index) => index * STAFF_GAP + TOP_LINE)
