import { SlidersHorizontal } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { SheetTrigger } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'

/**
 * The Setup's button in the Player's bar, a toolbar's (ADR 0115): its sliders at every size, named
 * by its tooltip and for a screen reader (ADR 0081, 0094).
 */
export function SetupTrigger() {
  const { t } = useTranslation('player')
  return (
    <SheetTrigger
      render={<Button variant="tool" size="icon" aria-label={t('setup')} title={t('setup')} />}
    >
      <SlidersHorizontal aria-hidden />
    </SheetTrigger>
  )
}
