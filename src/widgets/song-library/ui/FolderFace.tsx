import { FolderTile, useFolderName, type ShelvedFolder } from '@/entities/library'
import { RowFace } from '@/shared/ui'
import { useHoldsLine } from './use-holds-line'

/** What a folder's row tells of what it holds: the folders and songs in it, and how many are learned. */
export interface FolderHolds {
  readonly folders: number
  readonly songs: number
  /** Of its songs, those learned: none counted where the row has no progress to tell (the Archive). */
  readonly learned?: number
}

/**
 * What a folder's row shows (canvas 133): its tile (its picture on its paint), its name, and under it
 * what it holds, "23 songs · 4 learned" ("Empty" while it holds nothing).
 */
export function FolderFace({ folder, holds }: { folder: ShelvedFolder; holds: FolderHolds }) {
  const nameOf = useFolderName()
  return (
    <>
      <FolderTile look={folder} large />
      <RowFace title={nameOf(folder)} detail={useHoldsLine(holds)} />
    </>
  )
}
