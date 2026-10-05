import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { OPEN_PLAINLY } from '@/shared/lib'
import { NavTabs } from '@/shared/ui'

/** Chords' two pages as tabs: a chord built from its parts, and the chord the keys played make. */
export function ChordsTabs({ current }: { current: 'build' | 'find' }) {
  const { t } = useTranslation('practice')
  return (
    <NavTabs
      label={t('subjects.chords')}
      tabs={[
        {
          id: 'build',
          label: t('chords.build'),
          current: current === 'build',
          render: <Link to="/practice/chords" replace state={OPEN_PLAINLY} />,
        },
        {
          id: 'find',
          label: t('chords.find'),
          current: current === 'find',
          render: <Link to="/practice/chords/find" replace state={OPEN_PLAINLY} />,
        },
      ]}
    />
  )
}
