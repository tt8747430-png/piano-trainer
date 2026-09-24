import type { ErrorComponentProps } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { Button } from '@/shared/ui/primitives/button'
import { ScreenTitle } from '@/shared/ui'

type RouteErrorProps = Partial<ErrorComponentProps> & { reload?: () => void }

/** The router's error screen for a route that throws while rendering; other routes are unaffected. */
export function RouteError({ reload = () => window.location.reload() }: RouteErrorProps) {
  const { t } = useTranslation('common')
  return (
    <div role="alert">
      <ScreenTitle>{t('errors.title')}</ScreenTitle>
      <Button onClick={reload}>{t('errors.reload')}</Button>
    </div>
  )
}
