import { Link, useParams } from '@tanstack/react-router'
import { Check, Star } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { selectRun, selectTrainerRecord, useProgress, type PracticeRun } from '@/entities/progress'
import { runPlaceOf, useRunName } from '@/features/trainer'
import { useLocale } from '@/shared/i18n'
import { cn, useMediaQuery } from '@/shared/lib'
import { BackButton, ButtonLink, Docked, ScreenHeader, SettingsGroup } from '@/shared/ui'

/** A figure of the run (canvas 160): its value first and large, its name under it. */
function Tile({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex min-w-0 flex-col gap-1 card p-3">
      <dd className="text-2xl leading-tight font-bold whitespace-nowrap tabular-nums">{value}</dd>
      <dt className="mt-auto text-sm font-semibold text-muted-foreground">{label}</dt>
    </div>
  )
}

/**
 * Retry: the trainer again at the run's own level and drill; docked at the foot on a phone, under
 * the figures on a wider screen (canvas 160).
 */
function Retry({ run }: { run: PracticeRun }) {
  const { t } = useTranslation('account')
  const wide = useMediaQuery('(min-width: 40rem)')
  const place = runPlaceOf(run.key)
  if (!place) return null
  const retry = (
    <ButtonLink
      size="lg"
      className="w-full sm:mx-auto sm:w-90"
      render={
        <Link
          to="/practice/trainer/$trainerId"
          params={{ trainerId: place.trainerId }}
          search={{
            ...(place.level === 'all' ? {} : { level: place.level }),
            ...(place.drill ? { drill: place.drill } : {}),
          }}
        />
      }
    >
      {t('profile.history.result.retry')}
    </ButtonLink>
  )
  return wide ? retry : <Docked className="pt-3">{retry}</Docked>
}

/**
 * A practice run's results, opened from Practice history (canvas 160, PracticeResult): its mark
 * (a star for a perfect run), its name, how many were right and when; Accuracy, In a row and the
 * time per answer as tiles; the personal best beside it; Retry at the foot.
 */
export function RunPage() {
  const { t } = useTranslation('account')
  const locale = useLocale()
  const { runId } = useParams({ from: '/shell/profile/history/$runId' })
  const run = useProgress(selectRun(runId))
  const record = useProgress((state) => (run ? selectTrainerRecord(run.key)(state) : undefined))
  const name = useRunName()(run?.key ?? '')
  const when = new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short' })
  if (!run || name === null)
    return (
      <div className="flex flex-col gap-6">
        <ScreenHeader title={t('profile.history.title')} back={<BackButton />} />
        <SettingsGroup>
          <p className="py-1 text-pretty text-muted-foreground">{t('profile.history.gone')}</p>
        </SettingsGroup>
      </div>
    )
  const perfect = run.accuracy === 100
  const right = Math.round((run.accuracy / 100) * run.answered)
  const Mark = perfect ? Star : Check
  const best = record && record.best > run.accuracy
  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader title={t('profile.history.title')} back={<BackButton />} />
      <div className="mx-auto flex w-full max-w-xl flex-col gap-6 pb-docked-8 sm:pb-4">
        <div className="flex flex-col items-center gap-2 text-center">
          <span
            aria-hidden
            className={cn(
              'grid size-24 place-items-center rounded-full [&_svg]:size-11',
              perfect
                ? 'bg-paint-yellow text-on-paint-yellow'
                : 'bg-paint-grass text-on-paint-grass',
            )}
          >
            <Mark strokeWidth={2.4} className={perfect ? 'fill-current' : undefined} />
          </span>
          <h1 className="mt-2 font-sans text-[1.625rem] leading-tight font-bold text-balance">
            {name}
          </h1>
          <p className="text-muted-foreground tabular-nums">
            {perfect
              ? t('profile.history.result.perfect')
              : t('profile.history.result.correct', { right, count: run.answered })}
            {' · '}
            {when.format(new Date(run.at))}
          </p>
        </div>
        <dl className="grid grid-cols-3 gap-2">
          <Tile
            value={t('profile.history.accuracy', { percent: run.accuracy })}
            label={t('profile.history.result.accuracy')}
          />
          <Tile value={String(run.streak)} label={t('profile.history.result.streak')} />
          <Tile
            value={t('profile.history.result.seconds', {
              s: new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(
                run.averageMs / 1000,
              ),
            })}
            label={t('profile.history.result.pace')}
          />
        </dl>
        {record ? (
          <p className="text-center text-[0.9375rem] text-muted-foreground tabular-nums">
            {best
              ? t('profile.history.result.best', { percent: record.best })
              : t('profile.history.result.newBest')}
          </p>
        ) : null}
        <Retry run={run} />
      </div>
    </div>
  )
}
