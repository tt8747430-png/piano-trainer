import { useRouteContext } from '@tanstack/react-router'
import { useMemo } from 'react'
import { useStore } from 'zustand'
import { useTranslation } from 'react-i18next'
import { selectAllAnswers, selectPractised, useProgress } from '@/entities/progress'
import { myGaps } from '@/features/trainer'
import { RowGroup, ScreenHeader } from '@/shared/ui'
import { PageRow, PRACTICE_GROUPS, recentPages, THINGS } from '@/widgets/practice-pages'

/** How many skills My gaps holds to check. */
function useGapsCount(): number {
  const answers = useProgress(selectAllAnswers)
  const practised = useProgress(selectPractised)
  return useMemo(() => myGaps(answers, practised).length, [answers, practised])
}

/** The Practice pages used last, the latest first, from the screens the app remembers. */
function useRecentPages() {
  const { views } = useRouteContext({ from: '__root__' })
  const used = useStore(views, (state) => state.views)
  return useMemo(() => recentPages(Object.keys(used)), [used])
}

/**
 * Practice (ADR 0044): the pages used last first, to pick up where the learner left off; then the
 * things, under no heading, each a page that shows one on the keys; then the tools, which work
 * something out from what they are given; then the training.
 */
export function PracticePage() {
  const { t } = useTranslation('practice')
  const gaps = useGapsCount()
  const recent = useRecentPages()
  // The Quiz row says how many skills wait to be checked, behind the gap's dot.
  const toCheck =
    gaps > 0 ? (
      <span className="flex shrink-0 items-center gap-1.5 text-sm font-medium text-muted-foreground tabular-nums">
        <span aria-hidden className="size-2.5 rounded-full bg-attention" />
        {t('quiz.gaps', { count: gaps })}
      </span>
    ) : undefined
  return (
    <div className="flex flex-col gap-2">
      <ScreenHeader title={t('title')} />
      <div className="flex flex-col gap-8">
        {recent.length > 0 ? (
          <RowGroup title={t('recent')}>
            {recent.map((page) => (
              <li key={page}>
                <PageRow page={page} />
              </li>
            ))}
          </RowGroup>
        ) : null}
        <ul className="grid-cards gap-2 *:card">
          {THINGS.map((page) => (
            <li key={page}>
              <PageRow page={page} />
            </li>
          ))}
        </ul>
        {PRACTICE_GROUPS.map((group) => (
          <RowGroup key={group.id} title={t(`groups.${group.id}`)}>
            {group.pages.map((page) => (
              <li key={page}>
                <PageRow page={page} trailing={page === 'quiz' ? toCheck : undefined} />
              </li>
            ))}
          </RowGroup>
        ))}
      </div>
    </div>
  )
}
