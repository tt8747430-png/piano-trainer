import {
  BookOpen,
  Church,
  Drum,
  Guitar,
  Headphones,
  Heart,
  Leaf,
  Mic,
  Music,
  Piano,
  Star,
  Sun,
  type LucideIcon,
} from 'lucide-react'
import type { FolderPicture } from '../model/types'

/** Each picture a folder may wear, drawn. */
export const FOLDER_PICTURE_ICONS: Readonly<Record<FolderPicture, LucideIcon>> = {
  music: Music,
  piano: Piano,
  mic: Mic,
  guitar: Guitar,
  headphones: Headphones,
  drum: Drum,
  church: Church,
  book: BookOpen,
  heart: Heart,
  star: Star,
  sun: Sun,
  leaf: Leaf,
}
