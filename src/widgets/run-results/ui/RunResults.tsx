import { Link } from '@tanstack/react-router'
import { Check, ChevronRight, Star } from 'lucide-react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import type { PlayedRun, RunStep } from '@/entities/progress'
import { cn, LAPTOP, useMediaQuery } from '@/shared/lib'
import { Docked } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { mistakeBars } from '../model/mistakes'
import { RunStaff } from './RunStaff'

/** A perfect run's Retry goes this much faster (the board's "Retry at 80 BPM" after 72). */
const FASTER = 8

/**
 * A stat tile (`RS_TILE`), the same three rows in every tile: the figure (its unit quieter), one line
 * of context, the label; 16 inset, rows closer than the inset.
 */
function Tile({
  figure,
  unit,
  sub,
  label,
}: {
  figure: string
  unit?: string
  sub: string
  label: string
}) {
  return (
    <div className="flex min-w-0 flex-col gap-0.5 card p-4">
      <dt className="order-3 pt-1.5 text-[0.8125rem] leading-[normal] font-semibold text-muted-foreground">
        {label}
      </dt>
      <dd className="order-1 text-[1.5rem] leading-[normal] font-bold tracking-[-0.01em] whitespace-nowrap tabular-nums">
        {figure}
        {unit ? (
          <span className="text-[0.9375rem] font-semibold tracking-normal text-muted-foreground">
            {' '}
            {unit}
          </span>
        ) : null}
      </dd>
      <dd className="order-2 truncate text-[0.8125rem] leading-[normal] text-muted-foreground tabular-nums">
        {sub}
      </dd>
    </div>
  )
}

/** A bar's mark under it (`RS_CAP`): ✓ in sage, Wrong notes in crimson, Paused in the deep yellow. */
function Mark({ step }: { step: RunStep }) {
  const { t } = useTranslation('account')
  if (step === 'clean')
    return (
      <span
        aria-label={t('profile.history.result.clean')}
        className="font-bold text-on-paint-grass"
      >
        ✓
      </span>
    )
  return (
    <span
      className={cn('font-semibold', step === 'slip' ? 'text-destructive' : 'text-on-paint-yellow')}
    >
      {t(`profile.history.result.${step}`)}
    </span>
  )
}

/**
 * A run's results (`r56_results.py`'s `RS_RESULTS`), as the run ends in them and as Practice history
 * opens them: the verdict (✓ on sage, ★ on honey for a perfect run), the run's name, Accuracy · Pauses
 * · Tempo, the run on the staff with each bar's mark, then what to do next (Practise mistakes over
 * Retry and Done, or Retry a little faster after a perfect run), at the foot on a phone; the personal
 * best under them, and from the run a link to all practice in Profile.
 */
