import { useTranslation } from 'react-i18next'
import { chosenBars, clefAt, isHandLayer, type NoteLayer } from '@/features/score-editor'
import { useLayerName } from '@/widgets/score-sheet'
import { useEditorState } from './editor-context'
import { useStaffHeads } from './use-staff-heads'

/**
 * The staff and bar the palette's Clef changes at (R32-B): the caret's staff from the first bar
 * chosen (a clef tapped on the score chooses its bar and staff).
 */
export function useClefAt() {
  const staff = useEditorState((state) => (state.layer === 'chords' ? null : state.layer))
  const bar = useEditorState((state) => chosenBars(state).from)
  const current = useEditorState((state) => (staff ? clefAt(state.draft, bar, staff) : null))
  return { staff, bar, current }
}

/** What the palette's Clef changes, said over it: a piano staff from a bar on, a single staff's whole. */
export function useClefSaid({ staff, bar }: { staff: NoteLayer | null; bar: number }) {
  const { t } = useTranslation('editor')
  const layerName = useLayerName(useStaffHeads())
  if (!staff) return undefined
  return isHandLayer(staff)
    ? t('clef.from', { staff: layerName(staff), bar: bar + 1 })
    : layerName(staff)
}
