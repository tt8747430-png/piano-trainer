import { Repeat } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { keyHint } from '@/shared/lib/shortcuts'
import { PLAYER_KEYS } from '../model/player-keys'
import { FloatingBarButton } from '@/shared/ui'
import { DOCK_CAPTIONED } from './dock-sizes'

/**
 * The transport's Loop (ADR 0108, R31-P): loops the bar the cursor is in, or removes the loop, as R
 * does; pressed while a loop is set.
 */
export function LoopButton({ looped, onToggle }: { looped: boolean; onToggle: () => void }) {
  const { t } = useTranslation('player')
  return (
    <FloatingBarButton
      label={t('loop')}
      title={keyHint(t('loop'), PLAYER_KEYS.loop)}
      aria-pressed={looped}
      caption={t('loop')}
      className={DOCK_CAPTIONED}
      onClick={onToggle}
    >
      <Repeat aria-hidden />
    </FloatingBarButton>
  )
}
