import { useTranslation } from 'react-i18next'
import type { SheetField } from '@/widgets/score-sheet'
import { useEditorState, useScoreEditorContext } from './editor-context'
import { fieldClosedBy } from './fields'

/** Why a field cannot open where the caret is, said (ADR 0096); none where it opens. */
export function useFieldReason(kind: SheetField['kind']): string | undefined {
  const { t } = useTranslation('editor')
  const { view } = useScoreEditorContext()
  const why = useEditorState((state) => fieldClosedBy(kind, state, view))
  return why === null ? undefined : t(`reason.${why}`)
}
