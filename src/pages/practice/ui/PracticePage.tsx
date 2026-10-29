import { useTranslation } from 'react-i18next'
import { RowGroup, ScreenHeader } from '@/shared/ui'
import { PlaceActions } from '@/widgets/app-nav'
import { PageRow, PRACTICE_GROUPS } from '@/widgets/practice-pages'
import { GapsBadge, useGapsCount } from '@/widgets/trainer-list'

/**
 * Practice (ADR 0052): its pages in three headed groups, Theory, Playing and Training, each a row
 * with its tile, its name and one short line.
 */
export function PracticePage() {
  const { t } = useTranslation('practice')
  const gaps = useGapsCount()
  return (
    <div className="flex flex-col gap-2">
      <ScreenHeader title={t('title')} large actions={<PlaceActions />} />
      <div className="flex flex-col gap-8">
        {PRACTICE_GROUPS.map((group) => (
          <RowGroup key={group.id} title={t(`groups.${group.id}`)}>
            {group.pages.map((page) => (
              <li key={page}>
                {/* The Quiz row says how many skills wait to be checked, behind the gap's dot. */}
                <PageRow
                  page={page}
                  trailing={page === 'quiz' && gaps > 0 ? <GapsBadge count={gaps} /> : undefined}
                />
              </li>
            ))}
          </RowGroup>
        ))}
      </div>
    </div>
  )
}
