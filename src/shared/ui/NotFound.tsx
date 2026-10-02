import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Empty, EmptyContent, EmptyHeader, EmptyTitle } from './primitives/empty'

/** A page that is not there, or no longer (deleted in another tab): its one line, and the way on. */
export function NotFound({ children }: { children: ReactNode }) {
  const { t } = useTranslation('common')
  return (
    <Empty className="min-h-96">
      <EmptyHeader>
        <EmptyTitle>
          <h1 className="text-3xl">{t('notFound.title')}</h1>
        </EmptyTitle>
      </EmptyHeader>
      <EmptyContent>{children}</EmptyContent>
    </Empty>
  )
}
