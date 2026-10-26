import { ArchiveRestore, Ellipsis, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  libraryCatalog,
  useLibraryLayout,
  useLibraryStoreApi,
  type ShelvedEntry,
  type ShelvedFolder,
} from '@/entities/library'
import { isOwnSongId, useRepertoire, type PieceId } from '@/entities/piece'
import { DeleteFolderAsk, restoreAll, useLibraryActs } from '@/features/manage-library'
import { ActionMenu, BackButton, say, ScreenHeader } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { ArchiveEmpty } from './ArchiveEmpty'
import { ArchivedRow } from './ArchivedRow'
import { DeleteSongAsk } from './DeleteSongAsk'

/** An entry's key: a song's or a folder's, by its id. */
const keyOf = (entry: ShelvedEntry) =>
  entry.kind === 'song' ? `song:${entry.id}` : `folder:${entry.folder.id}`

/**
 * The archive (ADR 0106, Mindscape's `ArchivedDecksPage` and its ADR 0003, the archive is a place):
 * Back and Restore all in its bar; what was archived, the newest first, folders with their songs
 * counted and songs, each with Restore, and its More with Delete, asked first, for the learner's own
 * song or folder; empty, it says what it is for.
 */
export function ArchivePage() {
  const { t } = useTranslation('songs')
  const layout = useLibraryLayout()
  const store = useLibraryStoreApi()
  const repertoire = useRepertoire()
  const acts = useLibraryActs()
  const [deletingSong, setDeletingSong] = useState<PieceId | null>(null)
  const [deletingFolder, setDeletingFolder] = useState<ShelvedFolder | null>(null)
  const { archive } = layout
  return (
    <div className="flex flex-col gap-6 pb-4">
      <ScreenHeader
        title={t('archive.title')}
        back={<BackButton fallback={{ to: '/songs' }} />}
        actions={
          archive.length > 0 ? (
            <Button
              variant="soft"
              onClick={() => {
                restoreAll(store, libraryCatalog(repertoire))
                say(t('archive.restoredAll'))
              }}
            >
              <ArchiveRestore data-icon="inline-start" aria-hidden />
              {t('archive.restoreAll')}
            </Button>
          ) : null
        }
      />
      {archive.length === 0 ? (
        <ArchiveEmpty />
      ) : (
        <ul aria-label={t('archive.title')} className="grid-cards gap-2">
          {archive.map((entry) => {
            const own = entry.kind === 'song' ? isOwnSongId(entry.id) : !entry.folder.builtIn
            return (
              <ArchivedRow
                key={keyOf(entry)}
                entry={entry}
                onRestore={() =>
                  entry.kind === 'song'
                    ? acts.restore([entry.id])
                    : acts.restoreFolder(entry.folder)
                }
                more={
                  own ? (
                    <ActionMenu
                      label={t('library.more')}
                      align="end"
                      trigger={<Ellipsis aria-hidden />}
                      render={
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-full"
                          aria-label={t('library.more')}
                          title={t('library.more')}
                        />
                      }
                      actions={[
                        {
                          key: 'delete',
                          label: t('library.delete'),
                          icon: Trash2,
                          destructive: true,
                          onSelect: () =>
                            entry.kind === 'song'
                              ? setDeletingSong(entry.id)
                              : setDeletingFolder(entry.folder),
                        },
                      ]}
                    />
                  ) : null
                }
              />
            )
          })}
        </ul>
      )}
      <DeleteSongAsk
        song={deletingSong}
        onOpenChange={(open) => (open ? undefined : setDeletingSong(null))}
      />
      <DeleteFolderAsk
        folder={deletingFolder}
        onOpenChange={(open) => (open ? undefined : setDeletingFolder(null))}
      />
    </div>
  )
}
