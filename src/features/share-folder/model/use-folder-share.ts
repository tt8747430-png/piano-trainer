import { useFolderName, type ShelvedFolder } from '@/entities/library'
import { entryTitles, useRepertoire } from '@/entities/piece'
import type { FolderShare } from '@/shared/api/groups'
import { useLocale } from '@/shared/i18n'
import { folderShareOf } from './folder-share'

/**
 * How a folder of the learner's is shared (R30 S6): its name as the library names it and its songs,
 * each one of the app's by its id or the learner's own whole. A listing is left out.
 */
export function useFolderShare(): (folder: ShelvedFolder) => FolderShare {
  const nameOf = useFolderName()
  const repertoire = useRepertoire()
  const locale = useLocale()
  return (folder) =>
    folderShareOf(
      folder,
      nameOf(folder),
      (id) => {
        const entry = repertoire.entry(id)
        return entry && entry.kind !== 'listing' ? entry : undefined
      },
      (piece) => entryTitles(piece, locale).primary,
    )
}
