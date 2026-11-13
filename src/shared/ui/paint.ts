import type { KeyRole } from '@/shared/lib/music'

/** The chrome's paints that name places and kinds of step (DESIGN.md, the paint set). */
export type Paint = 'sand' | 'sky' | 'grass' | 'yellow' | 'lilac'

/**
 * A paint as the book prints it on a place: its wash as a tile's fill, its deep shade as the icon on
 * it; at full strength, ink on it, for a chip while what it names sounds; and solid, a row's tile under
 * a white glyph.
 */
export const PAINT: Readonly<
  Record<
    Paint,
    { readonly fill: string; readonly ink: string; readonly full: string; readonly tile: string }
  >
> = {
  sand: {
    fill: 'bg-paint-sand',
    ink: 'text-on-paint-sand',
    full: 'bg-paint-full-sand',
    tile: 'bg-paint-tile-sand',
  },
  sky: {
    fill: 'bg-paint-sky',
    ink: 'text-on-paint-sky',
    full: 'bg-paint-full-sky',
    tile: 'bg-paint-tile-sky',
  },
  grass: {
    fill: 'bg-paint-grass',
    ink: 'text-on-paint-grass',
    full: 'bg-paint-full-grass',
    tile: 'bg-paint-tile-grass',
  },
  yellow: {
    fill: 'bg-paint-yellow',
    ink: 'text-on-paint-yellow',
    full: 'bg-paint-full-yellow',
    tile: 'bg-paint-tile-yellow',
  },
  lilac: {
    fill: 'bg-paint-lilac',
    ink: 'text-on-paint-lilac',
    full: 'bg-paint-full-lilac',
    tile: 'bg-paint-tile-lilac',
  },
}

/**
 * What each role is painted, on every chord of a progression and its legend (A23, DESIGN.md,
 * Harmony): home grass, away sand, tension lilac.
 */
export const ROLE_PAINT: Readonly<Record<KeyRole, Paint>> = {
  home: 'grass',
  away: 'sand',
  tension: 'lilac',
}
