import type { HarmonicFunction, RootStep } from '@/shared/lib/music'

/** The chrome's paints that name places and kinds of step (DESIGN.md, the paint set). */
export type Paint = 'sand' | 'sky' | 'grass' | 'yellow' | 'lilac'

/**
 * A paint as the book prints it on a place: its wash as a tile's fill, its deep shade as the icon on
 * it; and at full strength, ink on it, for a chip while what it names sounds.
 */
export const PAINT: Readonly<
  Record<Paint, { readonly fill: string; readonly ink: string; readonly full: string }>
> = {
  sand: { fill: 'bg-paint-sand', ink: 'text-on-paint-sand', full: 'bg-paint-full-sand' },
  sky: { fill: 'bg-paint-sky', ink: 'text-on-paint-sky', full: 'bg-paint-full-sky' },
  grass: { fill: 'bg-paint-grass', ink: 'text-on-paint-grass', full: 'bg-paint-full-grass' },
  yellow: { fill: 'bg-paint-yellow', ink: 'text-on-paint-yellow', full: 'bg-paint-full-yellow' },
  lilac: { fill: 'bg-paint-lilac', ink: 'text-on-paint-lilac', full: 'bg-paint-full-lilac' },
}

/** What each function is painted, on every chip and legend (DESIGN.md, Harmony). */
export const FUNCTION_PAINT: Readonly<Record<HarmonicFunction, Paint>> = {
  tonic: 'grass',
  subdominant: 'sand',
  dominant: 'lilac',
}

/** What each strong root move is painted: a 5th down lilac, a 3rd down sand, a 2nd up grass. */
export const MOVE_PAINT: Readonly<Record<RootStep, Paint>> = {
  fifth: 'lilac',
  third: 'sand',
  second: 'grass',
}
