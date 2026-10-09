import { Repeat } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { keyHint } from '@/shared/lib/shortcuts'
import { RoundButton } from '@/shared/ui'
import { PLAYER_KEYS } from '../model/player-keys'

/** Loops the bar the cursor is in, or removes the loop: pressed, in neutrals, while a loop is set. */
export function LoopButton({ looped, onToggle }: { looped: boolean; onToggle: () => void }) {
  const { t } = useTranslation('player')
  return (
    <RoundButton
      label={t('loop')}
      title={keyHint(t('loop'), PLAYER_KEYS.loop)}
      icon={Repeat}
      aria-pressed={looped}
      onClick={onToggle}
      className="aria-pressed:bg-muted"
    />
  )
}
