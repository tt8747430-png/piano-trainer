import type { ShelvedFolder } from '@/entities/library'
import { DeleteFolderAsk, FolderSheet, MoveSheet } from '@/features/manage-library'
import type { LibraryPage } from '../model/use-library-page'
import { DeleteAsk } from './DeleteAsk'
import { MoveInSheet } from './MoveInSheet'
import { NewSongSheet } from './NewSongSheet'

/**
 * What the library's page opens over itself, one at a time (Mindscape's `LibraryDialogs`): Move to…,
 * the folder sheet, the asks before Delete, New song, and an empty folder's Move songs here.
 */
export function LibraryDialogs({
  page,
  folder,
}: {
  page: LibraryPage
  folder: ShelvedFolder | null
}) {
  const { pending } = page
  const shut = (open: boolean) => {
    if (!open) page.close()
  }
  return (
    <>
      <MoveSheet
        moving={pending?.kind === 'move' ? pending.moving : null}
        what={pending?.kind === 'move' ? pending.what : ''}
        onOpenChange={(open) => {
          if (open) return
          page.close()
          // A move chosen in Select ends it.
          if (page.select.on) page.select.exit()
        }}
      />
      <FolderSheet
        target={pending?.kind === 'folder' ? pending.target : null}
        onOpenChange={shut}
      />
      <DeleteFolderAsk
        folder={pending?.kind === 'delete-folder' ? pending.folder : null}
        onOpenChange={shut}
        onDeleted={() => {
          // Its page leaves first: there is nothing to show once it is gone.
          if (pending?.kind === 'delete-folder' && pending.folder.id === folder?.id) page.leave()
        }}
      />
      <DeleteAsk page={page} />
      <NewSongSheet
        open={pending?.kind === 'new-song'}
        onOpenChange={shut}
        folder={folder?.id ?? null}
      />
      {folder ? (
        <MoveInSheet
          page={page}
          folder={folder}
          open={pending?.kind === 'move-in'}
          onOpenChange={shut}
        />
      ) : null}
    </>
  )
}
