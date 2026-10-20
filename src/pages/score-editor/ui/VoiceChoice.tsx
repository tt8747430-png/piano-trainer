import { useTranslation } from 'react-i18next'
import type { Layer } from '@/features/score-editor'
import { Segmented } from '@/shared/ui'
import { useEditorState, useScoreEditorContext } from '../model/editor-context'

const LAYERS: readonly Layer[] = ['chords', 'melody', 'rh', 'lh']

/**
 * What the keys write, as a notation app's voices at its palette's foot: the chord row, the tune,
 * the right hand or the left; the chord row only while its names are shown. A click on the sheet
 * chooses too.
 */
export function VoiceChoice({ disabled }: { disabled: boolean }) {
  const { t } = useTranslation('editor')
  const { actions, view } = useScoreEditorContext()
  const layer = useEditorState((state) => state.layer)
  const layers = view.chordNames ? LAYERS : LAYERS.filter((each) => each !== 'chords')
  return (
    <Segmented
      label={t('voice')}
      value={layer}
      disabled={disabled}
      options={layers.map((each) => ({
        value: each,
        label: t(`voices.${each}`),
        title: t(`layers.${each}`),
      }))}
      onChange={(next) => actions.dispatch({ type: 'layer', layer: next })}
    />
  )
}
