import { Metronome } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/lib'
import { FloatingBarButton } from '@/shared/ui'
import { DOCK_BUTTON } from './dock-sizes'

/**
 * The transport's metronome (B7, A35): a quick toggle after the loop, pressed in neutrals while the
 * click sounds with the music, as the loop is. Its sound and beats are the Metronome's (A39); its
 * volume and the count-in are the Player's settings page's.
 */
export function ClickButton({ on, onChange }: { on: boolean; onChange: (on: boolean) => void }) {
  const { t } = useTranslation('player')
  return (
    <FloatingBarButton
      label={t('sound.click')}
      title={t('sound.clickInfo')}
      aria-pressed={on}
      onClick={() => onChange(!on)}
      className={cn(DOCK_BUTTON, 'aria-pressed:bg-chosen')}
    >
      <Metronome aria-hidden />
    </FloatingBarButton>
  )
}
