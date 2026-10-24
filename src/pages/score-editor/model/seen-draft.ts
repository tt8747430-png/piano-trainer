import type { HiddenRow } from '@/entities/piece'
import type { ScoreViewSettings } from '@/entities/settings'
import { keepsAStaff, shownRows, type Draft, type Layer } from '@/features/score-editor'
import { PIANO_STAVES } from '@/shared/lib/notation'

/** What a score says of its staves: the tune's added or not, the rows it hides. */
type Staves = Pick<Draft, 'melodyStaff' | 'hidden'>
/** What the View says it shows (ADR 0094): the chord symbols, the tune's staff, the staves hidden. */
type Shown = Pick<ScoreViewSettings, 'chordNames' | 'melodyStaff' | 'hidden'>

/** The rows top down, as the caret goes up and down them. */
const ROWS: readonly Layer[] = ['chords', 'melody', 'rh', 'lh']

/**
 * The score as the View shows it (ADR 0094): its staves, less the tune's where the View hides it and
 * the piano's where both of them are hidden. A View that would leave no staff in sight leaves out
 * none, as the Player's sheet never hides every staff (ADR 0083). The chord symbols are the sheet's
 * `chordNames`.
 */
export function seenDraft<Score extends Staves>(draft: Score, view: Shown): Score {
  const melodyStaff = draft.melodyStaff && view.melodyStaff
  const piano = PIANO_STAVES.every((staff) => view.hidden.includes(staff))
  const hidden: HiddenRow[] =
    piano && !draft.hidden.includes('piano') ? [...draft.hidden, 'piano'] : [...draft.hidden]
  if (!keepsAStaff({ melodyStaff, hidden }, hidden)) return draft
  return { ...draft, melodyStaff, hidden }
}

/** The rows the caret writes in, top down, as the View shows the score: the chord symbols too. */
export function rowsInSight(draft: Staves, view: Shown): Layer[] {
  return shownRows(seenDraft(draft, view)).filter((row) => row !== 'chords' || view.chordNames)
}

/**
 * Where the caret goes that went from one row to another (`to`, where it is now): there, where it is
 * in sight; else on the way it was going to the next row in sight, else back where it was; a row it
 * stood on put out of sight, the row in sight under it, else over it.
 */
export function layerInSight(inSight: readonly Layer[], from: Layer, to: Layer): Layer {
  if (inSight.includes(to)) return to
  const at = ROWS.indexOf(to)
  const over = ROWS.slice(0, at)
    .reverse()
    .filter((row) => inSight.includes(row))
  const under = ROWS.slice(at + 1).filter((row) => inSight.includes(row))
  if (from !== to) {
    const [ahead] = ROWS.indexOf(from) > at ? over : under
    if (ahead) return ahead
    if (inSight.includes(from)) return from
  }
  return under[0] ?? over[0] ?? to
}
