import { useTranslation } from 'react-i18next'
import { LIBRARY_SORTS, SORT_DIRECTIONS, type CardPlace } from '@/entities/library'
import { SortMenu } from '@/shared/ui'
import { SongTable } from '@/widgets/song-library'
import { songKey, type LibraryPage } from '../model/use-library-page'
import { LibraryBrowse } from './LibraryBrowse'
import { songActions } from './row-actions'

/**
 * A Songs place on a laptop (the AllSongsLaptop and FolderLaptop boards' LTABLE): its playlists, where
 * it holds some, then every song as the library's one table, the sort heading its fourth column; in
 * Select each row chosen by a tap, its check leading it (the selection bar floats over the foot).
 */
export function LibraryTable({
  page,
  place,
  noFolders,
  onClear,
}: {
  page: LibraryPage
  place: CardPlace
  noFolders: boolean
  onClear: () => void
}) {
  const { t } = useTranslation(['songs', 'common'])
  const { view, select } = page
  const songs = view.groups.flatMap((group) => group.entries)
  return (
    <div className="flex flex-col gap-6">
      {noFolders || view.folders.length === 0 || select.on ? null : (
        <LibraryBrowse page={page} place={place} moreFolders={null} onClear={onClear} foldersOnly />
      )}
      {songs.length > 0 ? (
        <SongTable
          label={t('table.songs')}
          entries={songs}
          actionsOf={(entry) => songActions(entry, page, t)}
          select={
            select.on
              ? {
                  chosen: (id) => select.chosen.has(songKey(id)),
                  toggle: (id) => select.toggle(songKey(id)),
                }
              : undefined
          }
          sort={
            <SortMenu
              head
              label={t('sort.label')}
              sort={page.sort}
              sorts={LIBRARY_SORTS.map((value) => ({ value, label: t(`sort.${value}`) }))}
              onSort={page.setSort}
              ways={{
                way: page.direction,
                options: SORT_DIRECTIONS.map((value) => ({ value, label: t(`sort.${value}`) })),
                onWay: page.setDirection,
              }}
            />
          }
        />
      ) : null}
    </div>
  )
}
