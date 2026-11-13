import { Link } from '@tanstack/react-router'
import { Bell, Camera, Clock, Flame, Music, Settings, type LucideIcon } from 'lucide-react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useNotifications } from '@/entities/notification'
import { selectDays, streak, useProgress } from '@/entities/progress'
import { useProfileFigures } from '@/features/track-achievements'
import { cn } from '@/shared/lib'
import { useAccount, useLearnerProfile } from '@/shared/lib/account'
import { useAppUpdate } from '@/shared/lib/app-update'
import { Avatar, ButtonLink, RoundLink, ScreenHeader } from '@/shared/ui'
import { useToday } from '@/widgets/practice-days'
import { usePracticeTime } from '../model/format'
import { AchievementsPreview } from './AchievementsPreview'
import { BadgesPreview, NextMilestone } from './BadgesPreview'
import { WeekCard } from './WeekCard'

/**
 * The Profile, a place of its own (B1, memory-palaces'): the learner's name in its bar with their
 * notifications' bell and, on a phone, Settings; their picture (Edit photo on it), name, handle and
 * year joined, and three tiles: the day streak (to Streak), the songs learned, the time practised;
 * the week as a bar a day; the badge nearest as a ring; the first badges and achievements, each with
 * See all, beside the rest on a laptop. A guest sees the
 * device's figures and Sign in; while the server's profile is read, its lines are grey.
 */
export function ProfilePage() {
  const { t } = useTranslation(['account', 'common', 'settings'])
  const { account } = useAccount()
  const { state } = useLearnerProfile()
  const updateReady = useAppUpdate().status === 'ready'
  const unread = useNotifications((held) => held.notices.filter((notice) => !notice.read).length)
  const name = state.kind === 'ready' && state.profile.name ? state.profile.name : account?.name
  return (
    <div className="flex flex-col gap-2">
      <ScreenHeader
        title={account ? name || account.email : t('profile.title')}
        large
        tools={
          <span className="relative">
            <RoundLink
              label={
                unread > 0
                  ? t('profile.notifications.unread', { count: unread })
                  : t('profile.notifications.open')
              }
              icon={Bell}
              render={<Link to="/profile/notifications" />}
            />
            {unread > 0 ? (
              <span
                aria-hidden
                className="pointer-events-none absolute top-0.5 right-0.5 grid min-w-4.5 place-items-center rounded-pill bg-destructive px-1 text-[0.6875rem] leading-4.5 font-semibold text-white tabular-nums ring-2 ring-background"
              >
                {unread > 99 ? '99+' : unread}
              </span>
            ) : null}
          </span>
        }
        settings={
          // The laptop's sidebar has Settings at its foot: the bar's would be a second way.
          <span className="relative lg:hidden">
            <RoundLink
              label={
                updateReady
                  ? `${t('common:nav.settings')}, ${t('settings:about.update.ready')}`
                  : t('common:nav.settings')
              }
              icon={Settings}
              render={<Link to="/settings" />}
            />
            {updateReady ? (
              <span
                aria-hidden
                className="pointer-events-none absolute top-1 right-1 size-2.5 rounded-pill bg-destructive ring-2 ring-background"
              />
            ) : null}
          </span>
        }
      />
      {/* One column on a phone; on a laptop two (canvas 128): the learner, the week and the next
          badge, then the badges and achievements beside them. */}
      <div className="mx-auto grid w-full max-w-2xl gap-7 lg:max-w-6xl lg:grid-cols-2 lg:items-start lg:gap-x-10">
        <div className="flex min-w-0 flex-col gap-7">
          <Hero />
          <WeekCard />
          <NextMilestone />
        </div>
        <div className="flex min-w-0 flex-col gap-7 lg:pt-2">
          <BadgesPreview />
          <AchievementsPreview />
        </div>
      </div>
    </div>
  )
}

/**
 * The learner (canvas 128, memory-palaces'): their picture at the left, Edit photo on it, then their
 * name and "@handle · Joined 2025"; a guest's plain figure, Exploring as a guest, what their practice
 * stands to lose and Sign in, in the same place; then the three figures.
 */
