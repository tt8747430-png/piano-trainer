import { isFolderPicture, type FolderPicture } from '@/entities/library'
import type { Paint } from '@/shared/ui'

const PAINTS: readonly Paint[] = ['sand', 'sky', 'grass', 'yellow', 'lilac']

/**
 * A group's or a shared folder's look as the server keeps it (R32-C), read as the app draws it: its
 * picture where it is one of the folders' (none draws the group's people), its paint where it is one
 * of the paints, else lilac.
 */
export function lookOf(saved: { readonly picture: string; readonly paint: string }): {
  readonly picture: FolderPicture | null
  readonly paint: Paint
} {
  return {
    picture: isFolderPicture(saved.picture) ? saved.picture : null,
    paint: PAINTS.find((paint) => paint === saved.paint) ?? 'lilac',
  }
}
