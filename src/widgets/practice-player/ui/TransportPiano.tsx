import { EyeOff, Hand, Piano } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useMidiSummary } from '@/features/connect-midi'
import { PianoSheet } from '@/features/live-keyboard'
import { FloatingBarButton } from '@/shared/ui'
import { DOCK_CAPTIONED } from './dock-sizes'

/**
 * The transport's Keyboard, opening the Piano sheet: its button says what stands in the keys' place
 * (2D · 3D · Off) under its picture.
 */
export function TransportPiano({
  keys,
  hands,
  onKeys,
  onHands,
}: {
  keys: boolean
  hands: boolean
  onKeys: (shown: boolean) => void
  onHands: (shown: boolean) => void
}) {
  const { t } = useTranslation('common')
  const midi = useMidiSummary()
  const Icon = !keys ? EyeOff : hands ? Hand : Piano
  return (
    <PianoSheet
      keys={keys}
      hands={hands}
      onKeys={onKeys}
      onHands={onHands}
      midi={midi}
      trigger={(open) => (
        <FloatingBarButton
          label={t('keyboardTools.keyboard')}
          caption={t(`keyboardTools.short.${keys ? (hands ? 'hands' : 'keys') : 'off'}`)}
          aria-haspopup="dialog"
          className={DOCK_CAPTIONED}
          onClick={open}
        >
          <Icon aria-hidden />
        </FloatingBarButton>
      )}
    />
  )
}
