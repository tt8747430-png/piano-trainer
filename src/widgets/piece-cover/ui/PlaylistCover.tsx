import { Heart } from 'lucide-react'
import type { FolderPaint } from '@/entities/library'
import type { Entry } from '@/entities/piece'
import { cn } from '@/shared/lib'
import { Avatar } from '@/shared/ui'
import { IncipitStaff } from './IncipitStaff'
import { playlistPaint } from './playlist-paint'

/**
 * A playlist's cover (the Songs board's PLCOVER; Flat's playlists, Apple Music's mosaic): a square of
 * its paint holding its first four songs' openings two by two, so it shows the music inside;
 * Favourites a rose square with its heart; one shared with the learner wears the sharer's face at its
 * corner. Sized by its container's class: 64 in a row, 48 in a laptop's pane.
 */
export function PlaylistCover({
  paint,
  songs = [],
  heart = false,
  face,
  className,
}: {
  paint: FolderPaint | 'rose'
  songs?: readonly Entry[]
  heart?: boolean
  /** Who shared it, by name: their face at the corner. */
  face?: string
  className?: string
}) {
  return (
    <span
      aria-hidden
      className={cn('relative block shrink-0 rounded-thumb', playlistPaint(paint), className)}
    >
      {heart ? (
        <Heart className="absolute top-1/2 left-1/2 size-1/2 -translate-1/2 fill-heart text-heart" />
      ) : songs.length > 0 ? (
        <span className="absolute inset-[9%] grid grid-cols-2 grid-rows-2 gap-[5%]">
          {songs.slice(0, 4).map((entry, index) => (
            <IncipitStaff
              key={`${entry.id}-${index}`}
              entry={entry}
              className="size-full rounded-mark"
            />
          ))}
        </span>
      ) : null}
      {face ? (
        <span className="absolute -right-1 -bottom-1 rounded-full ring-2 ring-card">
          <Avatar name={face} picture={null} size="feed" />
        </span>
      ) : null}
    </span>
  )
}
