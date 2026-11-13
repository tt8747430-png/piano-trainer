import { Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { Account } from '@/shared/api/auth'
import { useLocale } from '@/shared/i18n'
import { cn, useOnline } from '@/shared/lib'
import { useAccount, useSync } from '@/shared/lib/account'
import { syncLine, type SyncLine } from '@/shared/lib/sync'
import { Avatar, OpensMark } from '@/shared/ui'

/**
 * The account card at the top of Settings (A15), as iOS's Apple Account: the learner's initial, name
 * and email, and one line of where the sync stands; it opens their Account, where Sync lives.
 * Signed out, it asks them to sign in and says why.
 */
export function AccountCard({ current = false }: { current?: boolean }) {
  const { account } = useAccount()
  const { status } = useSync()
  const online = useOnline()
  const now = useMinute()
  const line = syncLine(online ? status : { ...status, state: 'offline' }, now)
  return <AccountCardFace account={account} line={line} current={current} />
}

/** The time now, to the minute: "Synced 2 min ago" keeps up while Settings stays open. */
function useMinute(): number {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 60_000)
    return () => window.clearInterval(timer)
  }, [])
  return now
}

/** The card as drawn: the learner and their line of sync, or the way to sign in. */
export function AccountCardFace({
  account,
  line,
  current = false,
}: {
  account: Account | null
  line: SyncLine
  /** Whether the account is the page open beside the list (a laptop). */
  current?: boolean
}) {
  const { t } = useTranslation('settings')
  const locale = useLocale()
  const said = (() => {
    switch (line.kind) {
      case 'synced':
        return t('sync.line.synced', {
          when: new Intl.RelativeTimeFormat(locale, { numeric: 'auto', style: 'short' }).format(
            line.ago.value,
            line.ago.unit,
          ),
        })
      case 'waiting':
        return t('sync.line.waiting', { count: line.count })
      default:
        return t(`sync.line.${line.kind}`)
    }
  })()
  const synced = line.kind === 'synced'
  return (
    <nav aria-label={t('account.label')} className="overflow-hidden card">
      <Link
        to={account ? '/settings/account' : '/account/sign-in'}
        data-current={current ? '' : undefined}
        className="flex min-h-19 items-center gap-4 py-3 pr-3 pl-4 transition-colors duration-200 ease-out hover:bg-muted focus-visible:-outline-offset-3 data-current:bg-muted"
      >
        <Avatar name={account ? account.name || account.email : null} size="row" />
        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="truncate text-lg font-bold">
            {account ? account.name || account.email : t('account.signIn')}
          </span>
          <span className="line-clamp-2 text-sm text-pretty text-muted-foreground">
            {account ? account.email : t('account.why')}
          </span>
          {account ? (
            <span
              data-slot="sync-line"
              className={cn(
                'flex items-center gap-1 text-sm',
                line.kind === 'failed'
                  ? 'text-destructive'
                  : synced
                    ? 'text-on-paint-grass'
                    : 'text-muted-foreground',
              )}
            >
              {synced ? <span aria-hidden className="size-1.75 rounded-pill bg-current" /> : null}
              {said}
            </span>
          ) : null}
        </span>
        <OpensMark />
      </Link>
    </nav>
  )
}
