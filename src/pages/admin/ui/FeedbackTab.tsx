import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocale } from '@/shared/i18n'
import { useAdmin } from '@/shared/lib/admin'
import { splitReports } from '../model/group-errors'
import { useLoaded } from '../model/use-loaded'
import { LoadedState } from './LoadedState'

/**
 * Administration › Feedback (R32): what learners wrote in Settings › Report a problem, apart from the
 * Error log, the newest first: the text in full, then when, on which screen and in which build.
 * Anonymous, as sent.
 */
export function FeedbackTab() {
  const { t } = useTranslation('admin')
  const locale = useLocale()
  const admin = useAdmin()
  const load = useCallback(async () => {
    const result = await admin.errors()
    return result.ok ? { ok: true as const, value: splitReports(result.value).feedback } : result
  }, [admin])
  const { loaded, reload } = useLoaded(load)
  const date = new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short' })
  return (
    <LoadedState loaded={loaded} reload={reload}>
      {(feedback) =>
        feedback.length === 0 ? (
          <p className="text-muted-foreground">{t('feedback.none')}</p>
        ) : (
          <section className="flex flex-col gap-2">
            <ol
              aria-label={t('sections.feedback')}
              className="flex flex-col divide-y divide-hairline card"
            >
              {feedback.map((each) => (
                <li
                  key={`${each.at} ${each.text}`}
                  className="flex min-w-0 flex-col gap-1 px-4 py-3"
                >
                  <p className="font-medium wrap-break-word whitespace-pre-line">{each.text}</p>
                  <p className="text-sm text-muted-foreground">
                    {t('errors.where', {
                      date: date.format(new Date(each.at)),
                      path: each.path,
                      build: each.build,
                    })}
                  </p>
                </li>
              ))}
            </ol>
            <p className="px-3 text-sm text-muted-foreground">{t('feedback.footnote')}</p>
          </section>
        )
      }
    </LoadedState>
  )
}
