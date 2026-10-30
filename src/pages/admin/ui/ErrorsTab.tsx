import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocale } from '@/shared/i18n'
import { useAdmin } from '@/shared/lib/admin'
import { groupErrors } from '../model/group-errors'
import { useLoaded } from '../model/use-loaded'
import { LoadedState } from './LoadedState'

/**
 * What went wrong on learners' devices, one row a message, the most recently seen first: how many
 * times and on how many screens, then the latest's when, where and build, its stack folded.
 */
export function ErrorsTab() {
  const { t } = useTranslation('admin')
  const locale = useLocale()
  const admin = useAdmin()
  const load = useCallback(() => admin.errors(), [admin])
  const { loaded, reload } = useLoaded(load)
  const date = new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short' })
  return (
    <LoadedState loaded={loaded} reload={reload}>
      {(entries) =>
        entries.length === 0 ? (
          <p className="text-muted-foreground">{t('errors.none')}</p>
        ) : (
          <ol className="flex flex-col divide-y divide-border card">
            {groupErrors(entries).map(({ message, count, places, latest }) => (
              <li key={message} className="flex min-w-0 flex-col gap-1 px-4 py-3">
                <span className="font-medium break-words">{message}</span>
                <span className="text-sm font-medium text-muted-foreground">
                  {t('errors.count', { count, places })}
                </span>
                <span className="truncate text-sm text-muted-foreground">
                  {t('errors.where', {
                    date: date.format(new Date(latest.at)),
                    path: latest.path,
                    build: latest.build,
                  })}
                </span>
                {latest.stack ? (
                  <details className="text-sm">
                    <summary className="cursor-pointer py-3 text-muted-foreground">
                      {t('errors.stack')}
                    </summary>
                    <pre className="mt-2 overflow-x-auto text-xs whitespace-pre">
                      {latest.stack}
                    </pre>
                  </details>
                ) : null}
              </li>
            ))}
          </ol>
        )
      }
    </LoadedState>
  )
}
