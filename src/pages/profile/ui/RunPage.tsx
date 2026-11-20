import { Link, useNavigate, useParams } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import {
  localDay,
  selectRun,
  selectTrainerRecord,
  useProgress,
  type PlayedRun,
  type QuizRun,
} from '@/entities/progress'
import { runPlaceOf, useRunName } from '@/features/trainer'
import { useLocale } from '@/shared/i18n'
import { clockSaid, useMediaQuery } from '@/shared/lib'
import { BackButton, ButtonLink, Docked, ScreenHeader, SettingsGroup } from '@/shared/ui'
import { useToday } from '@/widgets/practice-days'
import { RunHero, RunResults, StatTile } from '@/widgets/run-results'
import { useHistoryDay } from '../model/runs'

/**
 * Retry: the trainer again at the run's own level and drill; docked at the foot on a phone, under
 * the figures on a wider screen (canvas 160).
 */
function Retry({ run }: { run: QuizRun }) {
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
 * A practice run's results, opened from Practice history (canvas 160, PracticeResult): a run played
 * as its run ends in it (`RunResults`), a trainer's quiz as its own; the bar names it by when it was
 * played ("Today, 14:20"), never an empty bar.
 */
export function RunPage() {
  const locale = useLocale()
  const { runId } = useParams({ from: '/shell/profile/history/$runId' })
  const run = useProgress(selectRun(runId))
  const dayName = useHistoryDay(useToday())
  const header = (at: string) => (
    <ScreenHeader
      title={`${dayName(localDay(new Date(at)))}, ${clockSaid(at, locale)}`}
      back={<BackButton />}
    />
  )
  if (run?.kind === 'played')
    return (
      <div className="flex flex-col">
        {header(run.at)}
        <PlayedResult run={run} />
      </div>
    )
  return <QuizResult run={run} header={header} />
}

/** A run played, from Profile: its attempt among its key's runs, its best, and the run to play again. */
function PlayedResult({ run }: { run: PlayedRun }) {
  const navigate = useNavigate()
  const record = useProgress(selectTrainerRecord(run.key))
  const later = useProgress(
    (state) => state.history.filter((each) => each.key === run.key && each.at > run.at).length,
  )
  const again = () => void navigate({ href: run.href })
  return (
    <RunResults
      run={run}
      best={record ? record.best : null}
      attempt={Math.max(1, (record?.runs ?? 1) - later)}
      onMistakes={again}
      onRetry={again}
    />
  )
}

/** A trainer's quiz run: its mark, its name, how many were right; Accuracy, In a row, Per answer; Retry. */
function QuizResult({
  run,
  header,
}: {
  run: QuizRun | undefined
  header: (at: string) => ReactNode
}) {
  const { t } = useTranslation('account')
  const locale = useLocale()
  const record = useProgress((state) => (run ? selectTrainerRecord(run.key)(state) : undefined))
  const name = useRunName()(run?.key ?? '')
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
  const best = record && record.best > run.accuracy
  return (
    <div className="flex flex-col">
      {header(run.at)}
      <div className="mx-auto flex w-full max-w-xl flex-col gap-5 pt-2 pb-docked-8 sm:gap-6 sm:pb-4 lg:pt-6">
        <RunHero perfect={perfect} title={name}>
          <p className="text-muted-foreground tabular-nums">
            {perfect
              ? t('profile.history.result.perfect')
              : t('profile.history.result.correct', { right, count: run.answered })}
          </p>
        </RunHero>
        <dl className="grid grid-cols-3 gap-3">
          <StatTile
            figure={t('profile.history.accuracy', { percent: run.accuracy })}
            label={t('profile.history.result.accuracy')}
          />
          <StatTile figure={String(run.streak)} label={t('profile.history.result.streak')} />
          <StatTile
            figure={t('profile.history.result.seconds', {
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
