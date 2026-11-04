import type { Clef } from '@/shared/lib/music'

/**
 * Music with one single staff's clef chosen (R29 B7, the Player's Clef): the staff at `place`, top
 * down, written in `clef`, its notes placed on that clef's lines by whatever draws them. A single
 * staff keeps one clef throughout, so nothing else changes; a staff not there leaves it as it is.
 */
export function withClef<T extends { readonly staves?: readonly { readonly clef: Clef }[] }>(
  music: T,
  place: number,
  clef: Clef,
): T {
  const staves = music.staves
  if (!staves?.[place] || staves[place].clef === clef) return music
  return {
    ...music,
    staves: staves.map((staff, at) => (at === place ? { ...staff, clef } : staff)),
  }
}
