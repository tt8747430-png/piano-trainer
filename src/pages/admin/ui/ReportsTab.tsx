import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocale } from '@/shared/i18n'
import type { Report } from '@/shared/api/admin'
import { useAdmin } from '@/shared/lib/admin'
import { ConfirmDialog } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { useLoaded } from '../model/use-loaded'
import { useChangeProblem } from '../model/use-change-problem'
import { FailureLine, LoadedState } from './LoadedState'

/** The reasons a report gives, as the Public library's Report sheet offers them. */
const REASONS = ['not-theirs', 'offensive', 'spam', 'broken'] as const
const isReason = (value: string): value is (typeof REASONS)[number] =>
  (REASONS as readonly string[]).includes(value)

/**
 * Administration › Content reports: the Public library's reports, the newest first: the song, its author, the reason and note; Hide
 * (or Restore), Suspend publishing (asked first), Dismiss.
 */
export function ReportsTab() {
  const { t } = useTranslation(['admin', 'songs'])
  const locale = useLocale()
  const admin = useAdmin()
  const load = useCallback(() => admin.reports(), [admin])
  const { loaded, reload } = useLoaded(load)
  const { problem, after } = useChangeProblem(reload)
  const [blocking, setBlocking] = useState<Report | null>(null)
  return (
    <div className="flex flex-col gap-4">
      {problem ? <FailureLine reason={problem} /> : null}
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
                      <span className="ml-2 rounded-pill bg-muted px-2 py-0.5 text-xs font-medium">
                        {t('reports.hidden')}
                      </span>
                    ) : null}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t('reports.by', { name: report.authorName })} ·{' '}
                    {isReason(report.reason)
                      ? t(`songs:public.reasons.${report.reason}`)
                      : report.reason}{' '}
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
                    <Button variant="outline" onClick={() => setBlocking(report)}>
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
      <ConfirmDialog
        open={blocking !== null}
        onOpenChange={(open) => {
          if (!open) setBlocking(null)
        }}
        title={t('reports.blockTitle', { name: blocking?.authorName ?? '' })}
        body={t('reports.blockBody')}
        action={t('reports.block')}
        onConfirm={() => {
          if (blocking) void admin.block(blocking.authorId).then(after)
          setBlocking(null)
        }}
      />
    </div>
  )
}
