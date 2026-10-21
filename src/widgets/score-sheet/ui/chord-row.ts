/** The chord symbols' row over a line's staff at full size: the caret and a bar reach into it. */
export const CHORD_ROW = 44
/** The row a line's first bar number takes over its staff where no chord names are shown. */
const NUMBER_ROW = 20
/** The least a line's labels are drawn at: smaller, a chord symbol on a page held at arm's length is not read. */
const LEAST_LABELS = 0.7

/** How large a line's labels are drawn at a scale: with it, never under `LEAST_LABELS`. */
export const labelScale = (scale: number) => Math.max(LEAST_LABELS, Math.min(1, scale))

/**
 * The row over a line's staff, in CSS px: the chord symbols' where they are shown, else only the
 * line's first bar number's (ADR 0072: a hidden row takes no room), at the line's size.
 */
export const labelRow = (chordNames: boolean, scale = 1) =>
  Math.round((chordNames ? CHORD_ROW : NUMBER_ROW) * labelScale(scale))
