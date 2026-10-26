import { TileMark } from '@/shared/ui'
import type { FolderLook } from '../model/types'
import { FOLDER_PICTURE_ICONS } from './folder-pictures'

/** A folder's tile: its picture on its paint, as a row wears it. */
export function FolderTile({ look }: { look: FolderLook }) {
  return <TileMark icon={FOLDER_PICTURE_ICONS[look.picture]} paint={look.paint} />
}
