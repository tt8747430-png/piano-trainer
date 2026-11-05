import { Users, type LucideIcon } from 'lucide-react'
import { FOLDER_PICTURE_ICONS } from '@/entities/library'
import type { Paint } from '@/shared/ui'
import { lookOf } from '../model/group-look'

/** A group's or a shared folder's picture and paint, as a row's tile draws them (R32-C). */
export function groupTile(saved: { readonly picture: string; readonly paint: string }): {
  icon: LucideIcon
  paint: Paint
} {
  const { picture, paint } = lookOf(saved)
  return { icon: picture ? FOLDER_PICTURE_ICONS[picture] : Users, paint }
}
