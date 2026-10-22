/**
 * LilyPond's horizontal spacing (lily/spacing-basic.cc, spacing-spanner.cc), ported (ADR 0077): a
 * note's ideal space grows by `INCREMENT` staff spaces each time its length doubles, from
 * `SHORTEST_SPACE` increments for the shortest note; a note shorter than that takes its share of it.
 * VexFlow's own spacing grows by a power of the length, so a half or a whole note takes far more room
 * than a printed score gives it.
 */
const INCREMENT = 1.2
const SHORTEST_SPACE = 2

/** The ideal space, in staff spaces, of a note `length` long when the shortest that counts is `shortest`. */
export function idealSpace(length: number, shortest: number): number {
  return length >= shortest
    ? INCREMENT * (SHORTEST_SPACE + Math.log2(length / shortest))
    : INCREMENT * SHORTEST_SPACE * (length / shortest)
}

/**
 * A bar's columns' ideal gaps: each the space of the time to the next onset (the last's to `end`),
 * the shortest that counts the bar's shortest, never longer than `cap` (LilyPond's 3/16).
 */
export function columnGaps(onsets: readonly number[], end: number, cap: number): number[] {
  const lengths = onsets.map((at, i) => (onsets[i + 1] ?? end) - at)
  const shortest = Math.min(cap, ...lengths.filter((length) => length > 0))
  return lengths.map((length) => idealSpace(length, shortest))
}

/**
 * Gaps fitted to `width` in proportion to their `ideals`, none under its `least` (what its notes and
 * their accidentals take): a gap that would be squeezed under it keeps its least and the rest share
 * what is left. Narrower than the leasts together, each keeps its least.
 */
export function fitGaps(
  ideals: readonly number[],
  least: readonly number[],
  width: number,
): number[] {
  const held = new Set<number>()
  for (;;) {
    const kept = [...held].reduce((sum, i) => sum + (least[i] ?? 0), 0)
    const free = ideals.reduce((sum, ideal, i) => (held.has(i) ? sum : sum + ideal), 0)
    const scale = free > 0 ? (width - kept) / free : 0
    const squeezed = ideals.findIndex((ideal, i) => !held.has(i) && ideal * scale < (least[i] ?? 0))
    if (squeezed === -1)
      return ideals.map((ideal, i) => (held.has(i) ? (least[i] ?? 0) : ideal * scale))
    held.add(squeezed)
  }
}
