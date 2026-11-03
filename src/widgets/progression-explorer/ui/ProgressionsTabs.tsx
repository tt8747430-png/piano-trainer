import { useTranslation } from 'react-i18next'
import { IN_PLACE } from '@/shared/lib'
import { NavTab, NavTabs } from '@/shared/ui'
import { PROGRESSIONS_TABS, type ProgressionsView } from '../model/progressions-view'

/**
 * Progressions' tabs (A23), as Scales and keys' are: the Progression, the Library, the Passing
 * chords. A tab keeps the progression and changes what is shown of it, in place.
 */
export function ProgressionsTabs({ current }: { current: ProgressionsView['tab'] }) {
  const { t } = useTranslation('practice')
  return (
    <NavTabs label={t('pages.progressions')}>
      {PROGRESSIONS_TABS.map((tab) => (
        <NavTab
          key={tab}
          from="/practice/progressions"
          to="/practice/progressions"
          search={(prev) => ({ ...prev, tab: tab === 'progression' ? undefined : tab })}
          {...IN_PLACE}
          current={tab === (current ?? 'progression')}
        >
          {t(`progressions.tabs.${tab}`)}
        </NavTab>
      ))}
    </NavTabs>
  )
}
