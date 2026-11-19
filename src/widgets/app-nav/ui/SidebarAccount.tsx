import { Link, useRouterState } from '@tanstack/react-router'
import { ChevronsUpDown, UserRound } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { cn, OPEN_PLAINLY } from '@/shared/lib'
import { useAccount, useLearnerProfile } from '@/shared/lib/account'
import { Avatar, ConfirmDialog } from '@/shared/ui'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/primitives/dropdown-menu'
import { Tipped } from './Tipped'

/** A row of the account menu (lapwin.py's _MI): 40 tall, 12 in, the board's 15px ink. */
const ITEM =
  'min-h-10 pointer-coarse:min-h-11 justify-between gap-3 rounded-[8px] px-3 text-[0.9375rem]'

/**
 * The sidebar's foot as Claude's (canvas v392; owner: "the side bar is not done like the for example
 * claude sidebar"): one row, the learner's picture, name and ⌃⌄, current (its wash and
 * `aria-current`) on the Profile and every page its menu opens: Settings, the account pages,
 * Administration and Legal (lapwin.py; HIG Sidebars). It opens the kit's one menu above itself: who is
 * signed in, Profile, Settings, Language with the one in use, then Sign out under a line, asking first
 * as Settings' does. Signed out it says so truly: a person's outline and Sign in on the row, and its
 * menu Not signed in, Settings, Language, then Sign in apart. Help is not here: the User guide's home
 * is Settings › Support. Collapsed, the row is the picture alone; the menu keeps its width.
 */
export function SidebarAccount({ collapsed }: { collapsed: boolean }) {
  const { t, i18n } = useTranslation(['common', 'settings'])
  const { account, auth } = useAccount()
  const { state } = useLearnerProfile()
  const [asking, setAsking] = useState(false)
  const pathname = useRouterState({ select: (router) => router.location.pathname })
  const picture = state.kind === 'ready' ? state.profile.avatar : null
  const name = account ? account.name || account.email : t('nav.signIn')
  const current = ['/profile', '/account', '/settings', '/admin', '/legal'].some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  )
  const language = i18n.resolvedLanguage === 'ru' ? 'ru' : 'en'
  const trigger = (
    <DropdownMenuTrigger
      aria-label={collapsed ? name : undefined}
      aria-current={current ? 'page' : undefined}
      className={cn(
        'flex min-h-13 min-w-0 items-center gap-3 rounded-[10px] text-foreground transition-colors duration-150 ease-out hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none data-popup-open:bg-muted',
        current && 'bg-muted',
        collapsed ? 'size-11 justify-center' : 'w-full px-3',
      )}
    >
      {account ? (
        <Avatar name={name} picture={picture} size="icon" />
      ) : (
        <span
          aria-hidden
          className="grid size-8 shrink-0 place-items-center rounded-pill bg-muted text-muted-foreground"
        >
          <UserRound className="size-4.5" />
        </span>
      )}
      {collapsed ? null : (
        <>
          <span className="min-w-0 flex-1 truncate text-left text-[0.9375rem] font-semibold">
            {name}
          </span>
          <ChevronsUpDown aria-hidden className="size-4 shrink-0 text-muted-foreground" />
        </>
      )}
    </DropdownMenuTrigger>
  )
  return (
    <div className="mt-auto flex">
      <DropdownMenu>
        {collapsed ? <Tipped label={name}>{trigger}</Tipped> : trigger}
        <DropdownMenuContent
          side="top"
          align="start"
          sideOffset={8}
          className="w-(--anchor-width) gap-0.5"
        >
          <div className="truncate px-3 py-2 text-[0.8125rem] text-muted-foreground">
            {account ? account.email : t('nav.notSignedIn')}
          </div>
          {account ? (
            <DropdownMenuItem className={ITEM} render={<Link to="/profile" state={OPEN_PLAINLY} />}>
              {t('nav.profile')}
            </DropdownMenuItem>
          ) : null}
          <DropdownMenuItem className={ITEM} render={<Link to="/settings" state={OPEN_PLAINLY} />}>
            {t('nav.settings')}
          </DropdownMenuItem>
          <DropdownMenuItem
            className={ITEM}
            render={<Link to="/settings/general" state={OPEN_PLAINLY} />}
          >
            {t('settings:language.label')}
            <span className="text-muted-foreground">{t(`settings:language.${language}`)}</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="mx-3 my-1" />
          {account ? (
            <DropdownMenuItem className={ITEM} onClick={() => setAsking(true)}>
              {t('settings:accountPage.signOut')}
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              className={ITEM}
              render={<Link to="/account/sign-in" state={OPEN_PLAINLY} />}
            >
              {t('nav.signIn')}
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <ConfirmDialog
        open={asking}
        onOpenChange={setAsking}
        title={t('settings:accountPage.signOutTitle')}
        body={t('settings:accountPage.signOutInfo')}
        action={t('settings:accountPage.signOut')}
        cancel={t('settings:accountPage.signOutCancel')}
        onConfirm={() => void auth.signOut()}
      />
    </div>
  )
}
