import { ChevronLeft } from 'lucide-react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/shared/ui/primitives/button'

/** One of the sheet's lists, as a page of it, with the way back to the first page. */
export function ListPage({ onBack, children }: { onBack: () => void; children: ReactNode }) {
  const { t } = useTranslation('player')
  return (
    <div className="flex flex-col gap-4">
      <Button variant="ghost" className="-ml-3 self-start" onClick={onBack}>
        <ChevronLeft data-icon="inline-start" />
        {t('back')}
      </Button>
      {children}
    </div>
  )
}
