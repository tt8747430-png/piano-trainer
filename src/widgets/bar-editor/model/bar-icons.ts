import {
  Archive,
  Download,
  FolderInput,
  Heart,
  Pencil,
  Trash2,
  type LucideIcon,
} from 'lucide-react'
import type { BarAct } from '@/entities/settings'
import type { Paint } from '@/shared/ui'

/** Each act's picture, the same wherever a bar draws it (R29 B10). */
export const BAR_ICONS: Readonly<Record<BarAct, LucideIcon>> = {
  favourite: Heart,
  edit: Pencil,
  move: FolderInput,
  export: Download,
  archive: Archive,
  delete: Trash2,
}

/** Each act's paint on a swipe's tray, as the library's rows wear it (`pages/songs` row actions). */
export const BAR_PAINTS: Readonly<Record<BarAct, Paint>> = {
  favourite: 'sand',
  edit: 'grass',
  move: 'sky',
  export: 'grass',
  archive: 'lilac',
  delete: 'sand',
}
