import { useTranslation } from 'react-i18next'
import { chosenBars, clefAt, isHandLayer, type NoteLayer } from '@/features/score-editor'
import { useLayerName } from '@/widgets/score-sheet'
import { useEditorState } from './editor-context'
import { useStaffHeads } from './use-staff-heads'

/** The staff and bar a clef changes at: the one given (a clef printed), else the caret's from the first bar chosen. */
export function useClefAt(at?: { readonly staff: NoteLayer; readonly bar: number }) {
  const caret = useEditorState((state) => (state.layer === 'chords' ? null : state.layer))
  const chosen = useEditorState((state) => chosenBars(state).from)
  const staff = at ? at.staff : caret
  const bar = at ? at.bar : chosen
  const current = useEditorState((state) => (staff ? clefAt(state.draft, bar, staff) : null))
  return { staff, bar, current }
}

/** The clef picker's title, and what it changes said under it: a piano staff from a bar on, a single staff's whole. */
export function useClefSaid({ staff, bar }: { staff: NoteLayer | null; bar: number }) {
  const { t } = useTranslation('editor')
  const layerName = useLayerName(useStaffHeads())
  const said = !staff
    ? undefined
    : isHandLayer(staff)
      ? t('clef.from', { staff: layerName(staff), bar: bar + 1 })
      : layerName(staff)
  return { title: t('palette.category.clef'), said }
}
