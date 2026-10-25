import type { ScoreViewSettings } from '@/entities/settings'
import type { SheetField } from '@/widgets/score-sheet'

/** Why a field cannot open where the caret is (ADR 0096): its palette key greyed, saying it. */
export type FieldReason = 'chordsHidden'

/** What the View shows that a field writes in: the chord symbols' row. */
type Shown = Pick<ScoreViewSettings, 'chordNames'>

/**
 * Why a field cannot open (ADR 0096), its key greyed with the reason as its tooltip; null where it
 * opens: the chord symbol's in the chord row, which the View may hide.
 */
export function fieldClosedBy(kind: SheetField['kind'], shown: Shown): FieldReason | null {
  switch (kind) {
    case 'chord':
      return shown.chordNames ? null : 'chordsHidden'
  }
}
