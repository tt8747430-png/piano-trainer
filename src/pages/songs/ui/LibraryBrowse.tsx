import { useTranslation } from 'react-i18next'
import { useFolderName } from '@/entities/library'
import { FilteredNotice, FolderRow, SongRow } from '@/widgets/song-library'
import { folderKey, songKey, type LibraryPage } from '../model/use-library-page'
import { folderActions, songActions } from './row-actions'

/**
 * The library as it is read (Mindscape's browse): the place's folders, each a row to its page, then
 * its songs, each a row to its own; while the filters look through it, the songs under their
 * folders' paths, and how many they hide.
 */
export function LibraryBrowse({ page, onClear }: { page: LibraryPage; onClear: () => void }) {
  const { t } = useTranslation('songs')
  const nameOf = useFolderName()
  const { view } = page
  return (
    <div className="flex flex-col gap-6">
      <FilteredNotice shown={view.shown} hidden={view.hidden} onClear={onClear} />
      {view.folders.length > 0 ? (
        <section aria-label={t('folder.list')}>
          <ul className="grid-cards auto-rows-fr gap-2">
            {view.folders.map(({ folder, ...holds }) => (
              <FolderRow
                key={folder.id}
                folder={folder}
                holds={holds}
                actions={folderActions(folder, nameOf(folder), page, t)}
                onSelect={() => page.select.start(folderKey(folder.id))}
              />
            ))}
          </ul>
        </section>
      ) : null}
      {view.groups.map((group) =>
        group.entries.length === 0 ? null : (
          <section
            key={group.key}
            aria-labelledby={group.heading ? `songs-${group.key}` : undefined}
            aria-label={group.heading ? undefined : t('title')}
            className="flex flex-col gap-3"
          >
            {group.heading ? (
              <h2 id={`songs-${group.key}`} className="text-2xl">
                {group.heading}
              </h2>
            ) : null}
            <ul className="grid-cards auto-rows-fr gap-2">
              {group.entries.map((entry) => (
                <SongRow
                  key={entry.id}
                  entry={entry}
                  favourite={page.favourites.includes(entry.id)}
                  actions={songActions(entry, page, t)}
                  onSelect={() => page.select.start(songKey(entry.id))}
                />
              ))}
            </ul>
          </section>
        ),
      )}
    </div>
  )
}
