import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { ScreenHeader } from '@/shared/ui'

export function NotFoundPage() {
  const { t } = useTranslation('common')
  return (
    <>
      <ScreenHeader title={t('notFound.title')} />
      <Link
        to="/songs"
        className="inline-flex min-h-11 items-center font-semibold text-primary underline-offset-4 hover:underline"
      >
        {t('notFound.toSongs')}
      </Link>
    </>
  )
}
