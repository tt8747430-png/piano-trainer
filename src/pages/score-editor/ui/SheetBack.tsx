import { useTranslation } from 'react-i18next'
import { Button } from '@/shared/ui/primitives/button'
import { BackMark } from '@/shared/ui'

/** The way back from a page of the takes' sheet to its first. */
export function SheetBack({ onBack }: { onBack: () => void }) {
  const { t } = useTranslation('editor')
  return (
    <Button variant="ghost" className="-ml-3 self-start" onClick={onBack}>
      <BackMark />
      {t('recorder.back')}
    </Button>
  )
}
