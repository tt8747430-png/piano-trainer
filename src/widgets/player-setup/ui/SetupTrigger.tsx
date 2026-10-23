import { SlidersHorizontal } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { SheetTrigger } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'

/**
 * The Setup's button in the Player's bar: the sliders the editor's Song wears too, named on a wide
 * screen as the View beside it is (ADR 0081, 0085).
 */
export function SetupTrigger() {
  const { t } = useTranslation('player')
  return (
    <SheetTrigger
      render={
        <Button
          variant="surface"
          size="icon"
          aria-label={t('setup')}
          title={t('setup')}
          className="lg:w-auto lg:gap-2 lg:px-4"
        />
      }
    >
      <SlidersHorizontal aria-hidden />
      <span className="max-lg:sr-only">{t('setup')}</span>
    </SheetTrigger>
  )
}
