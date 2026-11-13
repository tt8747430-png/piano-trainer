import { TileMark } from '@/shared/ui'
import type { FolderLook } from '../model/types'
import { FOLDER_PICTURE_ICONS } from './folder-pictures'

/** A folder's tile: its picture on its paint, as a row wears it; `large` at a library row's head. */
export function FolderTile({
  look,
  large = false,
  className,
}: {
  look: FolderLook
  large?: boolean
  className?: string
}) {
  return (
    <TileMark
      large={large}
      className={className}
      icon={FOLDER_PICTURE_ICONS[look.picture]}
      paint={look.paint}
    />
  )
}
