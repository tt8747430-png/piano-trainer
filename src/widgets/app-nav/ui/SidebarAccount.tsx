import { Link, useRouterState } from '@tanstack/react-router'
import { Settings, UserRound } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn, OPEN_PLAINLY } from '@/shared/lib'
import { useAccount, useLearnerProfile } from '@/shared/lib/account'
import { Avatar } from '@/shared/ui'
import { Tipped } from './Tipped'

/**
 * The learner at the sidebar's foot (R32, Claude's account row): their picture, name (or Guest) and
 * "Profile", one link to the Profile, current there and on the account pages; Settings beside it, its
 * gear, current on Settings. Collapsed, the picture and the gear stand one over the other.
 */
export function SidebarAccount({ collapsed }: { collapsed: boolean }) {
  const { t } = useTranslation('common')
  const { account } = useAccount()
  const { state } = useLearnerProfile()
  const pathname = useRouterState({ select: (router) => router.location.pathname })
  const picture = state.kind === 'ready' ? state.profile.avatar : null
  const name = account ? account.name || account.email : t('nav.guest')
  const under = (prefixes: readonly string[]) =>
    prefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))
  const current = (on: boolean) => (on ? ({ 'aria-current': 'page' } as const) : {})
  const profile = (
    <Link
      to="/profile"
      state={OPEN_PLAINLY}
      aria-label={t('nav.profile')}
      {...current(under(['/profile', '/account']))}
      className={cn(
        'flex min-h-12 min-w-0 items-center gap-3 rounded-control choice focus-visible:-outline-offset-3',
        collapsed ? 'size-11 justify-center' : 'flex-1 px-2',
      )}
    >
      {account ? (
        <Avatar name={name} picture={picture} size="icon" />
      ) : (
        <span
          aria-hidden
          className="grid size-6 shrink-0 place-items-center rounded-pill bg-muted text-muted-foreground lg:size-5"
        >
          <UserRound className="size-4" />
        </span>
      )}
      {collapsed ? null : (
        <span className="flex min-w-0 flex-col leading-tight">
          <span className="truncate font-semibold text-foreground">{name}</span>
          <span className="text-sm text-muted-foreground">{t('nav.profile')}</span>
        </span>
      )}
    </Link>
  )
  const settings = (
    <Link
      to="/settings"
      state={OPEN_PLAINLY}
      aria-label={t('nav.settings')}
      title={t('nav.settings')}
      {...current(under(['/settings']))}
      className="grid size-11 shrink-0 place-items-center rounded-control text-muted-foreground choice focus-visible:-outline-offset-3"
    >
      <Settings aria-hidden className="size-5" />
    </Link>
  )
  return (
    <div
      className={cn('flex items-center gap-1 border-t border-border pt-3', collapsed && 'flex-col')}
    >
      {collapsed ? <Tipped label={t('nav.profile')}>{profile}</Tipped> : profile}
      {settings}
    </div>
  )
}
