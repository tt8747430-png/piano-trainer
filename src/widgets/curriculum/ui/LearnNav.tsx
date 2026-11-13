import { useTranslation } from 'react-i18next'
import { allJourneys, type Journey } from '@/entities/lesson'
import { selectOwnLessons, useOwnLessons } from '@/entities/own-lessons'
import { selectLearned, useProgress } from '@/entities/progress'
import { localText, useLocale } from '@/shared/i18n'
import { cn, useSetSearch } from '@/shared/lib'
import { OWN_LESSONS, type LearnView } from '../model/learn-view'
import { journeyProgress } from '../model/progress'

function NavRow({
  current,
  onClick,
  title,
  detail,
  count,
}: {
  current: boolean
  onClick: () => void
  title: string
  detail?: string | undefined
  count?: string | undefined
}) {
  return (
    <li>
      <button
        type="button"
        aria-current={current ? 'page' : undefined}
        onClick={onClick}
        className={cn(
          'flex min-h-11 w-full items-center gap-3 rounded-control px-3 py-1.5 text-start transition-colors duration-200 ease-out',
          current ? 'bg-chosen' : 'hover:bg-muted',
        )}
      >
        <span className="flex min-w-0 flex-1 flex-col">
          <span className={cn('text-pretty', current && 'font-semibold')}>{title}</span>
          {detail ? <span className="text-xs text-muted-foreground">{detail}</span> : null}
        </span>
        {count ? (
          <span className="shrink-0 text-sm text-muted-foreground tabular-nums">{count}</span>
        ) : null}
      </button>
    </li>
  )
}

/**
 * Learn's level list on a laptop (canvas 128): each level with its book's title and how much of it is
 * learned, then Your lessons with their count. One is current; a tap shows it in the middle column.
 * The title's Lessons | Courses is the one way to the Courses. On a phone the levels are the chips.
 */
export function LearnNav({
  view,
  journey,
}: {
  view: LearnView['view']
  journey: Journey | typeof OWN_LESSONS
}) {
  const { t } = useTranslation(['learn', 'common'])
  const locale = useLocale()
  const learned = useProgress(selectLearned)
  const own = useOwnLessons(selectOwnLessons)
  const setSearch = useSetSearch<LearnView>()
  return (
    <nav aria-label={t('learn:journey.label')}>
      <ul className="flex flex-col gap-0.5">
        {allJourneys().map((each) => {
          const progress = journeyProgress(each, learned)
          return (
            <NavRow
              key={each.id}
              current={view === 'lessons' && journey !== OWN_LESSONS && journey.id === each.id}
              onClick={() => setSearch({ view: 'lessons', journey: each.id })}
              title={t(`common:stage.${each.stage}`)}
              detail={localText(each.title, locale)}
              count={t('learn:journey.count', { learned: progress.done, total: progress.total })}
            />
          )
        })}
        <NavRow
          current={view === 'lessons' && journey === OWN_LESSONS}
          onClick={() => setSearch({ view: 'lessons', journey: OWN_LESSONS })}
          title={t('learn:own.lessons')}
          count={String(own.length)}
        />
      </ul>
    </nav>
  )
}
