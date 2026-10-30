import { Link } from '@tanstack/react-router'
import {
  BookOpenCheck,
  CalendarDays,
  Flame,
  Footprints,
  Lock,
  Music,
  Settings,
  Sparkles,
  Trophy,
  type LucideIcon,
} from 'lucide-react'
import { useId, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import {
  achievementsOf,
  practiceRecord,
  selectDays,
  streak,
  useProgress,
  type PracticeRecord,
} from '@/entities/progress'
import { cn } from '@/shared/lib'
import { useAccount } from '@/shared/lib/account'
import { Avatar, ButtonLink, RoundLink, ScreenHeader } from '@/shared/ui'
import { PracticeCalendar, useToday } from '@/widgets/practice-days'

/**
 * The Profile, a place of its own (memory-palaces'): the learner's name in its bar with Settings,
 * the screen's action, beside it (the Account is Settings' first row); their picture, email (or a
 * guest's Sign in) and three figures of their practice; the month's Activity; the rest of their
 * record; their badges. Each thing opens one way.
 */
export function ProfilePage() {
  const { t } = useTranslation(['account', 'common'])
  const { account } = useAccount()
  return (
    <div className="flex flex-col gap-2">
      <ScreenHeader
        title={account ? account.name || account.email : t('profile.title')}
        large
        actions={
          // The laptop's sidebar has Settings at its foot: the bar's would be a second way.
          <span className="lg:hidden">
            <RoundLink
              label={t('common:nav.settings')}
              icon={Settings}
              render={<Link to="/settings" />}
            />
          </span>
        }
      />
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-7">
        <Hero />
        <PracticeCalendar title={t('profile.activity')} />
        <Record />
        <Achievements />
      </div>
    </div>
  )
}

/** The learner: their picture, their email or a guest's Sign in, and three figures of their practice. */
function Hero() {
  const { t } = useTranslation('account')
  const { account } = useAccount()
  const name = account ? account.name || account.email : null
  return (
    <section
      aria-label={name ?? t('profile.guest')}
      className="flex flex-col items-center gap-4 pt-2 text-center"
    >
      <Avatar name={name} size="hero" />
      {account ? (
        <p className="max-w-full text-pretty break-all text-muted-foreground">{account.email}</p>
      ) : (
        <div className="flex max-w-sm flex-col items-center gap-3">
          <div className="flex flex-col gap-0.5">
            <p className="font-display text-xl font-semibold text-balance">{t('profile.guest')}</p>
            <p className="text-pretty text-muted-foreground">{t('profile.guestLine')}</p>
          </div>
          <ButtonLink render={<Link to="/account/sign-in" />}>{t('profile.signIn')}</ButtonLink>
        </div>
      )}
      <Figures />
    </section>
  )
}

/** Days in a row, days practised and songs played, side by side, a hairline between them. */
function Figures() {
  const { t } = useTranslation('account')
  const days = useProgress(selectDays)
  const progress = useProgress((state) => state)
  const today = useToday()
  const record = useMemo(() => practiceRecord(progress), [progress])
  const figures = [
    { label: t('profile.streak'), value: streak(days, today), icon: Flame },
    { label: t('profile.days'), value: record.daysPractised, icon: CalendarDays },
    { label: t('profile.songs'), value: record.songsPlayed, icon: Music },
  ] as const
  return (
    <dl
      aria-label={t('profile.figures')}
      className="mt-1 flex w-full max-w-sm items-stretch divide-x divide-border"
    >
      {figures.map(({ label, value, icon: Icon }) => (
        <div
          key={label}
          className="flex min-w-0 flex-1 flex-col-reverse items-center gap-1 px-2 text-center"
        >
          <dt className="text-xs text-pretty text-muted-foreground sm:text-sm">{label}</dt>
          <dd className="flex items-center gap-1.5 font-display text-2xl leading-none font-semibold tabular-nums">
            <Icon aria-hidden className="size-4 shrink-0 text-muted-foreground" />
            {value}
          </dd>
        </div>
      ))}
    </dl>
  )
}

/** The figures of the record the hero leaves out: one card, a figure a line, its number at its end. */
const RECORD = [
  ['bestStreak', 'bestStreak', Trophy],
  ['stepsLearned', 'steps', Footprints],
  ['lessonsDone', 'lessons', BookOpenCheck],
  ['skillsKnown', 'skills', Sparkles],
] as const satisfies readonly (readonly [keyof PracticeRecord, string, LucideIcon])[]

function Record() {
  const { t } = useTranslation('account')
  const headingId = useId()
  const progress = useProgress((state) => state)
  const record = useMemo(() => practiceRecord(progress), [progress])
  return (
    <section aria-labelledby={headingId} className="flex flex-col gap-2">
      <h2 id={headingId} className="px-3 font-sans text-sm font-semibold text-muted-foreground">
        {t('profile.record')}
      </h2>
      <dl className="flex flex-col divide-y divide-border card px-4">
        {RECORD.map(([field, label, Icon]) => (
          <div key={field} className="flex min-h-12 items-center gap-3 py-2">
            <Icon aria-hidden className="size-5 shrink-0 text-muted-foreground" />
            <dt className="min-w-0 flex-1 text-pretty">{t(`profile.${label}`)}</dt>
            <dd className="font-display text-lg font-semibold tabular-nums">{record[field]}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

/** What each badge is drawn with: the figure it counts. */
const BADGE_ICON = {
  daysPractised: CalendarDays,
  bestStreak: Flame,
  stepsLearned: Footprints,
  lessonsDone: BookOpenCheck,
  songsPlayed: Music,
  skillsKnown: Sparkles,
} as const satisfies Record<keyof PracticeRecord, LucideIcon>

/**
 * The learner's badges (Noji's, Quizlet's): earned ones first, each its icon on its paint, then the
 * ones to earn greyed with how far along they are.
 */
function Achievements() {
  const { t } = useTranslation('account')
  const headingId = useId()
  const progress = useProgress((state) => state)
  const badges = useMemo(() => achievementsOf(practiceRecord(progress)), [progress])
  return (
    <section aria-labelledby={headingId} className="flex flex-col gap-2">
      <h2 id={headingId} className="px-3 font-sans text-sm font-semibold text-muted-foreground">
        {t('profile.achievements.title')}
      </h2>
      <ul className="grid grid-cols-2 gap-y-5 card px-2 py-5 sm:grid-cols-4">
        {badges.map(({ id, figure, earned, have, goal }) => {
          const Icon = BADGE_ICON[figure]
          return (
            <li key={id} className="flex min-w-0 flex-col items-center gap-1 text-center">
              <span
                aria-hidden
                className={cn(
                  'grid size-12 place-items-center rounded-full',
                  earned
                    ? 'bg-paint-yellow text-on-paint-yellow'
                    : 'bg-muted text-muted-foreground',
                )}
              >
                {earned ? <Icon className="size-6" /> : <Lock className="size-5" />}
              </span>
              <span
                className={cn(
                  'text-sm font-medium text-pretty',
                  !earned && 'text-muted-foreground',
                )}
              >
                {t(`profile.achievements.names.${id}`)}
              </span>
              <span className="text-xs text-muted-foreground tabular-nums">
                {earned
                  ? t('profile.achievements.earned')
                  : t('profile.achievements.progress', { have, goal })}
              </span>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
