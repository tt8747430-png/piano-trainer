import { isBlackKey, pitchClass, type Midi } from '@/shared/lib/music'
import type { FingerName } from './fingers'

/**
 * A real piano's keys, in metres: a white key 23.5 mm wide and 15 cm long, a black key 13.7 mm wide
 * and 9.5 cm long standing 12 mm over the white keys. A key goes down 8 mm at its front edge.
 */
export const KEY = {
  width: 0.0235,
  length: 0.15,
  height: 0.02,
  blackWidth: 0.0137,
  blackLength: 0.095,
  blackHeight: 0.012,
  dip: 0.008,
} as const

/** A key pivots at its back end: pressed, it turns this far, its front edge down by the dip. */
export const KEY_TILT = Math.asin(KEY.dip / KEY.length)

/** Each pitch class's place along the white keys from its octave's C; a black key between two. */
const ALONG = [0, 0.5, 1, 1.5, 2, 3, 3.5, 4, 4.5, 5, 5.5, 6] as const

/** Middle C. */
const C4 = 60

/**
 * A key's place along the keyboard in white keys from middle C's centre: 0 for middle C, 1 for its D,
 * a black key over the gap between its white keys (as the flat keys draw it, `keyboardLayout`).
 */
export const keyPlace = (key: Midi): number =>
  Math.floor((key - C4) / 12) * 7 + (ALONG[pitchClass(key)] ?? 0)

/**
 * The world's frame: x across the keys, middle C's centre at 0; y up, a white key's top at 0; z toward
 * the player, the keys' front edge at 0 and their back end at −`KEY.length`.
 */
export const keyX = (key: Midi): number => keyPlace(key) * KEY.width

/** The top of a white key `press` of the way down (0 up, 1 down), `z` along it. */
export const whiteTop = (z: number, press: number): number =>
  -(z + KEY.length) * Math.sin(KEY_TILT * press)

/** The front edge of a black key: it stands on the white keys' back part. */
export const BLACK_FRONT = -KEY.length + KEY.blackLength

/** The top of a black key `press` of the way down, `z` along it: it tilts as a white key does. */
export const blackTop = (z: number, press: number): number =>
  KEY.blackHeight - (z + KEY.length) * Math.sin(KEY_TILT * press)

/** A key's top `press` of the way down, `z` along it. */
export const keyTop = (key: Midi, z: number, press: number): number =>
  isBlackKey(key) ? blackTop(z, press) : whiteTop(z, press)

/**
 * Where a fingertip plays a key, back from the keys' front edge with the hand at its usual depth: a
 * white key at its front part, nearer the edge for the thumb; a black key a little behind its own
 * front edge, which the thumb and the 5th reach with the hand moved in (`handIn`).
 */
export const PLAY_Z = {
  white: { thumb: -0.018, index: -0.041, middle: -0.045, ring: -0.042, pinky: -0.035 },
  black: { thumb: -0.024, index: -0.07, middle: -0.072, ring: -0.07, pinky: -0.046 },
} as const satisfies Record<'white' | 'black', Record<FingerName, number>>

/** The nearest to its front edge a black key is played. */
const BLACK_PLAY = BLACK_FRONT - 0.004

/**
 * How far into the keys the hand moves for a finger to play a black key: as a pianist's does for the
 * thumb or the 5th; not at all for the long fingers.
 */
export const handIn = (finger: FingerName): number => Math.min(0, BLACK_PLAY - PLAY_Z.black[finger])
