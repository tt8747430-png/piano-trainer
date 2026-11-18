import { Link } from '@tanstack/react-router'
import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import { allJourneys, type Journey } from '@/entities/lesson'
import { selectLearned, useProgress } from '@/entities/progress'
import { localText, useLocale } from '@/shared/i18n'
import { cn } from '@/shared/lib'
import { OpensMark, SectionHead } from '@/shared/ui'
import { journeyProgress } from '../model/progress'

/** A level's number in a ring of how much of it is learned (the canvas's LVRING): 44, its 36 face inside. */
function LevelRing({ n, share }: { n: number; share: number }) {
  return (
    <span
      aria-hidden
      className="grid size-11 shrink-0 place-items-center rounded-pill"
      style={{
        background: `conic-gradient(var(--color-learned) ${Math.round(share * 100)}%, var(--color-hairline) 0)`,
      }}
    >
      <span className="grid size-9 place-items-center rounded-pill bg-card text-[0.9375rem] font-bold tabular-nums">
        {n}
      </span>
    </span>
  )
}

/**
 * Learn's Levels (the canvas's LEVELLIST), under their plain heading: on a phone one card of 64 rows,
 * each its number in its ring, its stage ("Beginner"), its book, how many of its steps are learned and
 * a chevron; on a laptop four cards in a row (as many as fit at 220 each), each ending where its words
 * end, the count after the book ("Foundations · 6 of 13") and no chevron: the card is the link.
 */
export function LevelRows() {
  const { t } = useTranslation(['learn', 'common'])
  const locale = useLocale()
  const id = useId()
  const learned = useProgress(selectLearned)
  const row = (journey: Journey, i: number) => {
    const progress = journeyProgress(journey, learned)
    const share = progress.total === 0 ? 0 : progress.done / progress.total
    const count = t('learn:journey.of', { learned: progress.done, total: progress.total })
    return (
      <Link
        to="/levels/$levelId"
        params={{ levelId: journey.id }}
        className="group flex min-h-16 items-center gap-3 px-3 py-2 transition-colors duration-200 ease-out hover:bg-muted focus-visible:-outline-offset-3 lg:card lg:py-2.5"
      >
        <LevelRing n={i + 1} share={share} />
        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="font-semibold">{t(`common:stage.${journey.stage}`)}</span>
          <span className="text-sm text-pretty text-muted-foreground">
            {localText(journey.title, locale)}
            <span className="hidden tabular-nums lg:inline"> · {count}</span>
          </span>
        </span>
        <span className="shrink-0 text-sm whitespace-nowrap text-muted-foreground tabular-nums lg:hidden">
          {count}
        </span>
        <span className="lg:hidden">
          <OpensMark />
        </span>
      </Link>
    )
  }
  return (
    <section aria-labelledby={id} className="flex flex-col gap-3">
      <SectionHead id={id} title={t('learn:levels')} />
      <ul
        className={cn(
          'flex flex-col rows-hairline overflow-hidden card',
          'lg:grid lg:grid-cols-[repeat(auto-fit,minmax(13.75rem,1fr))] lg:gap-4 lg:overflow-visible lg:rounded-none lg:border-0 lg:bg-transparent lg:[&>li]:after:hidden',
        )}
      >
        {allJourneys().map((journey, i) => (
          <li key={journey.id}>{row(journey, i)}</li>
        ))}
      </ul>
    </section>
  )
}

/**
 * The levels beside a level's page on a laptop (canvas 163): each its stage, its book and how much is
 * learned, the one shown current. A row opens that level's page in this one's place.
 */
export function LevelNav({ current }: { current: string }) {
  const { t } = useTranslation(['learn', 'common'])
  const locale = useLocale()
  const id = useId()
  const learned = useProgress(selectLearned)
  return (
    <nav aria-labelledby={id} className="flex flex-col gap-1">
      <h2 id={id} className="caps px-1 pb-0.5">
        {t('learn:levels')}
      </h2>
      <ul className="flex flex-col gap-0.5">
        {allJourneys().map((journey) => {
          const progress = journeyProgress(journey, learned)
          const here = journey.id === current
          return (
            <li key={journey.id}>
              <Link
                to="/levels/$levelId"
                params={{ levelId: journey.id }}
                replace
                aria-current={here ? 'page' : undefined}
                className={cn(
                  'flex min-h-13 w-full items-center gap-2 rounded-[10px] px-3 py-1.5 transition-colors duration-200 ease-out',
                  here ? 'bg-chosen' : 'hover:bg-muted',
                )}
              >
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className={cn('text-[0.9375rem]', here && 'font-semibold')}>
                    {t(`common:stage.${journey.stage}`)}
                  </span>
                  <span className="text-[0.8125rem] text-muted-foreground">
                    {localText(journey.title, locale)}
                  </span>
                </span>
                <span className="shrink-0 text-[0.8125rem] text-muted-foreground">
                  {t('learn:journey.count', { learned: progress.done, total: progress.total })}
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
