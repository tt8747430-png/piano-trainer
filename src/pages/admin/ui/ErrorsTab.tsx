import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocale } from '@/shared/i18n'
import { useAdmin } from '@/shared/lib/admin'
import { groupErrors, splitReports } from '../model/group-errors'
import { useLoaded } from '../model/use-loaded'
import { LoadedState } from './LoadedState'
import { daySaid, useNow } from '@/shared/lib'
import { SettingsGroup } from '@/shared/ui'

/**
 * Administration › Error log: what went wrong on learners' devices (their own reports are
 * Feedback's), one card as the Admin board's, one row a message, the most recently seen first: how
 * many times and on how many screens in crimson, then the latest's day, where and build, its stack
 * folded under Stack trace.
 */
export function ErrorsTab() {
  const { t } = useTranslation('admin')
  const locale = useLocale()
  const now = useNow()
  const admin = useAdmin()
  const load = useCallback(async () => {
    const result = await admin.errors()
    return result.ok ? { ok: true as const, value: splitReports(result.value).errors } : result
  }, [admin])
  const { loaded, reload } = useLoaded(load)
  return (
    <LoadedState loaded={loaded} reload={reload}>
      {(entries) =>
        entries.length === 0 ? (
          <p className="text-muted-foreground">{t('errors.none')}</p>
        ) : (
          <SettingsGroup flush>
            {groupErrors(entries).map(({ message, count, places, latest }) => (
              <details key={message} className="group leading-[normal]">
                <summary className="flex cursor-pointer list-none flex-col gap-1 px-4 py-3 focus-visible:-outline-offset-3 [&::-webkit-details-marker]:hidden">
                  <span className="font-mono text-sm font-semibold break-words">{message}</span>
                  <span className="text-sm font-semibold text-destructive">
                    {t('errors.count', { count, places })}
                  </span>
                  <span className="truncate text-[0.8125rem] text-muted-foreground">
                    {t('errors.where', {
                      date: daySaid(latest.at, locale, now),
                      path: latest.path,
                      build: latest.build,
                    })}
                  </span>
                  {latest.stack ? (
                    <span className="text-sm font-semibold text-link">{t('errors.stack')}</span>
                  ) : null}
                </summary>
                {latest.stack ? (
                  <pre className="mx-4 mb-3 overflow-x-auto rounded-[10px] bg-muted p-3 text-xs leading-normal whitespace-pre">
                    {latest.stack}
                  </pre>
                ) : null}
              </details>
            ))}
          </SettingsGroup>
        )
      }
    </LoadedState>
  )
}
