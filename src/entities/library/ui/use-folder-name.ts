import { isSongCollectionId, SONG_COLLECTIONS } from '@/entities/piece'
import { localText, useLocale } from '@/shared/i18n'
import type { FolderId } from '../model/types'

/**
 * A folder's name as the library prints it: the learner's, else its collection's in the language the
 * app speaks (a built-in folder's until it is renamed).
 */
export function useFolderName(): (folder: { id: FolderId; name?: string | undefined }) => string {
  const locale = useLocale()
  return ({ id, name }) => {
    if (name) return name
    const collection = isSongCollectionId(id)
      ? SONG_COLLECTIONS.find((each) => each.id === id)
      : undefined
    return collection ? localText(collection.name, locale) : id
  }
}
