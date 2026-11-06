import { Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/shared/ui/primitives/empty'

/** The Trash with nothing in it: what it is for, in a line. */
export function TrashEmpty() {
  const { t } = useTranslation('songs')
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Trash2 aria-hidden />
        </EmptyMedia>
        <EmptyTitle>{t('trash.empty.title')}</EmptyTitle>
        <EmptyDescription>{t('trash.empty.description')}</EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}
