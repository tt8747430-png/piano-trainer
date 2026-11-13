import { EyeOff, Hand, Piano } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { ActionMenu, FloatingBarButton } from '@/shared/ui'
import { DOCK_CAPTIONED } from './dock-sizes'

/**
 * The transport's Keyboard (its canvas): what stands in the keys' place, chosen from a menu: the
 * keys, the hands at the keys (3D), or nothing, a thin strip left to bring them back. Its picture
 * says which.
 */
export function KeyboardButton({
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
  const shown = !keys ? 'off' : hands ? 'hands' : 'keys'
  const Icon = shown === 'off' ? EyeOff : shown === 'hands' ? Hand : Piano
  const label = t('keyboardTools.keyboard')
  return (
    <ActionMenu
      label={label}
      align="end"
      trigger={null}
      render={
        <FloatingBarButton
          label={label}
          title={label}
          caption={t(`keyboardTools.short.${shown}`)}
          className={DOCK_CAPTIONED}
        >
          <Icon aria-hidden />
        </FloatingBarButton>
      }
      actions={[
        {
          key: 'keys',
          label: t('keyboardTools.show'),
          icon: Piano,
          checked: shown === 'keys',
          onSelect: () => {
            onHands(false)
            onKeys(true)
          },
        },
        {
          key: 'hands',
          label: t('keyboardTools.hands'),
          icon: Hand,
          checked: shown === 'hands',
          onSelect: () => {
            onHands(true)
            onKeys(true)
          },
        },
        {
          key: 'off',
          label: t('keyboardTools.hide'),
          icon: EyeOff,
          checked: shown === 'off',
          onSelect: () => onKeys(false),
        },
      ]}
    />
  )
}
