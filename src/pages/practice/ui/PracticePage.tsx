import { Link } from '@tanstack/react-router'
import { Dumbbell, ListChecks } from 'lucide-react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { selectAllAnswers, selectPractised, useProgress } from '@/entities/progress'
import { myGaps } from '@/features/trainer'
import { OPEN_PLAINLY } from '@/shared/lib'
import { PAGE_TILES, RowLink, ScreenHeader, type Tile } from '@/shared/ui'

/**
 * Practice's eight places, in the order they are listed: each one page for a thing practised, wearing
 * that page's tile.
 */
const SUBJECTS = [
  { id: 'chords', to: '/practice/chords', tile: PAGE_TILES.chords },
  { id: 'scales', to: '/practice/scales', tile: PAGE_TILES.scales },
  { id: 'progressions', to: '/practice/progressions', tile: PAGE_TILES.progressions },
  { id: 'intervals', to: '/practice/intervals', tile: PAGE_TILES.intervals },
  { id: 'accompaniment', to: '/practice/accompaniment', tile: PAGE_TILES.patterns },
  { id: 'exercises', to: '/practice/exercises', tile: { icon: Dumbbell, paint: 'sand' } },
  { id: 'quiz', to: '/practice/quiz', tile: { icon: ListChecks, paint: 'lilac' } },
  { id: 'freePlay', to: '/practice/free-play', tile: PAGE_TILES.freePlay },
] as const satisfies readonly { id: string; to: string; tile: Tile }[]

/** How many skills My gaps holds to check. */
function useGapsCount(): number {
  const answers = useProgress(selectAllAnswers)
  const practised = useProgress(selectPractised)
  return useMemo(() => myGaps(answers, practised).length, [answers, practised])
}

/**
 * Practice: eight places, each named for what is practised and saying what is inside it. Each opens
 * as it was left.
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
    <div className="flex flex-col gap-2">
      <ScreenHeader title={t('title')} />
      <ul className="grid-cards gap-2 *:card">
        {SUBJECTS.map(({ id, to, tile }) => (
          <li key={id}>
            <RowLink
              title={t(`subjects.${id}`)}
              detail={t(`inside.${id}`)}
              {...tile}
              trailing={id === 'quiz' ? toCheck : undefined}
              render={<Link to={to} state={OPEN_PLAINLY} />}
            />
          </li>
        ))}
      </ul>
    </div>
  )
}
