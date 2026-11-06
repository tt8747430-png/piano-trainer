import { useNavigate, useRouter } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import type { ShelvedFolder } from '@/entities/library'
import { entryTitles, isSongCollectionId, useRepertoire } from '@/entities/piece'
import { selectView } from '@/entities/views'
import { DeleteFolderAsk, FolderSheet, MoveSheet } from '@/features/manage-library'
import { NewGroupSheet } from '@/features/share-folder'
import { songToShare, useShareSong } from '@/features/share-song'
import { ExportSheet, SongExportSheet, useSongFiles, type ExportFiles } from '@/features/song-files'
import { useLocale } from '@/shared/i18n'
import { say } from '@/shared/ui'
import type { LibraryPage } from '../model/use-library-page'
import { DeleteAsk } from './DeleteAsk'
import { MoveInSheet } from './MoveInSheet'
import { NewSongSheet } from './NewSongSheet'

/** What sharing said, as the song's page words it. */
const SAID = {
  copied: 'shareCopied',
  linked: 'shareLinked',
  failed: 'shareFailed',
  tooLong: 'shareTooLong',
} as const

/**
 * What the library's page opens over itself, one at a time (Mindscape's `LibraryDialogs`): Move to…,
 * the folder sheet, the asks before Delete, New song, an empty folder's Move songs here, and a
 * song's Export… (its link's word said in a toast, as the row has no line of its own).
 */
export function LibraryDialogs({
  page,
  folder,
}: {
  page: LibraryPage
  folder: ShelvedFolder | null
}) {
  const { t } = useTranslation(['songs', 'piece'])
  const { pending } = page
  const repertoire = useRepertoire()
  const locale = useLocale()
  const router = useRouter()
  const navigate = useNavigate()
  const shared = useShareSong()
  const said = shared.said
  useEffect(() => {
    if (said) say(t(`piece:${SAID[said]}`))
  }, [said, t])
  const exported = pending?.kind === 'export' ? (repertoire.piece(pending.song) ?? null) : null
  // Share link, from a row's ⋯ (R31-S): shared at once, as the song's Settings shares it.
  const sharing = pending?.kind === 'share' ? (repertoire.piece(pending.song) ?? null) : null
  useEffect(() => {
    if (!sharing) return
    page.close()
    const what = songToShare(
      sharing,
      entryTitles(sharing, locale).primary,
      selectView(router.options.context.views.getState(), `/play/${sharing.id}`),
    )
    if (what) shared.share(what)
  }, [sharing, page, locale, router, shared])
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
        open={pending?.kind === 'new-song'}
        onOpenChange={shut}
        folder={folder?.id ?? null}
        builtIn={collection}
        record={pending?.kind === 'new-song' && pending.record === true}
      />
      <ExportSheet
        subject={pending?.kind === 'export-chosen' ? pending.what : null}
        files={chosenFiles}
        onOpenChange={shut}
      />
      <SongExportSheet piece={exported} onOpenChange={shut} />
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
