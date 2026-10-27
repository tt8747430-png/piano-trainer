import { Repeat } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/lib'
import { keyHint } from '@/shared/lib/shortcuts'
import { FloatingBarButton } from '@/shared/ui'
import { PLAYER_KEYS } from '../model/player-keys'
import { DOCK_BUTTON } from './dock-sizes'

/**
 * The transport's loop (ADR 0108, beside the tempo's controls as Chordify's transport carries it):
 * loops the bar the cursor is in, or removes the loop, as R does; pressed, in neutrals, while a loop
 * is set.
 */
export function LoopButton({ looped, onToggle }: { looped: boolean; onToggle: () => void }) {
  const { t } = useTranslation('player')
  return (
    <FloatingBarButton
      label={t('loop')}
      title={keyHint(t('loop'), PLAYER_KEYS.loop)}
      aria-pressed={looped}
      onClick={onToggle}
      className={cn(DOCK_BUTTON, 'aria-pressed:bg-muted')}
    >
      <Repeat aria-hidden />
    </FloatingBarButton>
  )
}
