import { Link } from '@tanstack/react-router'
import { Heart, Music, SearchX } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Said } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import type { SongsFilter } from '../model/songs-filter'
import type { LibraryPage } from '../model/use-library-page'

/**
 * A place of the library with nothing to list: a folder or Favourites says what shows there and
 * links to All songs (R72); an empty library says where songs live and points to Explore; a search that keeps nothing says so,
 * with Clear search.
 */
export function LibraryEmpty({
  page,
  place,
  filter,
  onClear,
}: {
  page: LibraryPage
  /** Where it is empty: a folder, Favourites, or the whole library. */
  place: 'folder' | 'favourites' | 'home'
  filter: SongsFilter
  onClear: () => void
}) {
  const { t } = useTranslation('songs')
  const { t: common } = useTranslation('common')
  // A search that found nothing (R72's NOMATCH): what was asked, how to try again, Clear search.
  if (page.view.filtering)
    return (
      <Said
        icon={SearchX}
        title={t('emptyQuery', { query: filter.q.trim() })}
        description={t('emptyQueryLine')}
        action={
          <Button variant="ghost" onClick={onClear}>
            {common('clearSearch')}
          </Button>
        }
      />
    )
  // A folder or Favourites with nothing in it: the one empty state, saying what shows here, with the
  // way to All songs.
  if (place !== 'home')
    return (
      <Said
        icon={place === 'folder' ? Music : Heart}
        title={t(place === 'folder' ? 'folder.emptyTitle' : 'places.emptyFavourites')}
        description={t(
          place === 'folder' ? 'folder.emptyDescription' : 'places.emptyFavouritesLine',
        )}
        action={<Link to="/songs/all">{t('folder.addSongs')}</Link>}
      />
    )
  // A library with nothing in it (R72's BAREP): where songs live, the three ways in, and Explore.
  return (
    <Said
      icon={Music}
      title={t('homeEmpty.title')}
      description={t('homeEmpty.description')}
      action={
        <Link to="/songs" search={{ view: 'explore' }}>
          {t('homeEmpty.explore')}
        </Link>
      }
    />
  )
}
