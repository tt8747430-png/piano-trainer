import type { ErrorComponentProps } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useGoBack } from '@/shared/lib'
import { Button } from '@/shared/ui/primitives/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/shared/ui/primitives/empty'

type RouteErrorProps = Partial<ErrorComponentProps> & { reload?: () => void }

/**
 * The router's error screen for a route that throws while rendering; other routes are unaffected.
 * Offline, it says so: a screen not yet saved for offline use opens once the learner is back online.
 * Back leaves it even where no navigation shows (the Player, the Check): a reload opens the same URL.
 */
export function RouteError({ reload = () => window.location.reload() }: RouteErrorProps) {
  const { t } = useTranslation('common')
  const back = useGoBack({ to: '/' })
  return (
    <Empty role="alert" className="min-h-96">
      <EmptyHeader>
        <EmptyTitle>
          <h1 className="text-3xl">{t('errors.title')}</h1>
        </EmptyTitle>
        {navigator.onLine ? null : (
          <EmptyDescription className="text-base">{t('errors.offline')}</EmptyDescription>
        )}
      </EmptyHeader>
      <EmptyContent className="flex-row justify-center">
        <Button onClick={reload}>{t('errors.reload')}</Button>
        <Button variant="soft" onClick={back}>
          {t('back')}
        </Button>
      </EmptyContent>
    </Empty>
  )
}
