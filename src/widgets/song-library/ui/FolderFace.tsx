import { useTranslation } from 'react-i18next'
import { FolderTile, useFolderName, type ShelvedFolder } from '@/entities/library'
import { RowFace } from '@/shared/ui'

/** What a folder's row tells of what it holds: the folders and songs in it, and its first songs' titles. */
export interface FolderHolds {
  readonly folders: number
  readonly songs: number
  readonly first?: readonly string[]
}

/**
 * What a folder's row shows: its tile (its picture on its paint), its name, the folders and songs in
 * it counted ("Empty" while it holds none), and under them its first songs' titles, as Files and
 * Music show a folder's first items (hidden from a screen reader: the folder's page lists them).
 */
export function FolderFace({ folder, holds }: { folder: ShelvedFolder; holds: FolderHolds }) {
  const { t } = useTranslation('songs')
  const nameOf = useFolderName()
  const counted = [
    holds.folders > 0 ? t('folder.folderCount', { count: holds.folders }) : null,
    holds.songs > 0 ? t('folder.songCount', { count: holds.songs }) : null,
  ].filter((part) => part !== null)
  const first = holds.first ?? []
  return (
    <>
      <FolderTile look={folder} />
      <RowFace
        title={nameOf(folder)}
        detail={counted.length > 0 ? counted.join(' · ') : t('folder.empty')}
      >
        {first.length > 0 ? (
          <span
            data-slot="row-first"
            aria-hidden
            className="block truncate text-sm leading-normal text-muted-foreground"
          >
            {first.join(' · ')}
          </span>
        ) : null}
      </RowFace>
    </>
  )
}
