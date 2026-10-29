import { useLocation, type ErrorComponentProps } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useGoBack } from '@/shared/lib'
import { useReportError } from '@/shared/lib/error-reports'
import { usePageHeading } from '@/shared/ui'
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
 * What was thrown is reported (ADR 0116), once a run.
 */
export function RouteError({ error, reload = () => window.location.reload() }: RouteErrorProps) {
  const { t } = useTranslation('common')
  const report = useReportError()
  const path = useLocation({ select: (location) => location.pathname })
  useEffect(() => {
    if (error) report(error, path)
  }, [error, path, report])
  const back = useGoBack({ to: '/' })
  const heading = usePageHeading<HTMLHeadingElement>(t('errors.title'))
  return (
    <Empty role="alert" className="min-h-96">
      <EmptyHeader>
        <EmptyTitle>
          <h1 {...heading} className="text-3xl outline-none">
            {t('errors.title')}
          </h1>
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
