import {
  Archive,
  FolderInput,
  Heart,
  HeartOff,
  Music,
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
 * A song's ··· in the library (R72's ROWSHEET, Flat's): Practise, Edit score where it has music, Add to
 * a folder (where it may leave the folder, R29 B4), Favourite, Settings where it has music, Archive.
 * Its files and Delete are its page's Settings (ADR 0107, R34).
 */
export function songActions(
  entry: Entry,
  page: LibraryPage,
  t: TFunction<['songs', 'common']>,
): RowAction[] {
  const favourite = page.favourites.includes(entry.id)
  const music = isPiece(entry)
  const actions: (RowAction | false)[] = [
    {
      key: 'play',
      label: t('library.practise'),
      icon: Play,
      paint: 'yellow',
      onSelect: () => page.openSong(entry.id, 'play'),
    },
    music && {
      key: 'edit',
      label: t('library.editScore'),
      icon: Music,
      paint: 'sky',
      onSelect: () => page.openSong(entry.id, 'edit'),
    },
    page.may('moveOut') && {
      key: 'move',
      label: t('library.addToFolder'),
      icon: FolderInput,
      paint: 'sky',
      onSelect: () => page.moveOne({ songs: [entry.id], folders: [] }, page.titleOf(entry.id)),
    },
    {
      key: 'favourite',
      label: t(favourite ? 'common:library.unfavourite' : 'common:library.favourite'),
      icon: favourite ? HeartOff : Heart,
      paint: 'sand',
      onSelect: () => page.acts.toggleFavourite(entry.id),
    },
    music && {
      key: 'settings',
      label: t('library.settings'),
      icon: Settings,
      paint: 'sand',
      onSelect: () => page.openSong(entry.id, 'settings'),
    },
    page.may('archiveSong') && {
      key: 'archive',
      label: t('library.archive'),
      icon: Archive,
      paint: 'lilac',
      destructive: true,
      onSelect: () => page.archive([entry.id]),
    },
  ]
  return actions.filter((action): action is RowAction => action !== false)
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
