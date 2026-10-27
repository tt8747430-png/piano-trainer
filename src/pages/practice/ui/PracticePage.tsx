import { useTranslation } from 'react-i18next'
import { RowGroup, ScreenHeader } from '@/shared/ui'
import { PageRow, PRACTICE_GROUPS, THINGS } from '@/widgets/practice-pages'
import { GapsBadge, useGapsCount } from '@/widgets/trainer-list'

/**
 * Practice (ADR 0052): the things, under no heading, each a page that shows one on the keys; then
 * the Chord finder at the keys; then the training.
 */
export function PracticePage() {
  const { t } = useTranslation('practice')
  const gaps = useGapsCount()
  return (
    <div className="flex flex-col gap-2">
      <ScreenHeader title={t('title')} />
      <div className="flex flex-col gap-8">
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
