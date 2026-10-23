import { showsAStaff, type HiddenRow } from '@/entities/piece'
import type { Draft, Layer } from './draft'

type Rows = Pick<Draft, 'melodyStaff' | 'hidden'>

/**
 * Whether the score has a row (ADR 0072): the chord names and the piano always, the tune's staff
 * once added.
 */
export function hasRow(draft: Rows, row: HiddenRow): boolean {
  if (row === 'chords' || row === 'piano') return true
  return draft.melodyStaff
}

/** The row a layer is shown in: a hand's is the piano's. */
const rowOf = (layer: Layer): HiddenRow => (layer === 'rh' || layer === 'lh' ? 'piano' : layer)

/**
 * The rows the sheet shows and the caret writes, top down (ADR 0072, 0091): the chord names, the
 * tune's staff, the right hand's and the left's; a row the score has not, or hides, left out (both
 * hands where the piano is hidden, ADR 0083).
 */
export function shownRows(draft: Rows): Layer[] {
  const rows: Layer[] = ['chords', 'melody', 'rh', 'lh']
  return rows.filter((row) => rowShown(draft, rowOf(row)))
}

/** Whether a row is on the sheet: the score has it and does not hide it. */
export const rowShown = (draft: Rows, row: HiddenRow): boolean =>
  hasRow(draft, row) && !draft.hidden.includes(row)

/** Whether a score with `hidden` out of sight still shows a staff: it never hides every one (ADR 0083). */
export const keepsAStaff = (draft: Rows, hidden: readonly HiddenRow[]): boolean =>
  showsAStaff(hidden, draft.melodyStaff)

/**
 * The hidden rows of a draft whose staves changed: the piano shown again where no other staff is in
 * sight (a lead sheet's tune taken away).
 */
export const withAStaff = (draft: Rows): HiddenRow[] =>
  keepsAStaff(draft, draft.hidden)
    ? [...draft.hidden]
    : draft.hidden.filter((row) => row !== 'piano')

/** The first staff's row the caret writes in, top down: the tune's or the right hand's. */
export const topStaff = (draft: Rows): Layer =>
  shownRows(draft).find((row) => row !== 'chords') ?? 'rh'

/**
 * Where the caret goes from a row put out of sight or taken away: the right hand's, else (a lead
 * sheet) the top staff's.
 */
export const staffLeftFor = (draft: Rows): Layer =>
  rowShown(draft, 'piano') ? 'rh' : topStaff(draft)
