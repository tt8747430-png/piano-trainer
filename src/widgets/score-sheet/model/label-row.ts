import { PRINT_SCALE } from '@/shared/lib'

/** The chord symbols' row over a line's staff at full size: the caret and a bar reach into it. */
export const CHORD_ROW = 44
/** The row a line's first bar number takes over its staff where no chord names are shown. */
const NUMBER_ROW = 20
/** A bar's number sits this far right of its barline, clear of the line. */
export const NUMBER_INSET_PX = 4
/** A tempo at the line's head stands this far right of its bar's number. */
export const AFTER_NUMBER_PX = 24
/** The least a line's labels are drawn at: smaller, a chord symbol on a page held at arm's length is not read. */
const LEAST_LABELS = 0.7

/**
 * A page's labels, as it prints (ADR 0075): chord symbols 2.6 staff spaces tall, as LilyPond's and
 * Sibelius's are, of the 18 px they are at full size (1.8 spaces of 10 px) on a staff at `PRINT_SCALE`.
 */
const PRINT_LABELS = (2.6 * 10 * PRINT_SCALE) / 18

/**
 * How large a line's labels are drawn at a scale: on a screen with it, never under `LEAST_LABELS`;
 * on a page (`print`), as it prints, the canvas zooming them with the staff.
 */
export const labelScale = (scale: number, print = false) =>
  print ? PRINT_LABELS : Math.max(LEAST_LABELS, Math.min(1, scale))

/**
 * The row over a line's staff, in CSS px: the chord symbols' where they are shown, else only the
 * line's first bar number's (ADR 0072: a hidden row takes no room), at the line's size.
 */
export const labelRow = (chordNames: boolean, scale = 1, print = false) =>
  Math.round((chordNames ? CHORD_ROW : NUMBER_ROW) * labelScale(scale, print))
