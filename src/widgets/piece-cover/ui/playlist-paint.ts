import type { FolderPaint } from '@/entities/library'

const PAINT: Readonly<Record<FolderPaint, string>> = {
  sand: 'bg-paint-sand',
  sky: 'bg-paint-sky',
  grass: 'bg-paint-grass',
  yellow: 'bg-paint-yellow',
  lilac: 'bg-paint-lilac',
}

/** A playlist's paint as a fill: its cover's, and its swatch in the sidebar; Favourites rose. */
export const playlistPaint = (paint: FolderPaint | 'rose') =>
  paint === 'rose' ? 'bg-destructive/15' : PAINT[paint]
