import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { daySaid, formatLocale, useNow } from '@/shared/lib'
import { useLocale } from '@/shared/i18n'
import { RowLink, SettingsGroup } from '@/shared/ui'
import { useOverview } from '../model/use-overview'
import { LoadedState } from './LoadedState'

/**
 * A figure of the week (the Admin board's tile): the number, what it counts, its comparison; each
 * opens Accounts, which it counts.
 */
function Tile({ value, label, compare }: { value: string; label: string; compare: string }) {
  return (
    <Link
      to="/admin/$section"
      params={{ section: 'accounts' }}
      className="flex min-w-0 flex-col justify-center gap-0.5 card px-4 py-3 leading-[normal] lg:items-center lg:text-center transition-colors duration-200 ease-out hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
    >
      <span className="text-[1.625rem] font-bold tabular-nums">{value}</span>
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="min-h-[1lh] text-[0.8125rem] text-muted-foreground tabular-nums">
        {compare}
      </span>
    </Link>
  )
}

/**
 * Administration › Overview (the Admin board, loop round 63): This week's three figures (accounts,
 * the week's new ones, its active ones), each with its comparison; then Needs attention, the open
 * reports, the week's errors and the unpublished drafts, each a row 60 tall opening its section. A count is
 * said once: what needs doing is a row, never a tile too.
 */
export function OverviewTab() {
  const { t } = useTranslation('admin')
  const locale = useLocale()
  const now = useNow()
  const { loaded, reload } = useOverview()
  const diff = new Intl.NumberFormat(formatLocale(locale), { signDisplay: 'exceptZero' })
  return (
    <LoadedState loaded={loaded} reload={reload}>
      {(overview) => (
        <>
          <SettingsGroup title={t('overview.title')} bare>
            <div className="grid grid-cols-2 gap-2 lg:grid-cols-3 lg:gap-4">
              <Tile
                value={overview.accounts}
                label={t('overview.accounts')}
                compare={t('overview.joined', { count: overview.newThisWeek })}
              />
              <Tile
                value={String(overview.newThisWeek)}
                label={t('overview.newThisWeek')}
                compare={t('overview.onLastWeek', {
                  diff: diff.format(overview.newThisWeek - overview.newLastWeek),
                })}
              />
              <Tile
                value={String(overview.activeThisWeek)}
                label={t('overview.activeThisWeek')}
                compare={
                  overview.activeShare === null
                    ? ''
                    : t('overview.share', { percent: overview.activeShare })
                }
              />
            </div>
          </SettingsGroup>
          <SettingsGroup
            title={t('overview.attention')}
            flush
            className="[&_[data-slot=settings-card]>*]:min-h-15"
          >
            <RowLink
              title={t('sections.reports')}
              detail={
                overview.oldestReportAt === null
                  ? t('overview.reportsNone')
                  : t('overview.reportsOpen', {
                      count: overview.reports,
                      when: daySaid(overview.oldestReportAt, locale, now, false),
                    })
              }
              render={<Link to="/admin/$section" params={{ section: 'reports' }} />}
            />
            <RowLink
              title={t('sections.errors')}
              detail={
                overview.errorsThisWeek === 0
                  ? t('overview.errorsNone')
                  : t('overview.errorsWeek', {
                      count: overview.errorsThisWeek,
                      kinds: t('overview.kinds', { count: overview.errorKinds }),
                    })
              }
              render={<Link to="/admin/$section" params={{ section: 'errors' }} />}
            />
            <RowLink
              title={t('sections.drafts')}
              detail={
                overview.unpublished === 0
                  ? t('overview.unpublishedNone')
                  : t('overview.unpublished', { count: overview.unpublished })
              }
              render={<Link to="/admin/$section" params={{ section: 'drafts' }} />}
            />
          </SettingsGroup>
        </>
      )}
    </LoadedState>
  )
}
