import { X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { keyHint } from '@/shared/lib/shortcuts'
import { RoundButton } from '@/shared/ui'
import { PLAYER_KEYS } from '../model/player-keys'

/** Close, the toolbar's lead, saying its key (Escape); the title is printed on the sheet (ADR 0094). */
export function PlayerClose({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation('common')
  return (
    <RoundButton
      label={t('close')}
      title={keyHint(t('close'), PLAYER_KEYS.close)}
      icon={X}
      onClick={onClose}
    />
  )
}
