import { Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { Account } from '@/shared/api/auth'
import { useLocale } from '@/shared/i18n'
import { useOnline } from '@/shared/lib'
import { useAccount, useSync } from '@/shared/lib/account'
import { syncLine, type SyncLine } from '@/shared/lib/sync'
import { Avatar, RowLink } from '@/shared/ui'

/**
 * The account card at the top of Settings (A15), as iOS's Apple Account: the learner's initial, name
 * and email, and one line of where the sync stands; it opens their Account, where Sync lives.
 * Signed out, it asks them to sign in and says why.
 */
export function AccountCard() {
  const { account } = useAccount()
  const { status } = useSync()
  const online = useOnline()
  const now = useMinute()
  const line = syncLine(online ? status : { ...status, state: 'offline' }, now)
  return <AccountCardFace account={account} line={line} />
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
export function AccountCardFace({ account, line }: { account: Account | null; line: SyncLine }) {
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
  return (
    <nav aria-label={t('account.label')} className="flex flex-col card p-1.5">
      {account ? (
        <RowLink
          title={account.name || account.email}
          detail={account.email}
          mark={<Avatar name={account.name || account.email} size="row" />}
          render={<Link to="/settings/account" />}
        >
          <span
            data-slot="sync-line"
            className={
              line.kind === 'failed'
                ? 'block text-sm text-destructive'
                : 'block text-sm text-muted-foreground'
            }
          >
            {said}
          </span>
        </RowLink>
      ) : (
        <RowLink
          title={t('account.signIn')}
          detail={t('account.why')}
          mark={<Avatar name={null} size="row" />}
          render={<Link to="/account/sign-in" />}
        />
      )}
    </nav>
  )
}
