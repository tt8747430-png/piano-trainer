import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocale } from '@/shared/i18n'
import { useAdmin } from '@/shared/lib/admin'
import { splitReports } from '../model/group-errors'
import { useLoaded } from '@/shared/lib'
import { LoadedState } from './LoadedState'
import { daySaid, useNow } from '@/shared/lib'
import { SettingsGroup } from '@/shared/ui'

/**
 * Administration › Feedback (R32): what learners wrote in Settings › Report a problem, apart from the
 * Error log, the newest first, one card as the Admin board's: the day it came, then the text in full.
 * Anonymous, as sent.
 */
export function FeedbackTab() {
  const { t } = useTranslation('admin')
  const locale = useLocale()
  const now = useNow()
  const admin = useAdmin()
  const load = useCallback(async () => {
    const result = await admin.errors()
    return result.ok ? { ok: true as const, value: splitReports(result.value).feedback } : result
  }, [admin])
  const { loaded, reload } = useLoaded(load)
  return (
    <LoadedState loaded={loaded} reload={reload}>
      {(feedback) =>
        feedback.length === 0 ? (
          <p className="text-muted-foreground">{t('feedback.none')}</p>
        ) : (
          <section className="flex flex-col gap-2">
            <SettingsGroup flush>
              {feedback.map((each) => (
                <div
                  key={`${each.at} ${each.text}`}
                  className="flex min-w-0 flex-col gap-1 px-4 py-3 leading-[normal]"
                >
                  <span className="text-[0.8125rem] text-muted-foreground">
                    {daySaid(each.at, locale, now)}
                  </span>
                  <p className="leading-[1.4] wrap-break-word whitespace-pre-line">{each.text}</p>
                </div>
              ))}
            </SettingsGroup>
            <p className="mx-1 text-[0.8125rem] text-muted-foreground">{t('feedback.footnote')}</p>
          </section>
        )
      }
    </LoadedState>
  )
}