export function RunResults({
  run,
  best,
  attempt,
  onMistakes,
  onRetry,
  done,
  profile,
}: {
  run: PlayedRun
  /** The best accuracy of the run's other attempts; none for its first. */
  best: number | null
  /** Which attempt this was. */
  attempt: number
  onMistakes: (bars: { first: number; last: number }) => void
  /** Plays it again, at `tempo`. */
  onRetry: (tempo: number) => void
  /** Done: back to where the run was opened from; none from Profile. */
  done?: () => void
  /** The link to all practice in Profile, from the run. */
  profile?: ReactNode
}) {
  const { t } = useTranslation(['account', 'music'])
  const laptop = useMediaQuery(LAPTOP)
  const bars = run.steps.length
  const right = run.steps.filter((step) => step !== 'slip').length
  const pauses = run.steps.filter((step) => step === 'pause').length
  const perfect = run.accuracy === 100
  const mistakes = mistakeBars(run.steps)
  const chords = run.chords.length === bars ? run.chords : []
  const perLine = laptop ? 6 : 4
  const lines = Array.from(
    { length: Math.ceil(chords.length / perLine) },
    (_, line) => line * perLine,
  )
  const r = 'profile.history.result'
  const Verdict = perfect ? Star : Check
  const acts = (
    <div className="grid gap-2">
      {mistakes ? (
        <>
          <Button size="lg" onClick={() => onMistakes(mistakes)}>
            {t(`${r}.mistakes`)}
          </Button>
          <div className="flex gap-2">
            <Button variant="quiet" size="lg" className="flex-1" onClick={() => onRetry(run.tempo)}>
              {t(`${r}.retry`)}
            </Button>
            {done ? (
              <Button variant="quiet" size="lg" className="flex-1" onClick={done}>
                {t(`${r}.done`)}
              </Button>
            ) : null}
          </div>
        </>
      ) : (
        <>
          <Button size="lg" onClick={() => onRetry(perfect ? run.tempo + FASTER : run.tempo)}>
            {perfect ? t(`${r}.retryAt`, { tempo: run.tempo + FASTER }) : t(`${r}.retry`)}
          </Button>
          {done ? (
            <Button variant="quiet" size="lg" onClick={done}>
              {t(`${r}.done`)}
            </Button>
          ) : null}
        </>
      )}
    </div>
  )
  const foot = (
    <div className="flex flex-col items-center">
      <p className="text-[0.9375rem] text-muted-foreground tabular-nums">
        {best !== null && best > run.accuracy
          ? t(`${r}.bestAt`, { percent: best, attempt })
          : t(`${r}.newBestAt`, { attempt })}
      </p>
      {profile}
    </div>
  )
  return (
    <div
      className={cn(
        'mx-auto flex w-full flex-col',
        laptop ? 'max-w-190 gap-6 pt-6 pb-12' : 'gap-5 pt-2 pb-docked-8',
      )}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <span
          aria-hidden
          className={cn(
            'grid size-24 place-items-center rounded-full [&_svg]:size-11',
            perfect ? 'bg-paint-yellow text-on-paint-yellow' : 'bg-paint-grass text-on-paint-grass',
          )}
        >
          <Verdict strokeWidth={2.4} className={perfect ? 'fill-current' : undefined} />
        </span>
        <h1 className="mt-2 font-sans text-[1.625rem] leading-[normal] font-bold tracking-[-0.01em] text-balance">
          {run.title}
        </h1>
      </div>
      <dl className={cn('grid grid-cols-3', laptop ? 'gap-4' : 'gap-3')}>
        <Tile
          figure={t('profile.history.accuracy', { percent: run.accuracy })}
          sub={t(`${r}.ofAll`, { right, count: bars })}
          label={t(`${r}.accuracy`)}
        />
        <Tile
          figure={String(pauses)}
          sub={t(chords.length > 0 ? `${r}.ofChords` : `${r}.ofBars`, { count: bars })}
          label={t(`${r}.pauses`)}
        />
        <Tile
          figure={String(run.tempo)}
          unit={t('music:tempoField.bpm')}
          sub={t(`${r}.inWait`)}
          label={t(`${r}.tempo`)}
        />
      </dl>
      {chords.length > 0 ? (
        <section aria-label={t(`${r}.run`)} className="flex flex-col gap-2">
          <h2 className="font-sans text-sm leading-[normal] font-semibold">{t(`${r}.run`)}</h2>
          <div className="flex flex-col gap-1">
            {lines.map((start) => (
              <RunStaff
                key={start}
                chords={chords.slice(start, start + perLine)}
                cell={laptop ? 116 : 76}
                clefWidth={34}
                end
                marks={run.steps.slice(start, start + perLine).map((step, index) => (
                  <Mark key={index} step={step} />
                ))}
              />
            ))}
          </div>
          {perfect ? null : (
            <p className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-[0.8125rem] leading-[normal] text-muted-foreground">
              <span>
                <b className="text-on-paint-grass">✓</b> {t(`${r}.clean`)}
              </span>
              <span>
                <b className="text-destructive">●</b> {t(`${r}.slip`)}
              </span>
              <span>
                <b className="text-on-paint-yellow">●</b> {t(`${r}.pause`)}
              </span>
            </p>
          )}
        </section>
      ) : null}
      {laptop ? (
        <div className="mx-auto flex w-full max-w-100 flex-col gap-4">
          {acts}
          {foot}
        </div>
      ) : (
        <>
          {foot}
          <Docked className="pt-3 pb-0">{acts}</Docked>
        </>
      )}
    </div>
  )
}

/** "All practice in Profile ›", under a run's results as the run ends in them. */
export function AllPractice() {
  const { t } = useTranslation('account')
  return (
    <Link
      to="/profile/history"
      className="flex h-11 items-center gap-1 rounded-control text-[0.9375rem] font-semibold text-link focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
    >
      {t('profile.history.result.allPractice')}
      <ChevronRight aria-hidden className="size-4" />
    </Link>
  )
}
