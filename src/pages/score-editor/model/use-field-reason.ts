import { useTranslation } from 'react-i18next'
import { lyricsLayer } from '@/features/score-editor'
import { useLayerName, type SheetField } from '@/widgets/score-sheet'
import { useEditorState, useScoreEditorContext } from './editor-context'
import { fieldClosedBy } from './fields'
import { useStaffHeads } from './use-staff-heads'

/**
 * Why a field cannot open where the caret is, said (ADR 0096): the staff the words go on by its name
 * (ADR 0097); none where it opens.
 */
export function useFieldReason(kind: SheetField['kind']): string | undefined {
  const { t } = useTranslation('editor')
  const { view } = useScoreEditorContext()
  const why = useEditorState((state) => fieldClosedBy(kind, state, view))
  const sung = useEditorState((state) => lyricsLayer(state.draft))
  const layerName = useLayerName(useStaffHeads())
  return why === null ? undefined : t(`reason.${why}`, { staff: layerName(sung) })
}
