import { useTranslation } from 'react-i18next'
import { ScreenHeader, SettingsGroup } from '@/shared/ui'
import { PlaceActions } from '@/widgets/app-nav'
import { PageRow, PRACTICE_GROUPS } from '@/widgets/practice-pages'
import { GapsBadge, useGapsCount } from '@/widgets/trainer-list'

/**
 * Practice (ADR 0052): its pages in three named groups, Theory, Playing and Training, each one card
 * of rows (a grouped list, as Settings), each row its tile, its name and one short line; the groups
 * side by side where the width holds them.
 */
export function PracticePage() {
  const { t } = useTranslation('practice')
  const gaps = useGapsCount()
  return (
    <div className="flex flex-col gap-2">
      <ScreenHeader title={t('title')} large actions={<PlaceActions />} />
      <div className="grid items-start gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {PRACTICE_GROUPS.map((group) => (
          <SettingsGroup key={group.id} title={t(`groups.${group.id}`)} flush>
            <ul className="flex flex-col">
              {group.pages.map((page) => (
                <li key={page}>
                  {/* The Quiz row says how many skills wait to be checked, behind the gap's dot. */}
                  <PageRow
                    page={page}
                    trailing={page === 'quiz' && gaps > 0 ? <GapsBadge count={gaps} /> : undefined}
                  />
                </li>
              ))}
            </ul>
          </SettingsGroup>
        ))}
      </div>
    </div>
  )
}
