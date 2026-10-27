import { useTranslation } from 'react-i18next'
import type { NoteLayer } from '@/features/score-editor'
import { CLEF_FORMS, CLEFS, type Clef, type ClefShape } from '@/shared/lib/music'
import { useScoreEditorContext } from '../model/editor-context'
import { PickerCell, PickerGrid } from './PickerGrid'
import { ClefSign } from './picker-pictures'

/** The clefs by their sign, each family a row of its own: the G clefs, the C clefs, the F clefs. */
const FAMILIES: readonly ClefShape[] = ['G', 'C', 'F']
const family = (shape: ClefShape): Clef[] =>
  CLEFS.filter((clef) => CLEF_FORMS[clef].shape === shape)

/**
 * The clef picker (ADR 0097, 0114, after notation apps' clef sheets): one bordered grid, the G
 * clefs (treble, an octave or two up or down), the C clefs (soprano to baritone) and the F clefs (bass,
 * up or down, on the third line and the fifth), each drawn on a short staff, named in its tooltip and
 * to a screen reader, the one the staff is in tinted. A tap writes it: one of the piano's staves from
 * the bar on, a single staff's whole.
 */
export function ClefPicker({
  staff,
  bar,
  current,
}: {
  staff: NoteLayer
  bar: number
  current: Clef | null
}) {
  const { t } = useTranslation('editor')
  const { actions } = useScoreEditorContext()
  const cell = (clef: Clef) => (
    <PickerCell
      key={clef}
      label={t(`clef.${clef}`)}
      pressed={current === clef}
      onClick={() =>
        current === clef ? undefined : actions.dispatch({ type: 'clef', staff, clef, bar })
      }
    >
      <ClefSign clef={clef} />
    </PickerCell>
  )
  return (
    <PickerGrid
      label={t('palette.category.clef')}
      rows={FAMILIES.map((shape) => ({
        label: t(`clef.family.${shape}`),
        cells: family(shape).map(cell),
      }))}
    />
  )
}
