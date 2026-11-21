import { Check } from 'lucide-react'
import { useCallback, useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import type { Report } from '@/shared/api/admin'
import { isOneOf } from '@/shared/lib'
import { useAdmin } from '@/shared/lib/admin'
import { ConfirmDialog, Said, say, SettingsGroup } from '@/shared/ui'
import { useLoaded } from '@/shared/lib'
import { useChangeProblem } from '../model/use-change-problem'
import { FailureLine, LoadedState } from './LoadedState'
import { cn } from '@/shared/lib'

/** The reasons a report gives, as the Public library's Report sheet offers them. */
const REASONS = ['not-theirs', 'offensive', 'spam', 'broken'] as const
const isReason = isOneOf<(typeof REASONS)[number]>(REASONS)

/**
 * Administration › Content reports (the Admin board): one card of the Public library's reports, the
 * newest first: the song (Hidden once hidden), its author and the reporter's words; Hide (or Restore),
 * Dismiss, and Suspend publishing in crimson, asked first. None open is a tick and its line.
 */
export function ReportsTab() {
  const { t } = useTranslation(['admin', 'songs'])
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
            <Said icon={Check} title={t('reports.none')} description={t('reports.noneLine')} />
          ) : (
            <SettingsGroup flush>
              {reports.map((report) => (
                <div
                  key={`${report.itemId} ${report.reporterId}`}
                  className="flex flex-col gap-2 pt-3 pb-2 ps-4 pe-3 leading-[normal]"
                >
                  <div className="flex items-baseline gap-2">
                    <span className="min-w-0 flex-1 font-semibold">{report.itemTitle}</span>
                    {report.hidden ? (
                      <span className="flex h-5.5 items-center rounded-pill bg-muted px-2 text-xs font-bold">
                        {t('reports.hidden')}
                      </span>
                    ) : null}
                  </div>
                  <span className="text-sm leading-[normal] text-muted-foreground">
                    {t('reports.by', { name: report.authorName })} · “
                    {report.note.trim() ||
                      (isReason(report.reason)
                        ? t(`songs:public.reasons.${report.reason}`)
                        : report.reason)}
                    ”
                  </span>
                  <div className="-ms-2 flex flex-wrap gap-1">
                    <Act onClick={() => void admin.hide(report.itemId, !report.hidden).then(after)}>
                      {report.hidden ? t('reports.show') : t('reports.hide')}
                    </Act>
                    <Act
                      onClick={() =>
                        void admin.dismiss(report.itemId, report.reporterId).then((result) => {
                          after(result)
                          if (result.ok) say(t('reports.dismissed'))
                        })
                      }
                    >
                      {t('reports.dismiss')}
                    </Act>
                    <Act destructive onClick={() => setBlocking(report)}>
                      {t('reports.block')}
                    </Act>
                  </div>
                </div>
              ))}
            </SettingsGroup>
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

/** A report's act, as the board's: its word in the link colour (crimson for the loss), 44 tall. */
function Act({
  destructive = false,
  onClick,
  children,
}: {
  destructive?: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'h-11 rounded-control px-2 text-subhead font-semibold transition-colors duration-150 ease-out hover:bg-muted/60 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none',
        destructive ? 'text-destructive' : 'text-link',
      )}
    >
      {children}
    </button>
  )
}
