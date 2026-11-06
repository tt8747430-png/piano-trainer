import { useTranslation } from 'react-i18next'
import { isHandLayer, type NoteLayer } from '@/features/score-editor'
import { CLEF_FORMS, CLEFS, type Clef, type ClefShape } from '@/shared/lib/music'
import { useScoreEditorContext } from '../model/editor-context'
import { PickerCell, PickerGrid } from '@/shared/ui/pickers/PickerGrid'
import { ClefSign } from '@/shared/ui/pickers/picker-pictures'

/** The clefs by their sign, each family a row of its own: the G clefs, the C clefs, the F clefs. */
const FAMILIES: readonly ClefShape[] = ['G', 'C', 'F']
const family = (shape: ClefShape): Clef[] =>
  CLEFS.filter((clef) => CLEF_FORMS[clef].shape === shape)

/**
 * The palette's Clef (ADR 0097, 0114, R32-C, Flat's): one bordered table, a family a row: the G clefs
 * (treble, an octave or two up or down), the C clefs (soprano to baritone) and the F clefs (bass, up
 * or down, on the third line and the fifth), each drawn on a short staff, named in its tooltip and to
 * a screen reader, the one the staff is in tinted. No question asked, as Flat's: on a piano staff a
 * range of bars chosen (`to`, its last bar) takes the clef alone, else it holds from the bar until the
 * next clef; a single staff is written in it whole.
 */
export function ClefPicker({
  staff,
  bar,
  to,
  current,
}: {
  staff: NoteLayer
  bar: number
  to: number | undefined
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
        current === clef && to === undefined
          ? undefined
          : actions.dispatch({
              type: 'clef',
              staff,
              clef,
              bar,
              ...(to !== undefined && isHandLayer(staff) ? { to } : {}),
            })
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
