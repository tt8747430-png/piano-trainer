import type { HiddenRow } from '@/entities/piece'
import { EXTRA_VOICES } from '@/shared/lib/notation'
import type { Draft, Layer } from './draft'

type Rows = Pick<Draft, 'melodyStaff' | 'voices' | 'hidden'>

/** Whether the score has a row (ADR 0072): the chord names always, the tune's staff and each voice's once added. */
export function hasRow(draft: Rows, row: HiddenRow): boolean {
  if (row === 'chords') return true
  if (row === 'melody') return draft.melodyStaff
  return EXTRA_VOICES.indexOf(row) < draft.voices.length
}

/**
 * The rows the sheet shows and the caret writes, top down (ADR 0072): the chord names, the tune's
 * staff, the more voices', the right hand's and the left's; a row the score has not, or hides, left out.
 */
export function shownRows(draft: Rows): Layer[] {
  const rows: Layer[] = ['chords', 'melody', ...EXTRA_VOICES, 'rh', 'lh']
  return rows.filter(
    (row) => row === 'rh' || row === 'lh' || (hasRow(draft, row) && !draft.hidden.includes(row)),
  )
}

/** Whether a row is on the sheet: the score has it and does not hide it. */
export const rowShown = (draft: Rows, row: HiddenRow): boolean => shownRows(draft).includes(row)

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
