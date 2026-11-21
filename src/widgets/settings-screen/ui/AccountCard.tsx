import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import type { Account } from '@/shared/api/auth'
import { useLocale } from '@/shared/i18n'
import { cn, formatLocale, useNow, useOnline } from '@/shared/lib'
import { useAccount, useSync } from '@/shared/lib/account'
import { syncLine, type SyncLine } from '@/shared/lib/sync'
import { Avatar, OpensMark } from '@/shared/ui'

/**
 * The account card at the top of Settings (A15), as iOS's Apple Account: the learner's initial, name
 * and email, and one line of where the sync stands; it opens their Account, where Sync lives.
 * Signed out, it asks them to sign in and says why.
 */
export function AccountCard({
  current = false,
  plain = false,
}: {
  current?: boolean
  /** The laptop dialog's nav row (LACCT): no card, a 36 picture, the name 15 semibold. */
  plain?: boolean
}) {
  const { account } = useAccount()
  const { status } = useSync()
  const online = useOnline()
  const now = useNow()
  const line = syncLine(online ? status : { ...status, state: 'offline' }, now)
  return <AccountCardFace account={account} line={line} current={current} plain={plain} />
}

/** The card as drawn: the learner and their line of sync, or the way to sign in. */
export function AccountCardFace({
  account,
  line,
  current = false,
  plain = false,
}: {
  account: Account | null
  line: SyncLine
  /** Whether the account is the page open beside the list (a laptop). */
  current?: boolean
  /** A plain row in the laptop dialog's nav, no card (LACCT). */
  plain?: boolean
}) {
  const { t } = useTranslation('settings')
  const locale = useLocale()
  const said = (() => {
    switch (line.kind) {
      case 'synced':
        return t('sync.line.synced', {
          when: new Intl.RelativeTimeFormat(formatLocale(locale), {
            numeric: 'auto',
            style: 'short',
          }).format(line.ago.value, line.ago.unit),
        })
      case 'waiting':
        return t('sync.line.waiting', { count: line.count })
      default:
        return t(`sync.line.${line.kind}`)
    }
  })()
  const synced = line.kind === 'synced'
  return (
    <nav aria-label={t('account.label')} className={plain ? undefined : 'overflow-hidden card'}>
      <Link
        to={account ? '/settings/account' : '/account/sign-in'}
        data-current={current ? '' : undefined}
        data-active={plain && current ? '' : undefined}
        className={cn(
          'flex items-center focus-visible:-outline-offset-3',
          plain
            ? 'gap-3 rounded-thumb px-3 py-1.5 choice'
            : 'min-h-19 gap-4 py-3 pr-3 pl-4 transition-colors duration-200 ease-out hover:bg-muted data-current:bg-muted',
        )}
      >
        <Avatar
          name={account ? account.name || account.email : null}
          size={plain ? 'nav' : 'row'}
        />
        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span
            className={cn(
              'truncate',
              plain ? 'text-subhead font-semibold' : 'text-[1.0625rem] font-bold',
              !account && !plain && 'text-link',
            )}
          >
            {account ? account.name || account.email : t('account.signIn')}
          </span>
          <span
            className={cn(
              'line-clamp-2 text-pretty text-muted-foreground',
              plain ? 'text-footnote' : 'text-sm',
            )}
          >
            {account ? account.email : t('account.why')}
          </span>
          {account ? (
            <span
              data-slot="sync-line"
              className={cn(
                'flex items-center gap-1 text-footnote',
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
