import { FOLDER_PICTURE_ICONS, useLibrary } from '@/entities/library'
import type { Entry } from '@/entities/piece'
import { TileMark } from '@/shared/ui'
import { IncipitStaff } from './IncipitStaff'

/**
 * A song's small cover at the head of its row (canvas 133, "rows show their music"): the picture the
 * learner chose on its paint, as its big cover; else its first notes on a printed staff, so a song is
 * known by its tune before its name is read. Hidden from a screen reader: the row names the song.
 */
export function PieceMark({ entry }: { entry: Entry }) {
  const look = useLibrary((state) => state.songLooks[entry.id])
  if (look) return <TileMark large icon={FOLDER_PICTURE_ICONS[look.picture]} paint={look.paint} />
  return <IncipitStaff entry={entry} slot="row-tile" className="size-11 shrink-0 rounded-control" />
}
