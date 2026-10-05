import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { OPEN_PLAINLY } from '@/shared/lib'
import { NavTabs } from '@/shared/ui'

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
    <NavTabs
      label={t('practice:subjects.progressions')}
      tabs={[
        {
          id: 'progression',
          label: t('practice:progression'),
          current: current === 'progression',
          render: <Link to="/practice/progressions" replace state={OPEN_PLAINLY} />,
        },
        {
          id: 'passing',
          label: t('learn:passing.title'),
          current: current === 'passing',
          render: <Link to="/practice/progressions/passing" replace state={OPEN_PLAINLY} />,
        },
        {
          id: 'reharmonise',
          label: t('learn:reharmonise.title'),
          current: current === 'reharmonise',
          render: <Link to="/practice/progressions/reharmonise" replace state={OPEN_PLAINLY} />,
        },
      ]}
    />
  )
}
