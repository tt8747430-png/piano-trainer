import { useTranslation } from 'react-i18next'
import { ScreenHeader, SettingsGroup } from '@/shared/ui'
import { PlaceActions } from '@/widgets/app-nav'
import { useSettings } from '@/entities/settings'
import {
  PageRow,
  PRACTICE_GROUPS,
  PRACTICE_PAGE_IDS,
  type PracticePageId,
} from '@/widgets/practice-pages'

/** The groups' two columns from a laptop's width: six rows each (R30-4). */
const COLUMNS = [
  ['tools', 'playing'],
  ['theory', 'training'],
] as const
import { GapsBadge, useGapsCount } from '@/widgets/trainer-list'

/**
 * Practice (ADR 0052): its pages in three named groups, Theory, Playing and Training, each one card
 * of rows (a grouped list, as Settings), each row its tile, its name and one short line; the groups
 * side by side where the width holds them.
 */
export function PracticePage() {
  const { t } = useTranslation('practice')
  const gaps = useGapsCount()
  const recent = useSettings((state) => state.practiceRecent)
    .filter((id): id is PracticePageId => PRACTICE_PAGE_IDS.includes(id as PracticePageId))
    .slice(0, 2)
  return (
    <div className="flex flex-col gap-2">
      <ScreenHeader title={t('title')} large tools={<PlaceActions />} />
      {/* The last two pages opened from here (R30-4), as Songs' Continue. */}
      {recent.length > 0 ? (
        <SettingsGroup title={t('continue')} flush>
          <ul className="grid sm:grid-cols-2">
            {recent.map((page) => (
              <li key={page}>
                <PageRow page={page} />
              </li>
            ))}
          </ul>
        </SettingsGroup>
      ) : null}
      {/* Two even columns from a laptop's width (R30-4): Tools and Playing, Theory and Training. */}
      <div className="grid items-start gap-6 lg:grid-cols-2">
        {COLUMNS.map((column) => (
          <div key={column.join()} className="flex flex-col gap-6">
            {column.map((id) => {
              const group = PRACTICE_GROUPS.find((each) => each.id === id)
              return group ? (
                <SettingsGroup key={group.id} title={t(`groups.${group.id}`)} flush>
                  <ul className="flex flex-col">
                    {group.pages.map((page) => (
                      <li key={page}>
                        {/* The Quiz row says how many skills wait to be checked, behind the gap's dot. */}
                        <PageRow
                          page={page}
                          trailing={
                            page === 'quiz' && gaps > 0 ? <GapsBadge count={gaps} /> : undefined
                          }
                        />
                      </li>
                    ))}
                  </ul>
                </SettingsGroup>
              ) : null
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
