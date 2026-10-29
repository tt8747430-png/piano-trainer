import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocale } from '@/shared/i18n'
import { useAdmin } from '@/shared/lib/admin'
import { useLoaded } from '../model/use-loaded'
import { LoadedState } from './LoadedState'

/** What went wrong on learners' devices, the latest first: what, when, where, which build; its stack folded. */
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
            {entries.map((entry, i) => (
              <li key={i} className="flex min-w-0 flex-col gap-1 px-4 py-3">
                <span className="font-medium break-words">{entry.message}</span>
                <span className="truncate text-sm text-muted-foreground">
                  {t('errors.where', {
                    date: date.format(new Date(entry.at)),
                    path: entry.path,
                    build: entry.build,
                  })}
                </span>
                {entry.stack ? (
                  <details className="text-sm">
                    <summary className="cursor-pointer text-muted-foreground">
                      {t('errors.stack')}
                    </summary>
                    <pre className="mt-2 overflow-x-auto text-xs whitespace-pre">{entry.stack}</pre>
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
