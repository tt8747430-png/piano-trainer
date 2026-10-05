import { Hand, Music, Type, type LucideIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { LAYERS, type Layer } from '@/features/score-editor'
import { Segmented } from '@/shared/ui'
import { useEditorState, useScoreEditorContext } from '../model/editor-context'

/** Each layer's picture: chords are typed, the tune is notes, a hand is a hand (the left one mirrored). */
const LAYER_ICON: Readonly<Record<Layer, { icon: LucideIcon; mirrored?: true }>> = {
  chords: { icon: Type },
  melody: { icon: Music },
  rh: { icon: Hand },
  lh: { icon: Hand, mirrored: true },
}

/** What the keys and the tools write: Chords · Melody · Right hand · Left hand, each with its picture. */
export function LayerChoice() {
  const { t } = useTranslation('editor')
  const { actions } = useScoreEditorContext()
  const layer = useEditorState((state) => state.layer)
  return (
    <Segmented
      label={t('layers.label')}
      value={layer}
      options={LAYERS.map((value) => {
        const { icon: Icon, mirrored } = LAYER_ICON[value]
        return {
          value,
          label: t(`layers.${value}`),
          icon: <Icon aria-hidden className={mirrored ? 'size-5 -scale-x-100' : 'size-5'} />,
        }
      })}
      onChange={(next) => actions.dispatch({ type: 'layer', layer: next })}
    />
  )
}
