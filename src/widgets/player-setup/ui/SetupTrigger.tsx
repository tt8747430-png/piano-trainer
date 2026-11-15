import { Settings } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { SheetTrigger } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'

/**
 * The Player's Settings in its bar (R29: one gear, Flat's one menu), a toolbar's button (ADR 0115),
 * named by its tooltip and for a screen reader.
 */
export function SetupTrigger() {
  const { t } = useTranslation('player')
  return (
    <SheetTrigger
      render={
        <Button
          variant="tool"
          size="icon"
          aria-label={t('settingsPage.open')}
          title={t('settingsPage.open')}
        />
      }
    >
      <Settings aria-hidden />
    </SheetTrigger>
  )
}
