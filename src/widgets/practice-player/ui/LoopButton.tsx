import { Repeat } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { keyHint } from '@/shared/lib/shortcuts'
import { PLAYER_KEYS } from '../model/player-keys'
import { FootTool } from './FootTool'

/**
 * The foot bar's Loop (ADR 0108, R29 B8): loops the bar the cursor is in, or removes the loop, as R
 * does; pressed while a loop is set.
 */
export function LoopButton({ looped, onToggle }: { looped: boolean; onToggle: () => void }) {
  const { t } = useTranslation('player')
  return (
    <FootTool
      icon={Repeat}
      label={t('loop')}
      title={keyHint(t('loop'), PLAYER_KEYS.loop)}
      aria-pressed={looped}
      onClick={onToggle}
    />
  )
}
