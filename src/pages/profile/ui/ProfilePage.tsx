import { Link } from '@tanstack/react-router'
import { Bell, Camera, Clock, Flame, Music, Settings, type LucideIcon } from 'lucide-react'
import { useMemo, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { useNotifications } from '@/entities/notification'
import { selectDays, streak, useProgress } from '@/entities/progress'
import { useProfileFigures } from '@/features/track-achievements'
import { cn } from '@/shared/lib'
import { useAccount, useLearnerProfile } from '@/shared/lib/account'
import { useAppUpdate } from '@/shared/lib/app-update'
import { Avatar, ButtonLink, ScreenHeader } from '@/shared/ui'
import { useToday } from '@/widgets/practice-days'
import { usePracticeTime } from '../model/format'
import { AchievementsPreview } from './AchievementsPreview'
import { BadgesPreview } from './BadgesPreview'
import { HistoryPreview } from './HistoryPreview'
import { WeekCard } from './WeekCard'

/**
 * The Profile (the Profile boards, r50): the learner's name in its bar with the bell and the gear in
 * one glass; their picture, name and handle, and three tiles; then the week, Practice history, Badges
 * and Achievements, each under its own heading. A phone reads them in one column; a laptop in rows
 * that meet: the learner beside the tiles, the week beside the badges, the history beside the
 * achievements, each pair's boxes stretched to one bottom edge. A guest sees the device's figures and
 * Sign in; while the server's profile is read, its lines are grey.
 */
export function ProfilePage() {
  const { t } = useTranslation(['account', 'common', 'settings'])
  const { account } = useAccount()
  const { state } = useLearnerProfile()
  const updateReady = useAppUpdate().status === 'ready'
  const unread = useNotifications((held) => held.notices.filter((notice) => !notice.read).length)
  const name = state.kind === 'ready' && state.profile.name ? state.profile.name : account?.name
  const bell =
    unread > 0
      ? t('profile.notifications.unread', { count: unread })
      : t('profile.notifications.open')
  const gear = updateReady
    ? `${t('common:nav.settings')}, ${t('settings:about.update.ready')}`
    : t('common:nav.settings')
  return (
    // The learner 8 under the head on a phone and 16 on a laptop, as the boards start a place's content.
    <div className="flex flex-col gap-2 lg:gap-4">
      <ScreenHeader
        column="until-laptop"
        title={account ? name || account.email : t('profile.title')}
        large
        tools={
          // The bell and Settings, each its own 44 glass circle 8 apart, as every board's bar (IB).
          <div className="flex items-center gap-2">
            <span className="relative rounded-pill glass">
              <ButtonLink
                variant="tool"
                size="icon"
                aria-label={bell}
                title={bell}
                render={<Link to="/profile/notifications" />}
              >
                <Bell aria-hidden />
              </ButtonLink>
              {unread > 0 ? (
                <span
                  aria-hidden
                  className="pointer-events-none absolute top-1.5 right-1.25 grid h-4.5 min-w-4.5 place-items-center rounded-pill bg-destructive px-1 text-xs leading-none font-bold text-white tabular-nums"
                >
                  {unread > 99 ? '99+' : unread}
                </span>
              ) : null}
            </span>
            <span className="relative rounded-pill glass">
              <ButtonLink
                variant="tool"
                size="icon"
                aria-label={gear}
                title={gear}
                render={<Link to="/settings" />}
              >
                <Settings aria-hidden />
              </ButtonLink>
              {updateReady ? (
                <span
                  aria-hidden
                  className="pointer-events-none absolute top-1 right-1 size-2.5 rounded-pill bg-destructive ring-2 ring-background"
                />
              ) : null}
            </span>
          </div>
        }
      />
      {/* A phone: the learner, the tiles, the week, the history, the badges, the achievements, 16
          apart and each section 32 under the one before. A laptop: the pairs in rows 32 apart. */}
      <div className="flex flex-col gap-4 lg:grid lg:grid-cols-2 lg:items-stretch lg:gap-8">
        <div className="flex flex-col justify-center gap-4 lg:max-xl:col-span-2">
          <Hero />
        </div>
        <div className="flex flex-col justify-center lg:max-xl:col-span-2">
          <Tiles />
        </div>
        <Cell>
          <WeekCard />
        </Cell>
        <Cell className="max-lg:order-5">
          <BadgesPreview />
        </Cell>
        <Cell>
          <HistoryPreview />
        </Cell>
        <Cell className="max-lg:order-6">
          <AchievementsPreview />
        </Cell>
      </div>
    </div>
  )
}

/**
 * A section's place on the page (the board's `pcell`): on a phone 32 under the one before; on a
 * laptop its box stretches to its neighbour's bottom, what it holds centred in it: the box is the last
 * child of the fold's body (the section's last child), so the fold's own grid is never centred.
 */
function Cell({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div
      className={cn(
        'flex min-w-0 flex-col max-lg:mt-4 lg:[&>section]:flex-1 lg:[&>section>:last-child]:flex-1 lg:[&>section>:last-child>div>:last-child]:flex-1 lg:[&>section>:last-child>div>:last-child]:justify-center',
        className,
      )}
    >
      {children}
    </div>
  )
}

/**
 * The learner (HERO_P): their picture, 76, Edit photo on its lower right, then their name at 28 and
 * "@handle · Joined 2025"; a guest's plain figure, Exploring as a guest, what their practice stands to
 * lose and Sign in, in the same place.
 */
function Hero() {
  const { t } = useTranslation('account')
  const { account } = useAccount()
  const { state } = useLearnerProfile()
  const profile = state.kind === 'ready' ? state.profile : null
  const name = profile?.name || account?.name || account?.email || null
  const year = profile ? new Date(profile.joined).getFullYear() : null
  return (
    <section aria-label={name ?? t('profile.guest')} className="flex items-center gap-4">
      <div className="relative shrink-0">
        <Avatar name={account ? name : null} size="hero" picture={profile?.avatar ?? null} />
        {account ? (
          // Edit photo (the board's CAM): a 30 round on the card's paper, reaching 44.
          <Link
            to="/settings/account/profile"
            aria-label={t('profile.editPhoto')}
            title={t('profile.editPhoto')}
            className="group/cam absolute -right-2 -bottom-2 grid size-11 place-items-center rounded-pill"
          >
            <span className="grid size-7.5 place-items-center rounded-pill bg-card text-foreground ring-1 ring-border transition-colors duration-200 ease-out group-hover/cam:bg-muted">
              <Camera aria-hidden className="size-4" />
            </span>
          </Link>
        ) : null}
      </div>
      {account ? (
        state.kind === 'loading' ? (
          <div aria-busy className="flex flex-1 flex-col gap-2">
            <p role="status" className="sr-only">
              {t('profile.loading')}
            </p>
            <span aria-hidden className="h-6 rounded-[8px] bg-muted motion-safe:animate-pulse" />
            <span
              aria-hidden
              className="h-3.5 w-1/2 rounded-[7px] bg-muted motion-safe:animate-pulse"
            />
          </div>
        ) : (
          <div className="flex min-w-0 flex-col gap-0.5">
            <p className="text-3xl leading-tight font-bold tracking-[-0.01em] text-balance break-words">
              {name}
            </p>
            {year ? (
              <p className="text-[0.9375rem] text-muted-foreground">
                {profile?.handle
                  ? t('profile.handleJoined', { handle: profile.handle, year })
                  : t('profile.joined', { year })}
              </p>
            ) : null}
          </div>
        )
      ) : (
        <div className="flex min-w-0 flex-1 flex-col items-start gap-2">
          <p className="text-2xl leading-tight font-bold text-balance">{t('profile.guest')}</p>
          {/* What a guest stands to lose, said truly (R38, canvas 136): kept here, not everywhere. */}
          <p className="text-sm/[1.4] text-pretty text-muted-foreground">
            {t('profile.guestKept')}
          </p>
          {/* GUEST_P's Sign in: a 44 honey pill, bold. */}
          <ButtonLink
            className="h-11 rounded-full px-5 font-bold"
            render={<Link to="/account/sign-in" />}
          >
            {t('profile.signIn')}
          </ButtonLink>
        </div>
      )}
    </section>
  )
}

/**
 * The day streak (to Streak), the songs learned (to Songs) and the time practised (to Practice
 * history), side by side, 12 apart: each figure in Soft Ink's mark but the flame, a streak alive.
 */
function Tiles() {
  const { t } = useTranslation('account')
  const days = useProgress(selectDays)
  const today = useToday()
  const figures = useProfileFigures()
  const time = usePracticeTime()
  const run = useMemo(() => streak(days, today), [days, today])
  return (
    <ul aria-label={t('profile.figures')} className="grid w-full grid-cols-3 gap-3">
      <li className="min-w-0">
        <Link to="/profile/streak" className={cn(TILE, TILE_LINK)}>
          <TileFace
            label={t('profile.tiles.streak')}
            value={run}
            icon={Flame}
            tone={run > 0 ? 'fill-current text-played' : 'text-muted-foreground'}
          />
        </Link>
      </li>
      <li className="min-w-0">
        <Link to="/songs" className={cn(TILE, TILE_LINK)}>
          <TileFace
            label={t('profile.tiles.songs')}
            value={figures.songsLearned}
            icon={Music}
            tone="text-muted-foreground"
          />
        </Link>
      </li>
      <li className="min-w-0">
        <Link to="/profile/history" className={cn(TILE, TILE_LINK)}>
          <TileFace
            label={t('profile.tiles.time')}
            value={time(figures.practiceSeconds, 1)}
            icon={Clock}
            tone="text-muted-foreground"
          />
        </Link>
      </li>
    </ul>
  )
}

/** The board's TILE: a card 12 in, its figure and its name 4 apart. */
const TILE = 'card flex h-full flex-col gap-1 p-3'
const TILE_LINK = 'transition-colors duration-200 hover:bg-muted focus-visible:-outline-offset-3'

/** A tile's face (TILE): the figure at 24 bold with its 18 mark at the right, its name 13 under it. */
function TileFace({
  label,
  value,
  icon: Icon,
  tone,
}: {
  label: string
  value: number | string
  icon: LucideIcon
  tone: string
}) {
  return (
    <>
      <span className="flex items-center justify-between gap-1">
        <span className="text-2xl leading-tight font-bold tracking-[-0.01em] tabular-nums whitespace-nowrap">
          {value}
        </span>
        <Icon aria-hidden className={cn('size-4.5 shrink-0', tone)} />
      </span>
      <span className="truncate text-[0.8125rem]/[1.375] text-muted-foreground">{label}</span>
    </>
  )
}
