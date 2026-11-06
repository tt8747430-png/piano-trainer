import {
  Archive,
  Download,
  FolderInput,
  Heart,
  HeartOff,
  Link2,
  Music,
  Palette,
  PencilLine,
  Play,
  Settings,
  Trash2,
} from 'lucide-react'
import type { TFunction } from 'i18next'
import type { ShelvedFolder } from '@/entities/library'
import { isPiece, type Entry } from '@/entities/piece'
import type { RowAction } from '@/shared/ui'
import type { LibraryPage } from '../model/use-library-page'

/**
 * A song's actions in the library (ADR 0106, R31-S), in the menu's four parts: Play, Edit score and
 * Settings (a song with music); Favourite and Move to folder… (where it may leave the folder, R29
 * B4); Share link and Export… (its files, ADR 0107) where it has music; Archive, and Delete for the
 * learner's own song alone, asked first.
 */
export function songActions(
  entry: Entry,
  page: LibraryPage,
  t: TFunction<['songs', 'common']>,
): RowAction[] {
  const favourite = page.favourites.includes(entry.id)
  const music = isPiece(entry)
  return [
    {
      key: 'play',
      group: 'open',
      label: t('library.play'),
      icon: Play,
      paint: 'yellow',
      onSelect: () => page.openSong(entry.id, 'play'),
    },
    ...(music
      ? [
          {
            key: 'edit',
            group: 'open',
            label: t('library.editScore'),
            icon: Music,
            paint: 'sky' as const,
            onSelect: () => page.openSong(entry.id, 'edit'),
          },
        ]
      : []),
    ...(music
      ? [
          {
            key: 'settings',
            group: 'open',
            label: t('library.settings'),
            icon: Settings,
            paint: 'sand' as const,
            onSelect: () => page.openSong(entry.id, 'settings'),
          },
        ]
      : []),
    {
      key: 'favourite',
      group: 'library',
      label: t(favourite ? 'common:library.unfavourite' : 'common:library.favourite'),
      icon: favourite ? HeartOff : Heart,
      paint: 'sand',
      onSelect: () => page.acts.toggleFavourite(entry.id),
    },
    ...(page.may('moveOut')
      ? [
          {
            key: 'move',
            group: 'library',
            label: t('library.moveTo'),
            icon: FolderInput,
            paint: 'sky' as const,
            onSelect: () =>
              page.moveOne({ songs: [entry.id], folders: [] }, page.titleOf(entry.id)),
          },
        ]
      : []),
    ...(music
      ? [
          {
            key: 'share',
            group: 'share',
            label: t('library.shareLink'),
            icon: Link2,
            paint: 'grass' as const,
            onSelect: () => page.open({ kind: 'share', song: entry.id }),
          },
          {
            key: 'export',
            group: 'share',
            label: t('export.action'),
            icon: Download,
            paint: 'grass' as const,
            onSelect: () => page.open({ kind: 'export', song: entry.id }),
          },
        ]
      : []),
    ...(page.may('archiveSong')
      ? [
          {
            key: 'archive',
            group: 'away',
            label: t('library.archive'),
            icon: Archive,
            paint: 'lilac' as const,
            onSelect: () => page.archive([entry.id]),
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
      group: 'look',
      label: t('folder.edit'),
      icon: PencilLine,
      paint: 'grass',
      onSelect: () => page.editFolder(folder.id),
    },
    {
      key: 'card-style',
      group: 'look',
      label: t('cardStyle.open'),
      icon: Palette,
      paint: 'yellow',
      onSelect: () => page.openCardStyle(folder.id),
    },
    page.may('moveOut') && {
      key: 'move',
      group: 'place',
      label: t('library.moveTo'),
      icon: FolderInput,
      paint: 'sky',
      onSelect: () => page.moveOne({ songs: [], folders: [folder.id] }, name),
    },
    page.mayOnFolder('archiveFolder', folder) && {
      key: 'archive',
      group: 'away',
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
