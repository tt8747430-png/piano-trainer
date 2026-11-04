import { Archive, Download, FolderInput, Heart, HeartOff, PencilLine, Trash2 } from 'lucide-react'
import type { TFunction } from 'i18next'
import type { ShelvedFolder } from '@/entities/library'
import { isPiece, type Entry } from '@/entities/piece'
import type { RowAction } from '@/widgets/song-library'
import type { LibraryPage } from '../model/use-library-page'

/**
 * A song's actions in the library (ADR 0106): Favourite, Move to… (where it may leave the folder,
 * R29 B4), Archive, Export… (its files and link, ADR 0107) where it has music, and Delete for the
 * learner's own song alone, asked first.
 */
export function songActions(entry: Entry, page: LibraryPage, t: TFunction<'songs'>): RowAction[] {
  const favourite = page.favourites.includes(entry.id)
  return [
    {
      key: 'favourite',
      label: t(favourite ? 'library.unfavourite' : 'library.favourite'),
      icon: favourite ? HeartOff : Heart,
      paint: 'sand',
      onSelect: () => page.acts.toggleFavourite(entry.id),
    },
    ...(page.may('moveOut')
      ? [
          {
            key: 'move',
            label: t('library.moveTo'),
            icon: FolderInput,
            paint: 'sky' as const,
            onSelect: () =>
              page.moveOne({ songs: [entry.id], folders: [] }, page.titleOf(entry.id)),
          },
        ]
      : []),
    ...(page.may('archiveSong')
      ? [
          {
            key: 'archive',
            label: t('library.archive'),
            icon: Archive,
            paint: 'lilac' as const,
            onSelect: () => page.archive([entry.id]),
          },
        ]
      : []),
    ...(isPiece(entry)
      ? [
          {
            key: 'export',
            label: t('export.action'),
            icon: Download,
            paint: 'grass' as const,
            onSelect: () => page.open({ kind: 'export', song: entry.id }),
          },
        ]
      : []),
    ...(page.mayDelete(entry.id)
      ? [
          {
            key: 'delete',
            label: t('library.delete'),
            icon: Trash2,
            paint: 'sand' as const,
            destructive: true,
            onSelect: () => page.open({ kind: 'delete-songs', songs: [entry.id] }),
          },
        ]
      : []),
  ]
}

/**
 * A folder's actions (ADR 0106): Edit, Move to… (with all it holds), Archive (with all it holds), and
 * Delete, asked first; a built-in folder, Move to… alone (R29 B4: it is the catalog's).
 */
export function folderActions(
  folder: ShelvedFolder,
  name: string,
  page: LibraryPage,
  t: TFunction<'songs'>,
): RowAction[] {
  const actions: (RowAction | false)[] = [
    page.mayOnFolder('renameFolder', folder) && {
      key: 'edit',
      label: t('folder.edit'),
      icon: PencilLine,
      paint: 'grass',
      onSelect: () => page.open({ kind: 'folder', target: { kind: 'edit', folder } }),
    },
    page.may('moveOut') && {
      key: 'move',
      label: t('library.moveTo'),
      icon: FolderInput,
      paint: 'sky',
      onSelect: () => page.moveOne({ songs: [], folders: [folder.id] }, name),
    },
    page.mayOnFolder('archiveFolder', folder) && {
      key: 'archive',
      label: t('folder.archive'),
      icon: Archive,
      paint: 'lilac',
      onSelect: () => page.acts.archiveFolder(folder),
    },
    page.mayOnFolder('deleteFolder', folder) && {
      key: 'delete',
      label: t('folder.delete'),
      icon: Trash2,
      paint: 'sand',
      destructive: true,
      onSelect: () => page.open({ kind: 'delete-folder', folder }),
    },
  ]
  return actions.filter((action): action is RowAction => action !== false)
}
