import { Repeat } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/shared/ui/primitives/button'

/** Loops the bar the cursor is in, or removes the loop: pressed, in neutrals, while a loop is set. */
export function LoopButton({ looped, onToggle }: { looped: boolean; onToggle: () => void }) {
  const { t } = useTranslation('player')
  return (
    <Button
      variant="surface"
      size="icon"
      aria-label={t('loop')}
      aria-pressed={looped}
      onClick={onToggle}
      className="aria-pressed:bg-muted"
    >
      <Repeat aria-hidden />
    </Button>
  )
}
