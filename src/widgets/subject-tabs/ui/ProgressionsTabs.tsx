import { useTranslation } from 'react-i18next'
import { OPEN_PLAINLY } from '@/shared/lib'
import { NavTab, NavTabs } from '@/shared/ui'

/**
 * Progressions' three pages as tabs: a progression in a key, the passing chords between two chords,
 * and the chords that hold a melody note. Each opens as it was left.
 */
export function ProgressionsTabs({
  current,
}: {
  current: 'progression' | 'passing' | 'reharmonise'
}) {
  const { t } = useTranslation(['practice', 'learn'])
  return (
    <NavTabs label={t('practice:subjects.progressions')}>
      <NavTab
        to="/practice/progressions"
        replace
        state={OPEN_PLAINLY}
        current={current === 'progression'}
      >
        {t('practice:progression')}
      </NavTab>
      <NavTab
        to="/practice/progressions/passing"
        replace
        state={OPEN_PLAINLY}
        current={current === 'passing'}
      >
        {t('learn:passing.title')}
      </NavTab>
      <NavTab
        to="/practice/progressions/reharmonise"
        replace
        state={OPEN_PLAINLY}
        current={current === 'reharmonise'}
      >
        {t('learn:reharmonise.title')}
      </NavTab>
    </NavTabs>
  )
}