function Hero() {
  const { t } = useTranslation('account')
  const { account } = useAccount()
  const { state } = useLearnerProfile()
  const profile = state.kind === 'ready' ? state.profile : null
  const name = profile?.name || account?.name || account?.email || null
  const year = profile ? new Date(profile.joined).getFullYear() : null
  return (
    <section aria-label={name ?? t('profile.guest')} className="flex flex-col gap-4 pt-1">
      <div className="flex items-center gap-4">
        <div className="relative shrink-0 self-start">
          <Avatar name={account ? name : null} size="hero" picture={profile?.avatar ?? null} />
          {account ? (
            // Edit photo on the picture's lower right (memory-palaces'): it opens Edit profile.
            <span className="absolute -right-2 -bottom-2 rounded-pill bg-background p-0.5">
              <RoundLink
                label={t('profile.editPhoto')}
                icon={Camera}
                render={<Link to="/settings/account/profile" />}
              />
            </span>
          ) : null}
        </div>
        {account ? (
          state.kind === 'loading' ? (
            <div aria-busy className="flex flex-col gap-2">
              <p role="status" className="sr-only">
                {t('profile.loading')}
              </p>
              <span
                aria-hidden
                className="h-6 w-40 rounded-pill bg-muted motion-safe:animate-pulse"
              />
              <span
                aria-hidden
                className="h-4 w-32 rounded-pill bg-muted motion-safe:animate-pulse"
              />
            </div>
          ) : (
            <div className="flex min-w-0 flex-col gap-1">
              <p className="text-2xl leading-tight font-bold text-balance break-words">{name}</p>
              {year ? (
                <p className="text-sm text-muted-foreground">
                  {profile?.handle
                    ? t('profile.handleJoined', { handle: profile.handle, year })
                    : t('profile.joined', { year })}
                </p>
              ) : null}
            </div>
          )
        ) : (
          <div className="flex min-w-0 flex-col items-start gap-2">
            <p className="text-xl leading-tight font-bold text-balance">{t('profile.guest')}</p>
            {/* What a guest stands to lose, said truly (R38, canvas 136): kept here, not everywhere. */}
            <p className="text-sm text-muted-foreground text-pretty">{t('profile.guestKept')}</p>
            <ButtonLink render={<Link to="/account/sign-in" />}>{t('profile.signIn')}</ButtonLink>
          </div>
        )}
      </div>
      <Tiles />
    </section>
  )
}

/** The day streak (a link to Streak), the songs learned and the time practised, side by side. */
function Tiles() {
  const { t } = useTranslation('account')
  const days = useProgress(selectDays)
  const today = useToday()
  const figures = useProfileFigures()
  const time = usePracticeTime()
  const run = useMemo(() => streak(days, today), [days, today])
  return (
    <ul aria-label={t('profile.figures')} className="mt-1 grid w-full grid-cols-3 gap-2">
      <li className="min-w-0">
        <Link
          to="/profile/streak"
          className={cn(
            TILE,
            'transition-colors duration-200 hover:bg-muted focus-visible:-outline-offset-3',
          )}
        >
          <TileFace label={t('profile.tiles.streak')} value={run} icon={Flame} />
        </Link>
      </li>
      <li className="min-w-0">
        <div className={TILE}>
          <TileFace label={t('profile.tiles.songs')} value={figures.songsLearned} icon={Music} />
        </div>
      </li>
      <li className="min-w-0">
        <div className={TILE}>
          <TileFace
            label={t('profile.tiles.time')}
            value={time(figures.practiceSeconds)}
            icon={Clock}
          />
        </div>
      </li>
    </ul>
  )
}

const TILE = 'card flex h-full flex-col items-start justify-start gap-1 px-3 py-3'

/** A tile's figure over its name, the value first (canvas 128): "12", then "🔥 Day streak". */
function TileFace({
  label,
  value,
  icon: Icon,
}: {
  label: string
  value: number | string
  icon: LucideIcon
}) {
  return (
    <>
      <span className="text-xl leading-tight font-bold text-balance tabular-nums sm:text-2xl">
        {value}
      </span>
      <span className="flex min-w-0 items-center gap-1 text-xs text-muted-foreground sm:text-sm">
        <Icon aria-hidden className="size-3.5 shrink-0" />
        <span className="min-w-0 text-pretty">{label}</span>
      </span>
    </>
  )
}
