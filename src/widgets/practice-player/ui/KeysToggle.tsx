import { Piano } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/shared/ui/primitives/button'

/**
 * The piano keys under the music, shown or hidden from the bar (R29, Flat's keyboard button): the
 * saved choice, or this visit's where a lesson opened them (ADR 0111).
 */
export function KeysToggle({
  shown,
  onShow,
}: {
  shown: boolean
  onShow: (shown: boolean) => void
}) {
  const { t } = useTranslation('player')
  return (
    <Button
      variant="tool"
      size="icon"
      aria-label={t('pianoKeys')}
      title={t('pianoKeys')}
      aria-pressed={shown}
      onClick={() => onShow(!shown)}
    >
      <Piano aria-hidden />
    </Button>
  )
}
