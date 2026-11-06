import { useTranslation } from 'react-i18next'
import { useSetSearch } from '@/shared/lib'
import type { TitleViews } from '@/shared/ui'
import type { SongsHome, SongsView } from '../model/explore-view'

/** What a view starts from: nothing searched, filtered, chosen or opened of the other's. */
const FRESH: Omit<SongsHome, 'view'> = {
  q: '',
  stage: 'any',
  key: '',
  favourites: false,
  folder: 'any',
  learned: 'any',
  cat: 'all',
  shelf: '',
}

/**
 * Songs' views as its bar's title (R31-S), as Learn's Lessons · Courses: My songs · Explore,
 * written into the URL in place, each view opened fresh.
 */
export function useSongsViews(value: SongsView): TitleViews<SongsView> {
  const { t } = useTranslation('songs')
  const show = useSetSearch<SongsHome>()
  return {
    label: t('explore.views.label'),
    value,
    options: (['mine', 'explore'] as const).map((view) => ({
      value: view,
      label: t(`explore.views.${view}`),
    })),
    onChange: (view) => show({ ...FRESH, view }),
  }
}
