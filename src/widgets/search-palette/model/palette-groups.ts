import type { IndexEntry, IndexGroup, IndexKind } from './index-entries'

/** The palette's groups, in the order it lists them (rule 27). */
export const PALETTE_GROUPS = ['practice', 'songs', 'folders', 'lessons'] as const
export type PaletteGroupId = (typeof PALETTE_GROUPS)[number]

/** Where each kind the index holds is listed: Practice holds every tool and thing it shows. */
const GROUP_OF: Readonly<Record<IndexKind, PaletteGroupId>> = {
  pages: 'practice',
  chords: 'practice',
  scales: 'practice',
  progressions: 'practice',
  patterns: 'practice',
  exercises: 'practice',
  quiz: 'practice',
  songs: 'songs',
  folders: 'folders',
  lessons: 'lessons',
  courses: 'lessons',
}

/** The rows a group shows: the nearest, the palette's list short enough to read at a glance. */
export const MOST_PER_GROUP = 6

export interface PaletteGroup {
  readonly id: PaletteGroupId
  readonly entries: readonly IndexEntry[]
}

/**
 * The palette's groups from what the index found: each kind in its group, the nearest kinds first
 * within it as the index ranked them, at most `most` rows a group; groups with nothing left out.
 */
export function paletteGroups(
  found: readonly IndexGroup[],
  most: number = MOST_PER_GROUP,
): PaletteGroup[] {
  return PALETTE_GROUPS.map((id) => ({
    id,
    entries: found
      .filter((group) => GROUP_OF[group.kind] === id)
      .flatMap((group) => group.entries)
      .slice(0, most),
  })).filter((group) => group.entries.length > 0)
}
