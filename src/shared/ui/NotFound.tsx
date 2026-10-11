import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Empty, EmptyContent, EmptyHeader, EmptyTitle } from './primitives/empty'
import { usePageHeading } from './use-page-heading'

/** A page that is not there, or no longer (deleted in another tab): its one line, and the way on. */
export function NotFound({ children }: { children: ReactNode }) {
  const { t } = useTranslation('common')
  const heading = usePageHeading<HTMLHeadingElement>(t('notFound.title'))
  return (
    <Empty className="min-h-96">
      <EmptyHeader>
        <EmptyTitle>
          <h1 {...heading} className="text-3xl outline-none">
            {t('notFound.title')}
          </h1>
        </EmptyTitle>
      </EmptyHeader>
      <EmptyContent>{children}</EmptyContent>
    </Empty>
  )
}
