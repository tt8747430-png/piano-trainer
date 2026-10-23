import { showsAStaff, type HiddenRow } from '@/entities/piece'
import { EXTRA_VOICES } from '@/shared/lib/notation'
import type { Draft, Layer } from './draft'

type Rows = Pick<Draft, 'melodyStaff' | 'voices' | 'hidden'>

/**
 * Whether the score has a row (ADR 0072): the chord names and the piano always, the tune's staff and
 * each voice's once added.
 */
export function hasRow(draft: Rows, row: HiddenRow): boolean {
  if (row === 'chords' || row === 'piano') return true
  if (row === 'melody') return draft.melodyStaff
  return EXTRA_VOICES.indexOf(row) < draft.voices.length
}

/** The row a layer is shown in: a hand's is the piano's. */
const rowOf = (layer: Layer): HiddenRow => (layer === 'rh' || layer === 'lh' ? 'piano' : layer)

/**
 * The rows the sheet shows and the caret writes, top down (ADR 0072): the chord names, the tune's
 * staff, the more voices', the right hand's and the left's; a row the score has not, or hides, left
 * out (both hands where the piano is hidden, ADR 0083).
 */
export function shownRows(draft: Rows): Layer[] {
  const rows: Layer[] = ['chords', 'melody', ...EXTRA_VOICES, 'rh', 'lh']
  return rows.filter((row) => rowShown(draft, rowOf(row)))
}

/** Whether a row is on the sheet: the score has it and does not hide it. */
export const rowShown = (draft: Rows, row: HiddenRow): boolean =>
  hasRow(draft, row) && !draft.hidden.includes(row)

/** Whether a score with `hidden` out of sight still shows a staff: it never hides every one (ADR 0083). */
export const keepsAStaff = (draft: Rows, hidden: readonly HiddenRow[]): boolean =>
  showsAStaff(hidden, { melody: draft.melodyStaff, voices: draft.voices.length })

/**
 * The hidden rows of a draft whose parts changed: the piano shown again where no other staff is in
 * sight (a lead sheet's tune taken away).
 */
export const withAStaff = (draft: Rows): HiddenRow[] =>
  keepsAStaff(draft, draft.hidden)
    ? [...draft.hidden]
    : draft.hidden.filter((row) => row !== 'piano')

/** The first staff's row the caret writes in, top down: the tune's, a voice's or the right hand's. */
export const topStaff = (draft: Rows): Layer =>
  shownRows(draft).find((row) => row !== 'chords') ?? 'rh'

/**
 * The hidden rows once the voice at `index` is taken away (ADR 0072): its own mark gone, and each
 * voice under it, moving up into its place, keeping its own.
 */
export function hiddenWithout(hidden: readonly HiddenRow[], index: number): HiddenRow[] {
  return hidden.flatMap((row): HiddenRow[] => {
    const at = EXTRA_VOICES.findIndex((voice) => voice === row)
    if (at < 0) return [row]
    if (at === index) return []
    if (at < index) return [row]
    const moved = EXTRA_VOICES[at - 1]
    return moved ? [moved] : []
  })
}

/**
 * Where the caret goes from a row put out of sight or taken away: the right hand's, else (a lead
 * sheet) the top staff's.
 */
export const staffLeftFor = (draft: Rows): Layer =>
  rowShown(draft, 'piano') ? 'rh' : topStaff(draft)
