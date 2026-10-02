import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { ButtonLink, NotFound } from '@/shared/ui'

export function NotFoundPage() {
  const { t } = useTranslation('common')
  return (
    <NotFound>
      <ButtonLink render={<Link to="/songs" />}>{t('notFound.toSongs')}</ButtonLink>
    </NotFound>
  )
}
