import { Link } from '@tanstack/react-router'
import { Settings } from 'lucide-react'
import { useId, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { practiceRecord, useProgress, type PracticeRecord } from '@/entities/progress'
import { useAccount } from '@/shared/lib/account'
import { BackButton, ButtonLink, RoundLink, ScreenHeader } from '@/shared/ui'
import { PracticeDays } from '@/widgets/practice-days'
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
 * The Profile: the learner (their initial, name and email; or a guest's Sign in), the days they
 * practised, their record, and the songs they played last.
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
        <RecentPieces />
      </div>
    </div>
  )
}

function Identity() {
  const { t } = useTranslation('account')
  const { account } = useAccount()
  if (!account)
    return (
      <section className="flex flex-col gap-3 card p-5" aria-label={t('profile.guest')}>
        <p className="font-display text-xl font-semibold">{t('profile.guest')}</p>
        <p className="text-muted-foreground">{t('profile.guestLine')}</p>
        <ButtonLink className="self-start" render={<Link to="/account/sign-in" />}>
          {t('profile.signIn')}
        </ButtonLink>
      </section>
    )
  const name = account.name || account.email
  return (
    <section className="flex items-center gap-4 card p-5" aria-label={name}>
      <span
        aria-hidden
        className="grid size-16 shrink-0 place-items-center rounded-full bg-paint-yellow font-display text-3xl font-semibold text-on-paint-yellow"
      >
        {name.slice(0, 1).toLocaleUpperCase()}
      </span>
      <div className="flex min-w-0 flex-col">
        <p className="truncate font-display text-xl font-semibold">{name}</p>
        <p className="truncate text-muted-foreground">{account.email}</p>
        <Link
          to="/settings/account"
          className="inline-flex min-h-11 items-center self-start text-sm font-medium underline"
        >
          {t('profile.settings')}
        </Link>
      </div>
    </section>
  )
}

function Record() {
  const { t } = useTranslation('account')
  const headingId = useId()
  const progress = useProgress((state) => state)
  const record = useMemo(() => practiceRecord(progress), [progress])
  return (
    <section aria-labelledby={headingId} className="flex flex-col gap-3">
      <h2 id={headingId} className="text-2xl">
        {t('profile.record')}
      </h2>
      <dl className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {FIGURES.map(([field, label]) => (
          <div key={field} className="flex flex-col-reverse gap-1 card p-4">
            <dt className="text-sm text-muted-foreground">{t(`profile.${label}`)}</dt>
            <dd className="font-display text-3xl font-semibold tabular-nums">{record[field]}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
