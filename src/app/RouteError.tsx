import type { ErrorComponentProps } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { Button } from '@/shared/ui/primitives/button'
import { Empty, EmptyContent, EmptyHeader, EmptyTitle } from '@/shared/ui/primitives/empty'

type RouteErrorProps = Partial<ErrorComponentProps> & { reload?: () => void }

/** The router's error screen for a route that throws while rendering; other routes are unaffected. */
export function RouteError({ reload = () => window.location.reload() }: RouteErrorProps) {
  const { t } = useTranslation('common')
  return (
    <Empty role="alert" className="min-h-96">
      <EmptyHeader>
        <EmptyTitle>
          <h1 className="text-xl font-bold">{t('errors.title')}</h1>
        </EmptyTitle>
      </EmptyHeader>
      <EmptyContent>
        <Button onClick={reload}>{t('errors.reload')}</Button>
      </EmptyContent>
    </Empty>
  )
}
