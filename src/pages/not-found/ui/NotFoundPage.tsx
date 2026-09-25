import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { ButtonLink } from '@/shared/ui'
import { Empty, EmptyContent, EmptyHeader, EmptyTitle } from '@/shared/ui/primitives/empty'

export function NotFoundPage() {
  const { t } = useTranslation('common')
  return (
    <Empty className="min-h-96">
      <EmptyHeader>
        <EmptyTitle>
          <h1 className="text-xl font-bold">{t('notFound.title')}</h1>
        </EmptyTitle>
      </EmptyHeader>
      <EmptyContent>
        <ButtonLink render={<Link to="/songs" />}>{t('notFound.toSongs')}</ButtonLink>
      </EmptyContent>
    </Empty>
  )
}
