import { useNavigate } from '@tanstack/react-router'
import type { ShelvedFolder } from '@/entities/library'
import { isSongCollectionId, useRepertoire } from '@/entities/piece'
import { DeleteFolderAsk, FolderSheet, MoveSheet } from '@/features/manage-library'
import { NewGroupSheet } from '@/features/share-folder'
import { ExportSheet, useSongFiles, type ExportFiles } from '@/features/song-files'
import type { LibraryPage } from '../model/use-library-page'
import { DeleteAsk } from './DeleteAsk'
import { NewSongSheet } from './NewSongSheet'
import { RecordSheet } from './RecordSheet'

/**
 * What the library's page opens over itself, one at a time (Mindscape's `LibraryDialogs`): Move to…,
 * the folder sheet, the asks before Delete, New song, Record, New group, and Export… of the songs chosen.
 */
export function LibraryDialogs({
  page,
  folder,
}: {
  page: LibraryPage
  folder: ShelvedFolder | null
}) {
  const { pending } = page
  const repertoire = useRepertoire()
  const navigate = useNavigate()
  // The songs Select chose, each one's file in turn.
  const filesOf = useSongFiles()
  const chosen =
    pending?.kind === 'export-chosen'
      ? pending.songs.flatMap((id) => {
          const piece = repertoire.piece(id)
          return piece ? [filesOf(piece)] : []
        })
      : []
  const chosenFiles: ExportFiles = {
    musicXml: (format) => chosen.forEach((files) => files.musicXml(format)),
    midi: () => chosen.forEach((files) => files.midi()),
  }
  // One New song (round 26): in a collection's folder, an editor's is the collection's, for everyone
  // (only an editor may add one there, R29 B4).
  const collection =
    folder && isSongCollectionId(folder.id) && page.may('addSong') ? folder.id : undefined
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
      <NewGroupSheet
        open={pending?.kind === 'new-group'}
        onOpenChange={shut}
        onMade={(group) => {
          page.close()
          void navigate({ to: '/songs/groups/$groupId', params: { groupId: group.id } })
        }}
      />
      <NewSongSheet
        open={pending?.kind === 'new-song' && (pending.record !== true || collection !== undefined)}
        onOpenChange={shut}
        folder={folder?.id ?? null}
        builtIn={collection}
      />
      <RecordSheet
        open={pending?.kind === 'new-song' && pending.record === true && collection === undefined}
        onOpenChange={shut}
        folder={folder?.id ?? null}
      />
      <ExportSheet
        subject={pending?.kind === 'export-chosen' ? pending.what : null}
        files={chosenFiles}
        onOpenChange={shut}
      />
    </>
  )
}
