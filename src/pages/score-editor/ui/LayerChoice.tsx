import { useTranslation } from 'react-i18next'
import { LAYERS } from '@/features/score-editor'
import { Segmented } from '@/shared/ui'
import { useEditorState, useScoreEditorContext } from '../model/editor-context'

/** What the editor writes: Chords · Melody · Right hand · Left hand. */
export function LayerChoice() {
  const { t } = useTranslation('editor')
  const { actions } = useScoreEditorContext()
  const layer = useEditorState((state) => state.layer)
  return (
    <Segmented
      label={t('layers.label')}
      value={layer}
      options={LAYERS.map((value) => ({ value, label: t(`layers.${value}`) }))}
      onChange={(next) => actions.dispatch({ type: 'layer', layer: next })}
    />
  )
}
