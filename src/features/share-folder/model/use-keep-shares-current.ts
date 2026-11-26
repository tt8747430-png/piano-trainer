import { useEffect } from 'react'
import { useFolderName, useLibraryLayout } from '@/entities/library'
import { entryTitles, useRepertoire } from '@/entities/piece'
import { useLocale } from '@/shared/i18n'
import { useGroups } from '@/shared/lib/groups'
import { folderShareOf } from './folder-share'
import type { GroupsData } from './use-groups-data'

/** How long the library rests before a changed folder is written to its groups again. */
const SETTLE_MS = 1500

/**
 * Keeps the learner's shared folders current (R30 S6): once the library rests after a change, each
 * folder they share is written to its groups again where its name, look or songs no longer match
 * the copy, then `onWritten` reads the groups again.
 */
export function useKeepSharesCurrent(data: GroupsData, onWritten: () => void): void {
  const port = useGroups()
  const layout = useLibraryLayout()
  const repertoire = useRepertoire()
  const nameOf = useFolderName()
  const locale = useLocale()
  useEffect(() => {
    if (data.kind !== 'ready') return
    const mine = data.shared.filter((share) => share.mine)
    if (mine.length === 0) return
    const timer = setTimeout(() => {
      const writes = mine.flatMap((share) => {
        const folder = layout.folders.find((each) => each.id === share.folderKey)
        if (!folder) return []
        const now = folderShareOf(
          folder,
          nameOf(folder),
          (id) => {
            const entry = repertoire.entry(id)
            return entry && entry.kind !== 'listing' ? entry : undefined
          },
          (piece) => entryTitles(piece, locale).primary,
        )
        const same =
          now.name === share.name &&
          now.picture === share.picture &&
          now.paint === share.paint &&
          JSON.stringify(now.songs) === JSON.stringify(share.songs)
        return same ? [] : [port.share(share.groupId, now, share.canEdit)]
      })
      if (writes.length > 0) void Promise.all(writes).then(onWritten)
    }, SETTLE_MS)
    return () => clearTimeout(timer)
  }, [data, layout, repertoire, nameOf, locale, port, onWritten])
}
