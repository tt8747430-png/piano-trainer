import type { ScoreViewSettings } from '@/entities/settings'
import { layerStaff, shownRows, type Layer, type NoteLayer } from '@/features/score-editor'

/** What the View says it shows (ADR 0094, 0097): the chord symbols, the staves hidden. */
type Shown = Pick<ScoreViewSettings, 'chordNames' | 'hidden'>

/**
 * The rows the caret writes in, top down, as the View shows the score (ADR 0094, 0097): the chord
 * symbols where the View shows them, and each staff in sight. A View that would leave no staff in
 * sight leaves out none, as the sheets never hide every staff (ADR 0083).
 */
export function rowsInSight(
  draft: { readonly staves: readonly unknown[]; readonly leadSheet: boolean },
  view: Shown,
): Layer[] {
  const rows = shownRows(draft)
  const staves = rows.filter((row): row is NoteLayer => row !== 'chords')
  const kept = staves.filter((row) => !view.hidden.includes(layerStaff(row)))
  const inSight: readonly Layer[] = kept.length > 0 ? kept : staves
  return rows.filter((row) => (row === 'chords' ? view.chordNames : inSight.includes(row)))
}

/**
 * Where the caret goes that went from one row to another (`to`, where it is now), of the score's
 * rows top down: there, where it is in sight; else on the way it was going to the next row in
 * sight, else back where it was; a row it stood on put out of sight, the row in sight under it,
 * else over it.
 */
export function layerInSight(
  rows: readonly Layer[],
  inSight: readonly Layer[],
  from: Layer,
  to: Layer,
): Layer {
  if (inSight.includes(to)) return to
  const at = rows.indexOf(to)
  const over = rows
    .slice(0, Math.max(at, 0))
    .reverse()
    .filter((row) => inSight.includes(row))
  const under = rows.slice(at + 1).filter((row) => inSight.includes(row))
  if (from !== to) {
    const [ahead] = rows.indexOf(from) > at ? over : under
    if (ahead) return ahead
    if (inSight.includes(from)) return from
  }
  return under[0] ?? over[0] ?? to
}
