import { Link } from '@tanstack/react-router'
import { FolderOpen, Heart, Music, Plus, SearchX } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { ButtonLink, Said } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import type { SongsFilter } from '../model/songs-filter'
import type { LibraryPage } from '../model/use-library-page'

/**
 * A place of the library with nothing to list: a folder or Favourites says what shows there and
 * links to All songs (R72); an empty library offers New song; a search that keeps nothing says so,
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
  // A folder or Favourites with nothing in it (R72's FEMPTY): what shows here, and the way to All songs.
  if (place !== 'home')
    return (
      <Said
        icon={place === 'folder' ? FolderOpen : Heart}
        title={t(place === 'folder' ? 'folder.emptyTitle' : 'places.emptyFavourites')}
        description={t(
          place === 'folder' ? 'folder.emptyDescription' : 'places.emptyFavouritesLine',
        )}
        action={
          <ButtonLink variant="link" render={<Link to="/songs/all" />}>
            {t('folder.addSongs')}
          </ButtonLink>
        }
      />
    )
  return (
    <Said
      icon={Music}
      title={t('homeEmpty.title')}
      description={t('homeEmpty.description')}
      action={
        page.may('addSong') ? (
          <Button variant="ghost" onClick={() => page.open({ kind: 'new-song' })}>
            <Plus data-icon="inline-start" aria-hidden />
            {t('newSong')}
          </Button>
        ) : null
      }
    />
  )
}
