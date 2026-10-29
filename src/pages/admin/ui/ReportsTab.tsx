import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocale } from '@/shared/i18n'
import { useAdmin } from '@/shared/lib/admin'
import { Button } from '@/shared/ui/primitives/button'
import { useLoaded } from '../model/use-loaded'
import { LoadedState } from './LoadedState'

/**
 * The Public library's reports, the newest first: the song, its author, the reason and note; Hide
 * (or Show again), Stop them publishing, Dismiss.
 */
export function ReportsTab() {
  const { t } = useTranslation(['admin', 'songs'])
  const locale = useLocale()
  const admin = useAdmin()
  const [problem, setProblem] = useState(false)
  const load = useCallback(() => admin.reports(), [admin])
  const { loaded, reload } = useLoaded(load)
  const after = (result: { ok: boolean }) => {
    setProblem(!result.ok)
    reload()
  }
  return (
    <div className="flex flex-col gap-4">
      {problem ? <p role="alert">{t('refused')}</p> : null}
      <LoadedState loaded={loaded} reload={reload}>
        {(reports) =>
          reports.length === 0 ? (
            <p className="text-muted-foreground">{t('reports.none')}</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {reports.map((report) => (
                <li
                  key={`${report.itemId} ${report.reporterId}`}
                  className="flex flex-col gap-2 card p-4"
                >
                  <p className="font-semibold">
                    {report.itemTitle}
                    {report.hidden ? (
                      <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-xs font-medium">
                        {t('reports.hidden')}
                      </span>
                    ) : null}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t('reports.by', { name: report.authorName })} ·{' '}
                    {t(`songs:public.reasons.${report.reason as 'spam'}`, {
                      defaultValue: report.reason,
                    })}{' '}
                    ·{' '}
                    {new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(
                      new Date(report.reportedAt),
                    )}
                  </p>
                  {report.note ? <p className="text-sm">{report.note}</p> : null}
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      onClick={() => void admin.hide(report.itemId, !report.hidden).then(after)}
                    >
                      {report.hidden ? t('reports.show') : t('reports.hide')}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => void admin.block(report.authorId).then(after)}
                    >
                      {t('reports.block')}
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() =>
                        void admin.dismiss(report.itemId, report.reporterId).then(after)
                      }
                    >
                      {t('reports.dismiss')}
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )
        }
      </LoadedState>
    </div>
  )
}
