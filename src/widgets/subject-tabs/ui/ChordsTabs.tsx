import { useTranslation } from 'react-i18next'
import { OPEN_PLAINLY } from '@/shared/lib'
import { NavTab, NavTabs } from '@/shared/ui'

/** Chords' two pages as tabs: a chord built from its parts, and the chord the keys played make. */
export function ChordsTabs({ current }: { current: 'build' | 'find' }) {
  const { t } = useTranslation('practice')
  return (
    <NavTabs label={t('subjects.chords')}>
      <NavTab to="/practice/chords" replace state={OPEN_PLAINLY} current={current === 'build'}>
        {t('chords.build')}
      </NavTab>
      <NavTab to="/practice/chords/find" replace state={OPEN_PLAINLY} current={current === 'find'}>
        {t('chords.find')}
      </NavTab>
    </NavTabs>
  )
}
