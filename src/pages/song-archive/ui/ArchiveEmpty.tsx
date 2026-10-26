import { Archive } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/shared/ui/primitives/empty'

/** The archive with nothing in it: what it is for, in a line. */
export function ArchiveEmpty() {
  const { t } = useTranslation('songs')
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Archive aria-hidden />
        </EmptyMedia>
        <EmptyTitle>{t('archive.empty.title')}</EmptyTitle>
        <EmptyDescription>{t('archive.empty.description')}</EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}
