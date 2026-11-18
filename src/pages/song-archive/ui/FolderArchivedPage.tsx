import { Link, useParams } from '@tanstack/react-router'
import { RotateCcw } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { folderArchive, useFolderName, useLibraryLayout } from '@/entities/library'
import { useLibraryActs } from '@/features/manage-library'
import { BackButton, ButtonLink, NotFound } from '@/shared/ui'
import { ArchiveEmpty } from './ArchiveEmpty'
import { ShelfList, type ShelfItem } from './ShelfList'

/**
 * A folder's Archived (D10, R29 B4): the songs archived from it (a learner's Archive of one of the
 * app's songs hides it for them), in the Archive's shape (`ShelfList`): each with its ··· Restore,
 * which puts it back where it stood, and Select to restore what is picked or all. Reached by the
 * folder's last row, Archived (n); its Back goes up to the folder.
 */
export function FolderArchivedPage() {
  const { t } = useTranslation('songs')
  const { folderId } = useParams({ from: '/shell/songs/folders/$folderId/archived' })
  const layout = useLibraryLayout()
  const nameOf = useFolderName()
  const acts = useLibraryActs()
  const folder = layout.folders.find((each) => each.id === folderId)
  if (!folder)
    return (
      <NotFound>
        <ButtonLink render={<Link to="/songs" />}>{t('title')}</ButtonLink>
      </NotFound>
    )
  const songs = folderArchive(layout, folder.id)
  const items: ShelfItem[] = songs.map((entry) => ({
    key: `song:${entry.id}`,
    entry,
    at: entry.at,
    actions: [
      {
        key: 'restore',
        label: t('shelf.restore'),
        icon: RotateCcw,
        onSelect: () => acts.restore([entry.id]),
      },
    ],
  }))
  return (
    <ShelfList
      title={t('folder.archived')}
      back={<BackButton label={t('folder.up', { name: nameOf(folder) })} />}
      when={t('table.archived')}
      search={t('archive.search')}
      items={items}
      count={t('folder.songCount', { count: items.length })}
      empty={<ArchiveEmpty />}
      acts={{
        restoreIcon: RotateCcw,
        restore: (keys) =>
          acts.restore(
            songs.filter((entry) => keys.includes(`song:${entry.id}`)).map((entry) => entry.id),
          ),
      }}
    />
  )
}
