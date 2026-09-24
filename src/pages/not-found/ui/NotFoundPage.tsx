import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { ScreenTitle } from '@/shared/ui'

export function NotFoundPage() {
  const { t } = useTranslation('common')
  return (
    <>
      <ScreenTitle>{t('notFound.title')}</ScreenTitle>
      <Link
        to="/songs"
        className="inline-flex min-h-11 items-center font-semibold text-primary underline-offset-4 hover:underline"
      >
        {t('notFound.toSongs')}
      </Link>
    </>
  )
}
