import { FolderInput, FolderOpen, ListFilter, Music, Plus, SearchX } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { EmptyState } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { keyFromParam } from '@/shared/lib/music'
import { useKeyName } from '@/shared/i18n'
import { filtersOn, placesOn } from '../model/library-view'
import type { SongsFilter } from '../model/songs-filter'
import type { LibraryPage } from '../model/use-library-page'

/**
 * A place of the library with nothing to list (Mindscape's `LibraryEmpty`): an empty folder offers
 * New song and Move songs here; an empty Home, New song; filters that keep nothing say what found
 * nothing (the search, the one filter on by its own words, or these filters), and Clear filters.
 */
export function LibraryEmpty({
  page,
  inFolder,
  filter,
  onClear,
}: {
  page: LibraryPage
  inFolder: boolean
  filter: SongsFilter
  onClear: () => void
}) {
  const { t } = useTranslation('songs')
  const { t: common } = useTranslation('common')
  const keyName = useKeyName()
  if (page.view.filtering) {
    const searched = filter.q.trim()
    const on = filtersOn(filter)
    // A place alone (Favourites, Learning, Learned) found nothing: said as the place, its way out All songs.
    const placeAlone = !searched && on === placesOn(filter)
    // What found nothing, said as plainly as it was asked: the one filter by its own words.
    const said = searched
      ? on === 0
        ? t('emptyQuery', { query: searched })
        : on === 1 && filter.stage !== 'any'
          ? t('emptyQueryStage', { query: searched, stage: common(`stage.${filter.stage}`) })
          : t('emptyQueryFilters', { query: searched })
      : on > 1
        ? t('emptyFilters')
        : filter.stage !== 'any'
          ? t('emptyStage', { stage: common(`stage.${filter.stage}`) })
          : filter.key !== ''
            ? t('emptyKey', { key: keyName(keyFromParam(filter.key)) })
            : filter.favourites
              ? t('emptyFavourites')
              : filter.learned === 'yes'
                ? t('emptyLearned')
                : filter.learned === 'no'
                  ? t('emptyLearning')
                  : t('empty')
    return (
      <EmptyState
        icon={searched ? SearchX : ListFilter}
        title={said}
        line={searched ? t('emptyQueryLine') : undefined}
      >
        <Button variant="ghost" onClick={onClear}>
          {placeAlone ? t('tree.all') : common('library.clearFilters')}
        </Button>
      </EmptyState>
    )
  }
  return (
    <EmptyState
      icon={inFolder ? FolderOpen : Music}
      title={t(inFolder ? 'folder.emptyTitle' : 'homeEmpty.title')}
      line={t(inFolder ? 'folder.emptyDescription' : 'homeEmpty.description')}
    >
      {page.may('addSong') ? (
        <Button variant="ghost" onClick={() => page.open({ kind: 'new-song' })}>
          <Plus data-icon="inline-start" aria-hidden />
          {t('newSong')}
        </Button>
      ) : null}
      {inFolder && page.may('moveIn') ? (
        <Button variant="ghost" onClick={() => page.open({ kind: 'move-in' })}>
          <FolderInput data-icon="inline-start" aria-hidden />
          {t('folder.moveIn')}
        </Button>
      ) : null}
    </EmptyState>
  )
}
