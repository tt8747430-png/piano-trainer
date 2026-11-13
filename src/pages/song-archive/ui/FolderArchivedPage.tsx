import { Link, useParams } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { folderArchive, useFolderName, useLibraryLayout } from '@/entities/library'
import { useLibraryActs } from '@/features/manage-library'
import { cn } from '@/shared/lib'
import { BackButton, ButtonLink, GROUPED_LIST, NotFound, ScreenHeader } from '@/shared/ui'
import { ArchiveEmpty } from './ArchiveEmpty'
import { ArchivedRow } from './ArchivedRow'

/**
 * A folder's Archived (D10, R29 B4): the songs archived from it (a learner's Archive of one of the
 * app's songs hides it for them), each with Unarchive, which puts it back where it stood. Reached by
 * the folder's last row, Archived (n); its Back goes up to the folder.
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
  return (
    <div className="flex flex-col gap-6 pb-4">
      <ScreenHeader
        title={t('folder.archived')}
        back={<BackButton label={t('folder.up', { name: nameOf(folder) })} />}
      />
      {songs.length === 0 ? (
        <ArchiveEmpty />
      ) : (
        <ul
          aria-label={t('folder.archivedIn', { name: nameOf(folder) })}
          className={cn(GROUPED_LIST, 'mx-auto w-full max-w-2xl')}
        >
          {songs.map((entry) => (
            <ArchivedRow
              key={entry.id}
              entry={entry}
              restore={t('folder.unarchive')}
              onRestore={() => acts.restore([entry.id])}
              more={null}
            />
          ))}
        </ul>
      )}
    </div>
  )
}
