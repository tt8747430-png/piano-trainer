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
  UserRound,
  type LucideIcon,
} from 'lucide-react'
import { useId, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import {
  achievementsOf,
  practiceRecord,
  useProgress,
  type PracticeRecord,
} from '@/entities/progress'
import { cn } from '@/shared/lib'
import { useAccount } from '@/shared/lib/account'
import { BackButton, ButtonLink, RoundLink, ScreenHeader } from '@/shared/ui'
import { PracticeCalendar, PracticeDays } from '@/widgets/practice-days'
import { RecentPieces } from '@/widgets/piece-list'

const FIGURES = [
  ['daysPractised', 'days'],
  ['bestStreak', 'bestStreak'],
  ['stepsLearned', 'steps'],
  ['lessonsDone', 'lessons'],
  ['songsPlayed', 'songs'],
  ['skillsKnown', 'skills'],
] as const satisfies readonly (readonly [keyof PracticeRecord, string])[]

/**
 * The Profile: the learner (their initial, name and email, and their account; or a guest's Sign in),
 * the days they practised, their record, and the songs they played last; Settings in its bar.
 */
export function ProfilePage() {
  const { t } = useTranslation(['account', 'common'])
  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader
        title={t('profile.title')}
        back={<BackButton fallback={{ to: '/' }} />}
        actions={
          <RoundLink
            label={t('common:nav.settings')}
            icon={Settings}
            render={<Link to="/settings" />}
          />
        }
      />
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <Identity />
        <PracticeDays />
        <Record />
        <PracticeCalendar />
        <Achievements />
        <RecentPieces />
      </div>
    </div>
  )
}

function Identity() {
  const { t } = useTranslation('account')
  const { account } = useAccount()
  const name = account ? account.name || account.email : t('profile.guest')
  return (
    <section
      aria-label={name}
      className="flex flex-col items-center gap-3 card px-5 py-6 text-center"
    >
      <span
        aria-hidden
        className="grid size-20 shrink-0 place-items-center rounded-full bg-paint-yellow font-display text-4xl font-semibold text-on-paint-yellow"
      >
        {account ? name.slice(0, 1).toLocaleUpperCase() : <UserRound className="size-9" />}
      </span>
      <div className="flex max-w-full min-w-0 flex-col gap-0.5">
        <p className="line-clamp-2 font-display text-2xl font-semibold text-balance wrap-break-word">
          {name}
        </p>
        <p className="text-pretty text-muted-foreground">
          {account ? account.email : t('profile.guestLine')}
        </p>
      </div>
      {account ? (
        <ButtonLink variant="outline" render={<Link to="/settings/account" />}>
          {t('profile.settings')}
        </ButtonLink>
      ) : (
        <ButtonLink render={<Link to="/account/sign-in" />}>{t('profile.signIn')}</ButtonLink>
      )}
    </section>
  )
}

/** What each figure of the record is drawn with. */
const FIGURE_ICON = {
  daysPractised: CalendarDays,
  bestStreak: Flame,
  stepsLearned: Footprints,
  lessonsDone: BookOpenCheck,
  songsPlayed: Music,
  skillsKnown: Sparkles,
} as const satisfies Record<(typeof FIGURES)[number][0], LucideIcon>

/** The learner's record: six figures in one card, three to a row, each its icon over its number and name. */
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
      <dl className="grid grid-cols-3 gap-y-5 card px-2 py-5">
        {FIGURES.map(([field, label]) => {
          const Icon = FIGURE_ICON[field]
          return (
            <div
              key={field}
              className="flex min-w-0 flex-col-reverse items-center gap-0.5 text-center"
            >
              <dt className="text-xs text-pretty text-muted-foreground sm:text-sm">
                {t(`profile.${label}`)}
              </dt>
              <dd className="font-display text-2xl font-semibold tabular-nums">{record[field]}</dd>
              <Icon aria-hidden className="mb-1 size-5 text-muted-foreground" />
            </div>
          )
        })}
      </dl>
    </section>
  )
}

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
          const Icon = FIGURE_ICON[figure]
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
