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

/** Each act's picture, the same wherever a bar draws it (R29 B10). */
export const BAR_ICONS: Readonly<Record<BarAct, LucideIcon>> = {
  favourite: Heart,
  edit: Pencil,
  move: FolderInput,
  export: Download,
  archive: Archive,
  delete: Trash2,
}
