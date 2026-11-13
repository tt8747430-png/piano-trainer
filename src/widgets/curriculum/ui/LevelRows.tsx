import { Link } from '@tanstack/react-router'
import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import { allJourneys } from '@/entities/lesson'
import { selectLearned, useProgress } from '@/entities/progress'
import { localText, useLocale } from '@/shared/i18n'
import { cn } from '@/shared/lib'
import { OpensMark, PAINT, ProgressRing } from '@/shared/ui'
import { journeyProgress } from '../model/progress'

/**
 * Learn's Levels (canvas 163): the four levels as one card of rows, each its number in a ring of how
 * much of it is learned, its stage ("Beginner"), its book, how many of its steps are learned, and a chevron. A row opens the level's page.
 */
export function LevelRows() {
  const { t } = useTranslation(['learn', 'common'])
  const locale = useLocale()
  const id = useId()
  const learned = useProgress(selectLearned)
  return (
    <section aria-labelledby={id} className="flex flex-col gap-2">
      <h2 id={id} className="px-1 text-lg font-semibold">
        {t('learn:levels')}
      </h2>
      <ul className="flex flex-col divide-y divide-hairline overflow-hidden card">
        {allJourneys().map((journey, i) => {
          const progress = journeyProgress(journey, learned)
          const share = progress.total === 0 ? 0 : progress.done / progress.total
          return (
            <li key={journey.id}>
              <Link
                to="/levels/$levelId"
                params={{ levelId: journey.id }}
                className="group flex min-h-16 items-center gap-4 px-3 py-2 transition-colors duration-200 ease-out hover:bg-muted focus-visible:-outline-offset-3"
              >
                <ProgressRing share={share} track className={PAINT.grass.ink}>
                  <span
                    aria-hidden
                    className="grid size-10 place-items-center rounded-pill bg-card font-display text-lg font-semibold tabular-nums"
                  >
                    {i + 1}
                  </span>
                </ProgressRing>
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="font-semibold">{t(`common:stage.${journey.stage}`)}</span>
                  <span className="text-sm text-pretty text-muted-foreground">
                    {localText(journey.title, locale)}
                  </span>
                </span>
                <span className="shrink-0 text-sm text-muted-foreground tabular-nums">
                  {t('learn:journey.of', { learned: progress.done, total: progress.total })}
                </span>
                <OpensMark />
              </Link>
            </li>
          )
        })}
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
      <h2
        id={id}
        className="px-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase"
      >
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
                  'flex min-h-11 w-full items-center gap-3 rounded-control px-3 py-1.5 transition-colors duration-200 ease-out',
                  here ? 'bg-chosen' : 'hover:bg-muted',
                )}
              >
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className={cn(here && 'font-semibold')}>
                    {t(`common:stage.${journey.stage}`)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {localText(journey.title, locale)}
                  </span>
                </span>
                <span className="shrink-0 text-sm text-muted-foreground tabular-nums">
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
