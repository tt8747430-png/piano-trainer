/** The chrome's paints that name places and kinds of step (DESIGN.md, the paint set). */
export type Paint = 'sand' | 'sky' | 'grass' | 'yellow' | 'lilac'

/** A paint as the book prints it on a place: its wash as a tile's fill, its deep shade as the icon on it. */
export const PAINT: Readonly<Record<Paint, { readonly fill: string; readonly ink: string }>> = {
  sand: { fill: 'bg-paint-sand', ink: 'text-on-paint-sand' },
  sky: { fill: 'bg-paint-sky', ink: 'text-on-paint-sky' },
  grass: { fill: 'bg-paint-grass', ink: 'text-on-paint-grass' },
  yellow: { fill: 'bg-paint-yellow', ink: 'text-on-paint-yellow' },
  lilac: { fill: 'bg-paint-lilac', ink: 'text-on-paint-lilac' },
}
