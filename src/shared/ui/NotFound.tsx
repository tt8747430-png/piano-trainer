import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { RouteState } from './RouteState'

/** A page that is not there, or no longer (deleted in another tab): what happened, why, and the way on. */
export function NotFound({ children }: { children: ReactNode }) {
  const { t } = useTranslation('common')
  return (
    <RouteState mark="missing" title={t('notFound.title')} line={t('notFound.line')}>
      {children}
    </RouteState>
  )
}
