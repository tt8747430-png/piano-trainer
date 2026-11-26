import { RotateCcw, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLibraryLayout, type ShelvedEntry, type ShelvedFolder } from '@/entities/library'
import { isOwnSongId, type PieceId } from '@/entities/piece'
import { DeleteFolderAsk, useLibraryActs } from '@/features/manage-library'
import { ArchiveEmpty } from './ArchiveEmpty'
import { ShelfList, type ShelfItem } from './ShelfList'

/** An entry's key: a song's or a folder's, by its id. */
const keyOf = (entry: ShelvedEntry) =>
  entry.kind === 'song' ? `song:${entry.id}` : `folder:${entry.folder.id}`

/** Whether the learner's own: a song they made, a playlist that is not the app's. */
const isOwn = (entry: ShelvedEntry) =>
  entry.kind === 'song' ? isOwnSongId(entry.id) : !entry.folder.builtIn

/**
 * The archive (ADR 0106, Mindscape's `ArchivedDecksPage`; the Archive boards, canvas v408): what the
 * learner archived, the newest first, each with its ··· (Restore; Move to Trash for their own song,
 * with Undo, R34; Delete playlist for their own playlist, asked first); Select restores or moves to
 * the Trash what is picked, or all of it; empty, it says what it is for. The Trash is its own place.
 */
export function ArchivePage() {
  const { t } = useTranslation('songs')
  const { archive } = useLibraryLayout()
  const acts = useLibraryActs()
  const [deletingFolder, setDeletingFolder] = useState<ShelvedFolder | null>(null)
  const restore = (entry: ShelvedEntry) =>
    entry.kind === 'song' ? acts.restore([entry.id]) : acts.restoreFolder(entry.folder)
  const items: ShelfItem[] = archive.map((entry) => ({
    key: keyOf(entry),
    entry,
    at: entry.at,
    actions: [
      {
        key: 'restore',
        label: t('shelf.restore'),
        icon: RotateCcw,
        onSelect: () => restore(entry),
      },
      ...(isOwn(entry)
        ? [
            {
              key: 'trash',
              label: entry.kind === 'song' ? t('shelf.toTrash') : t('library.delete'),
              icon: Trash2,
              destructive: true,
              onSelect: () =>
                entry.kind === 'song' ? acts.trash([entry.id]) : setDeletingFolder(entry.folder),
            },
          ]
        : []),
    ],
  }))
  const entriesOf = (keys: readonly string[]) =>
    archive.filter((entry) => keys.includes(keyOf(entry)))
  return (
    <>
      <ShelfList
        title={t('archive.title')}
        when={t('table.archived')}
        search={t('archive.search')}
        items={items}
        count={t('shelf.itemCount', { count: items.length })}
        empty={<ArchiveEmpty />}
        acts={{
          restoreIcon: RotateCcw,
          restore: (keys) => {
            const chosen = entriesOf(keys)
            const songs = chosen.flatMap((entry): PieceId[] =>
              entry.kind === 'song' ? [entry.id] : [],
            )
            if (songs.length > 0) acts.restore(songs)
            for (const entry of chosen)
              if (entry.kind === 'folder') acts.restoreFolder(entry.folder)
          },
          loss: {
            label: t('shelf.toTrash'),
            allLabel: t('shelf.toTrashAll'),
            icon: Trash2,
            // Only the learner's own songs go to the Trash; the app's and a playlist stay.
            can: (keys) => {
              const chosen = entriesOf(keys)
              return (
                chosen.length > 0 && chosen.every((entry) => entry.kind === 'song' && isOwn(entry))
              )
            },
            run: (keys) =>
              acts.trash(
                entriesOf(keys).flatMap((entry) => (entry.kind === 'song' ? [entry.id] : [])),
              ),
          },
        }}
      />
      <DeleteFolderAsk
        folder={deletingFolder}
        onOpenChange={(open) => (open ? undefined : setDeletingFolder(null))}
      />
    </>
  )
}
