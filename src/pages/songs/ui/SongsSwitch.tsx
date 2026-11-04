import { useTranslation } from 'react-i18next'
import { useSetSearch } from '@/shared/lib'
import { Segmented } from '@/shared/ui'
import type { SongsHome, SongsView } from '../model/explore-view'

/** What a view starts from: nothing searched, filtered, chosen or opened of the other's. */
const FRESH: Omit<SongsHome, 'view'> = {
  q: '',
  stage: 'any',
  key: '',
  favourites: false,
  cat: 'all',
  shelf: '',
}

/**
 * Songs' switch in its bar (D1), as Learn's Lessons · Courses: My songs · Explore, written into the
 * URL in place, each view opened fresh.
 */
export function SongsSwitch({ value }: { value: SongsView }) {
  const { t } = useTranslation('songs')
  const show = useSetSearch<SongsHome>()
  return (
    <Segmented
      label={t('explore.views.label')}
      value={value}
      options={(['mine', 'explore'] as const).map((view) => ({
        value: view,
        label: t(`explore.views.${view}`),
      }))}
      onChange={(view) => show({ ...FRESH, view })}
      compact
    />
  )
}
