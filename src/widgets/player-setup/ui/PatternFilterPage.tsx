import { useTranslation } from 'react-i18next'
import type { PatternChoice } from '@/entities/pattern'
import { STAGES, type Stage } from '@/entities/step'
import { ChoiceChips } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { PRACTICE_SORTS, type PracticeLibraryView } from '@/widgets/practice-library'
import { usePatternLibrary } from '../model/use-pattern-library'

/** A group's heading: small capitals in soft ink, its chips under it. */
function GroupTitle({ children }: { children: string }) {
  return <h3 className="mx-1 mt-2 -mb-1 caps">{children}</h3>
}

/** A group's chips: the sheet's honey chips, a row's room between their rows. */
const GROUP_CHIPS = 'my-0 gap-y-2 px-0.5'

/**
 * The Pattern sheet's Sort and filter, a page of the sheet (the PlayerApp board's): Sort by (Book,
 * Name, Level), then Level, each with how many it keeps of what the search and place hold, one that
 * keeps none dimmed; at its foot Reset and Show, saying how many it shows, which goes back to the
 * patterns. Each change is taken at once.
 */
export function PatternFilterPage({
  view,
  chosen,
  onView,
  onDone,
}: {
  view: PracticeLibraryView
  chosen: PatternChoice
  onView: (change: Partial<PracticeLibraryView>) => void
  onDone: () => void
}) {
  const { t } = useTranslation(['player', 'practice', 'common'])
  // What the search and place hold at every level: each level's chip counts its own.
  const { shown } = usePatternLibrary({ ...view, stage: 'any' }, chosen)
  const countOf = (stage: Stage | 'any') =>
    stage === 'any' ? shown.items.length : shown.items.filter((item) => item.stage === stage).length
  const sortName = (sort: PracticeLibraryView['sort']) =>
    t(sort === 'group' ? 'practice:library.table.book' : `practice:library.table.${sort}`)
  const kept = countOf(view.stage)
  return (
    <div className="flex flex-col gap-3">
      <GroupTitle>{t('practice:library.sortBy')}</GroupTitle>
      <ChoiceChips
        label={t('practice:library.sortBy')}
        tone="honey"
        className={GROUP_CHIPS}
        value={view.sort}
        options={PRACTICE_SORTS.map((sort) => ({ value: sort, label: sortName(sort) }))}
        onChange={(sort) => onView({ sort })}
      />
      <GroupTitle>{t('practice:library.table.level')}</GroupTitle>
      <ChoiceChips<Stage | 'any'>
        label={t('practice:library.table.level')}
        tone="honey"
        className={GROUP_CHIPS}
        value={view.stage}
        options={[
          { value: 'any', label: t('practice:library.all'), count: countOf('any') },
          ...STAGES.filter((stage) => countOf(stage) > 0 || stage === view.stage).map((stage) => ({
            value: stage,
            label: t(`common:stage.${stage}`),
            count: countOf(stage),
          })),
        ]}
        onChange={(stage) => onView({ stage })}
      />
      <div className="flex gap-2 pt-2">
        <Button
          variant="soft"
          onClick={() => onView({ stage: 'any', sort: 'group' })}
          className="h-11 rounded-control border-transparent px-4 text-[0.9375rem]"
        >
          {t('player:patternSheet.reset')}
        </Button>
        <Button onClick={onDone} size="lg" className="min-w-0 flex-1">
          {kept > 0
            ? t('practice:library.kinds.accompaniment.show', { count: kept })
            : t('practice:library.showNone')}
        </Button>
      </div>
    </div>
  )
}
