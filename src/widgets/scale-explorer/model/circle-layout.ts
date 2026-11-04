import { keySignature, type CircleRing, type Key } from '@/shared/lib/music'

/** How far each ring's cells sit from the centre, in percent of the circle's box: majors outside, minors inside. */
const RADIUS: Readonly<Record<CircleRing, number>> = { major: 41.5, minor: 26 }
/** Each ring's band in a 100-unit box: its inner and outer edge. */
const BAND: Readonly<Record<CircleRing, readonly [number, number]>> = {
  major: [34, 49],
  minor: [18, 34],
}

/**
 * Which part of a place's wedge: all of it, or the half of a split one (B / C♭), the anticlockwise
 * half (-1, the sharps' side) or the clockwise one (1, the flats').
 */
export type WedgePart = 0 | -1 | 1

/** A place's angle, C at the top and each fifth a twelfth of the turn clockwise, turned by `degrees`. */
const angleOf = (place: number, degrees = 0) => ((place * 30 - 90 + degrees) * Math.PI) / 180
const round = (n: number) => Math.round(n * 1000) / 1000

/** A place's cell centre on a ring, in percent of the circle's box from its top left; a half's, its half's. */
export function cellCentre(
  place: number,
  ring: CircleRing,
  part: WedgePart = 0,
): { readonly x: number; readonly y: number } {
  const angle = angleOf(place, part * 7.5)
  return {
    x: round(50 + RADIUS[ring] * Math.cos(angle)),
    y: round(50 + RADIUS[ring] * Math.sin(angle)),
  }
}

/**
 * A place's wedge of a ring as an SVG path in a 100-unit box: thirty degrees of the ring's band,
 * centred on it, or fifteen, its half.
 */
export function wedgePath(place: number, ring: CircleRing, part: WedgePart = 0): string {
  const [inner, outer] = BAND[ring]
  const from = angleOf(place, part === 1 ? 0 : -15)
  const to = angleOf(place, part === -1 ? 0 : 15)
  const at = (radius: number, angle: number) =>
    `${round(50 + radius * Math.cos(angle))} ${round(50 + radius * Math.sin(angle))}`
  return `M ${at(outer, from)} A ${outer} ${outer} 0 0 1 ${at(outer, to)} L ${at(inner, to)} A ${inner} ${inner} 0 0 0 ${at(inner, from)} Z`
}

/**
 * A key's signature as the circle writes it: its count of sharps or flats with the sign, as the
 * chords beside it print theirs ("3♯", "3♭"), nothing for none.
 */
export function signatureCount(key: Key): string {
  const count = keySignature(key)
  if (count === 0) return ''
  return count > 0 ? `${count}♯` : `${-count}♭`
}
