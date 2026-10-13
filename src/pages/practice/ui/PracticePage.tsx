import { Link } from '@tanstack/react-router'
import { useMemo, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { selectAllAnswers, selectPractised, useProgress } from '@/entities/progress'
import { myGaps } from '@/features/trainer'
import { OPEN_PLAINLY } from '@/shared/lib'
import { RowGroup, RowLink, ScreenHeader } from '@/shared/ui'
import {
  PRACTICE_GROUPS,
  PRACTICE_PAGES,
  THINGS,
  type PracticePageId,
} from '../model/practice-pages'
import { usePageAbout } from './use-page-about'

/** How many skills My gaps holds to check. */
function useGapsCount(): number {
  const answers = useProgress(selectAllAnswers)
  const practised = useProgress(selectPractised)
  return useMemo(() => myGaps(answers, practised).length, [answers, practised])
}

/** A page's row: its name, what it says of itself, its tile. It opens as it was left. */
function PageRow({ page, trailing }: { page: PracticePageId; trailing?: ReactNode }) {
  const { t } = useTranslation('practice')
  const about = usePageAbout()
  const { to, tile } = PRACTICE_PAGES[page]
  return (
    <RowLink
      title={t(`pages.${page}`)}
      detail={about(page)}
      {...tile}
      trailing={trailing}
      render={<Link to={to} state={OPEN_PLAINLY} />}
    />
  )
}

/**
 * Practice (ADR 0044): the things first, under no heading, each a page that shows one on the keys;
 * then the tools, which work something out from what they are given; then the training.
 */
export function PracticePage() {
  const { t } = useTranslation('practice')
  const gaps = useGapsCount()
  // The Quiz row says how many skills wait to be checked, behind the gap's dot.
  const toCheck =
    gaps > 0 ? (
      <span className="flex shrink-0 items-center gap-1.5 text-sm font-medium text-muted-foreground tabular-nums">
        <span aria-hidden className="size-2.5 rounded-full bg-attention" />
        {t('gaps', { count: gaps })}
      </span>
    ) : undefined
  return (
    <div className="flex flex-col gap-8">
      <ScreenHeader title={t('title')} />
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
  )
}
