import { X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { keyHint } from '@/shared/lib/shortcuts'
import { Button } from '@/shared/ui/primitives/button'
import { PLAYER_KEYS } from '../model/player-keys'

/**
 * Close, the score bar's first (ADR 0115), saying its key (Escape): a glass circle over the music,
 * as the editor's (loop round 61).
 */
export function PlayerClose({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation('common')
  return (
    <Button
      variant="bar"
      size="icon"
      aria-label={t('close')}
      title={keyHint(t('close'), PLAYER_KEYS.close)}
      onClick={onClose}
    >
      <X aria-hidden />
    </Button>
  )
}
