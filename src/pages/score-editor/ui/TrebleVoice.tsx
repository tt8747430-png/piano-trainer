import { Hand, Music } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Segmented } from '@/shared/ui'
import { useEditorState, useScoreEditorContext } from '../model/editor-context'

/** The treble staff's two voices, as a notation app's voice buttons: the tune, or the right hand. */
const VOICES = ['melody', 'rh'] as const

/**
 * Which voice of the treble staff the keys write, shown only while the caret is on it: a click on
 * the sheet chooses the staff, this chooses the voice (Sibelius's 1 · 2).
 */
export function TrebleVoice() {
  const { t } = useTranslation('editor')
  const { actions } = useScoreEditorContext()
  const layer = useEditorState((state) => state.layer)
  if (layer !== 'melody' && layer !== 'rh') return null
  return (
    <div className="w-60 shrink-0">
      <Segmented
        label={t('voice')}
        value={layer}
        options={VOICES.map((voice) => ({
          value: voice,
          label: t(`layers.${voice}`),
          icon:
            voice === 'melody' ? (
              <Music aria-hidden className="size-5" />
            ) : (
              <Hand aria-hidden className="size-5" />
            ),
        }))}
        onChange={(voice) => actions.dispatch({ type: 'layer', layer: voice })}
      />
    </div>
  )
}
