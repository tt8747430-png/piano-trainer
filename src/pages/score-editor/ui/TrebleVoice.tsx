import { Hand, Music } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useMediaQuery } from '@/shared/lib'
import { Segmented } from '@/shared/ui'
import { useEditorState, useScoreEditorContext } from '../model/editor-context'

/** The treble staff's two voices, as a notation app's voice buttons: the tune, or the right hand. */
const VOICES = ['melody', 'rh'] as const

/** A laptop's width, where the voices say their names beside their pictures. */
const LAPTOP = '(min-width: 64rem)'

/**
 * Which voice of the treble staff the keys write, shown only while the caret is on it: a click on
 * the sheet chooses the staff, this chooses the voice (Sibelius's 1 · 2). Its pictures alone on a
 * phone, named in full for a screen reader; first among a laptop's tools.
 */
export function TrebleVoice() {
  const { t } = useTranslation(['editor', 'common'])
  const { actions } = useScoreEditorContext()
  const layer = useEditorState((state) => state.layer)
  const named = useMediaQuery(LAPTOP)
  const shortName = (voice: (typeof VOICES)[number]) =>
    voice === 'rh' ? t('common:handsShort.rh') : t('layers.melody')
  if (layer !== 'melody' && layer !== 'rh') return null
  return (
    <div className="w-25 shrink-0 lg:order-first lg:w-60">
      <Segmented
        label={t('voice')}
        value={layer}
        options={VOICES.map((voice) => ({
          value: voice,
          // Short under its Voice label, named in full.
          label: named ? shortName(voice) : '',
          title: t(`layers.${voice}`),
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
