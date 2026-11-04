import { useTranslation } from 'react-i18next'
import type { OpenMicrophone } from '@/shared/api/audio'
import { Sheet, SheetContent } from '@/shared/ui'
import { TunerReadout } from './TunerReadout'

/**
 * The Tuner over a screen (R29 B8, B11): its face in a sheet, listening while the sheet is open. Its
 * A4 is the one saved on the Tuner's Settings page, read here, set there.
 */
export function TunerSheet({
  open,
  onOpenChange,
  microphone,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Where its sound comes from: the browser's microphone, or a test's. */
  microphone?: OpenMicrophone
}) {
  const { t } = useTranslation('player')
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent title={t('tuner.title')}>
        <TunerReadout listening={open} {...(microphone ? { microphone } : {})} />
      </SheetContent>
    </Sheet>
  )
}
