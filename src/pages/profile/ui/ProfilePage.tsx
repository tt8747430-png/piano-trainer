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

/**
 * The Profile, a place of its own (B1, memory-palaces'): the learner's name in its bar with their
 * notifications' bell and, on a phone, Settings; their picture (Edit photo on it), name, handle and
 * year joined, and three tiles: the day streak (to Streak), the songs learned, the time practised;
 * the badge nearest; the first badges and achievements, each with See all. A guest sees the
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
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-7">
        <Hero />
        <NextMilestone />
        <BadgesPreview />
        <AchievementsPreview />
      </div>
    </div>
  )
}

/**
 * The learner: their picture with Edit photo, their name, handle and year joined; a guest's Sign
 * in; then the three tiles.
 */
function Hero() {
  const { t } = useTranslation('account')
  const { account } = useAccount()
  const { state } = useLearnerProfile()
  const profile = state.kind === 'ready' ? state.profile : null
  const name = profile?.name || account?.name || account?.email || null
  const year = profile ? new Date(profile.joined).getFullYear() : null
  return (
    <section
      aria-label={name ?? t('profile.guest')}
      className="flex flex-col items-center gap-4 pt-2 text-center"
    >
      <div className="relative">
        <Avatar name={name} size="hero" picture={profile?.avatar ?? null} />
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
          <div aria-busy className="flex flex-col items-center gap-2">
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
          <div className="flex max-w-full flex-col gap-1">
            <p className="font-display text-2xl font-semibold text-balance break-words">{name}</p>
            {year ? (
              <p className="text-muted-foreground">
                {profile?.handle
                  ? t('profile.handleJoined', { handle: profile.handle, year })
                  : t('profile.joined', { year })}
              </p>
            ) : null}
          </div>
        )
      ) : (
        <div className="flex max-w-sm flex-col items-center gap-3">
          <p className="font-display text-xl font-semibold text-balance">{t('profile.guest')}</p>
          <ButtonLink render={<Link to="/account/sign-in" />}>{t('profile.signIn')}</ButtonLink>
        </div>
      )}
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

const TILE = 'card flex h-full flex-col items-center justify-start gap-1.5 px-2 py-3 text-center'

/** A tile's figure over its name, read as one: "3 Day streak". */
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
      <span className="flex flex-col items-center gap-1 font-display text-lg leading-tight font-semibold text-balance tabular-nums sm:text-2xl">
        <Icon aria-hidden className="size-4 shrink-0 text-muted-foreground" />
        {value}
      </span>
      <span className="text-xs text-pretty text-muted-foreground sm:text-sm">{label}</span>
    </>
  )
}
