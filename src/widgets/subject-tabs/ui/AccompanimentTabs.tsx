import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { NavTabs } from '@/shared/ui'

/** Accompaniment's two pages as tabs: the patterns, and the studies they are practised on. */
export function AccompanimentTabs({ current }: { current: 'patterns' | 'studies' }) {
  const { t } = useTranslation('practice')
  return (
    <NavTabs
      label={t('subjects.accompaniment')}
      tabs={[
        {
          id: 'patterns',
          label: t('accompaniment.patterns'),
          current: current === 'patterns',
          render: <Link to="/practice/patterns" replace />,
        },
        {
          id: 'studies',
          label: t('accompaniment.studies'),
          current: current === 'studies',
          render: <Link to="/practice/studies" replace />,
        },
      ]}
    />
  )
}
