import { SlidersHorizontal } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { SheetTrigger } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'

/**
 * The Setup's button in the Player's bar: its sliders at every size, named by its tooltip and for a
 * screen reader, as the View beside it is (ADR 0081, 0094).
 */
export function SetupTrigger() {
  const { t } = useTranslation('player')
  return (
    <SheetTrigger
      render={<Button variant="surface" size="icon" aria-label={t('setup')} title={t('setup')} />}
    >
      <SlidersHorizontal aria-hidden />
    </SheetTrigger>
  )
}
