import { midi, type Midi } from '@/shared/lib/music'
import { KEY, keyX } from './keys'

/**
 * The camera over the keys (R36), as Flowkey films a pianist's hands: from above the player's seat,
 * looking steeply down at the keys' whole length, the hands coming in from the bottom edge. Narrow,
 * so the keys keep their shape from end to end.
 */
export const VIEW = {
  /** How steeply it looks down, from the horizontal. */
  pitch: (62 * Math.PI) / 180,
  /** The field of view, top to bottom. */
  fov: (22 * Math.PI) / 180,
  /** The top edge shows at least the keys' back end, where the fallboard stands. */
  top: { z: -KEY.length, y: 0.02 },
  /**
   * The bottom edge crosses the back of the hand short of its wrist, where the model ends, even with
   * the hand moved in for a black key (35 mm) and lifted (12 mm).
   */
  bottom: { z: 0.06, y: 0.066 },
  /**
   * The smallest a white key is drawn, in CSS pixels; past it the camera follows the hands. A phone
   * held upright shows two and a half octaves, the hands close enough to see each finger.
   */
  minKey: 22,
  /** Smaller, down to this, where it keeps in view two hands playing far apart. */
  leastKey: 14,
  /** A hand's room beside its middle finger: two keys to its 5th, the 5th's own and a little more. */
  hand: 3 * KEY.width,
  /** Room beside the music's outer keys for the hands. */
  margin: KEY.width,
} as const

/** The whole keyboard, A0 to C8; without music, the octaves either side of middle C. */
const KEYBOARD = { low: midi(21), high: midi(108) } as const
const MIDDLE = { low: midi(48), high: midi(72) } as const

/** A view's size in CSS pixels. */
export interface ViewSize {
  readonly width: number
  readonly height: number
}

/**
 * Where the camera stands: its height over the keys and its distance in front of their front edge,
 * in metres; across the keys, the music's middle, or the hands' (`follow`, within its bounds).
 */
export interface Framing {
  readonly x: number
  readonly y: number
  readonly z: number
  readonly follow: { readonly from: number; readonly to: number } | null
}

const half = Math.tan(VIEW.fov / 2)
const below = 1 / Math.tan(VIEW.pitch + VIEW.fov / 2)
const above = 1 / Math.tan(VIEW.pitch - VIEW.fov / 2)

/** The camera's distance in front of the keys' edge at height `y`, its bottom edge held. */
const zAt = (y: number) => VIEW.bottom.z + (y - VIEW.bottom.y) * below

/** How far the keys' front edge is from the camera at height `y`, along its gaze. */
const depthAt = (y: number) => y * Math.sin(VIEW.pitch) + zAt(y) * Math.cos(VIEW.pitch)

/** The height whose view reaches back to the top edge: the nearest the camera comes. */
const NEAREST =
  (VIEW.top.z - VIEW.bottom.z + VIEW.bottom.y * below - VIEW.top.y * above) / (below - above)

/** The height at which the keys' front edge is `depth` from the camera. */
const heightFor = (depth: number) =>
  (depth - (VIEW.bottom.z - VIEW.bottom.y * below) * Math.cos(VIEW.pitch)) /
  (Math.sin(VIEW.pitch) + below * Math.cos(VIEW.pitch))

/**
 * How much further the keys' back end is from the camera than their front edge, along its gaze: the
 * view is widest there, at its top edge.
 */
const BACK = -VIEW.top.z * Math.cos(VIEW.pitch) - VIEW.top.y * Math.sin(VIEW.pitch)

/** The keyboard's ends: A0's and C8's outer edges. */
const ENDS = {
  from: keyX(KEYBOARD.low) - KEY.width / 2,
  to: keyX(KEYBOARD.high) + KEY.width / 2,
} as const

/**
 * `x` moved, as far as `needed` lets it, so a view `across` wide at its top edge stays on the
 * keyboard; over its middle where the view is wider than the keyboard.
 */
function onTheKeys(x: number, across: number, needed: { from: number; to: number }): number {
  const from = ENDS.from + across / 2
  const to = ENDS.to - across / 2
  const kept = from > to ? (ENDS.from + ENDS.to) / 2 : Math.min(to, Math.max(from, x))
  return Math.min(needed.to, Math.max(needed.from, kept))
}

/** The span of keys from `low` to `high`, their outer edges and the hands' room, in metres. */
const spanOf = ({ low, high }: { readonly low: Midi; readonly high: Midi }) => ({
  from: keyX(low) - KEY.width / 2 - VIEW.margin,
  to: keyX(high) + KEY.width / 2 + VIEW.margin,
})

/**
 * The camera for a view of `size` over music from `range.low` to `range.high` (R36), the hands at
 * most `apart` (`handsApart`): as near as it comes, its top edge at the keys' back end; back as far
 * as the music's range needs, its bottom edge held across the hands; and where the range would leave
 * a white key smaller than `VIEW.minKey`, as far back as that, or further where two hands far apart
 * need it, and following the hands. Music it shows whole it stands over, moved toward the middle
 * where its view would run past the keyboard's end. Without music, middle C's octaves.
 */
export function frame(
  size: ViewSize,
  range: { low: Midi; high: Midi } | null,
  apart: number,
): Framing {
  const aspect = size.width / Math.max(1, size.height)
  const span = spanOf(range ?? MIDDLE)
  const keyboard = spanOf(KEYBOARD)
  const wide = Math.min(span.to - span.from, keyboard.to - keyboard.from)
  // The front edge `depth` away shows 2·depth·tan(fov/2)·aspect across; a white key is that much of the width.
  const fits = wide / (2 * half * aspect)
  // A white key's least size: both hands' room filling the width, between the least and the smallest.
  const hands = (size.width * KEY.width) / (apart + 2 * VIEW.hand)
  const least = Math.min(VIEW.minKey, Math.max(VIEW.leastKey, hands))
  const smallest = (KEY.width * size.height) / (2 * half * least)
  const depth = Math.max(depthAt(NEAREST), Math.min(fits, smallest))
  const y = Math.max(NEAREST, heightFor(depth))
  const shown = 2 * depthAt(y) * half * aspect
  const middle = (span.from + span.to) / 2
  if (shown >= span.to - span.from - 1e-9) {
    // The music's outer keys stay in view; the hands' room beside them gives way to the piano's end.
    const top = 2 * (depthAt(y) + BACK) * half * aspect
    const needed = {
      from: span.to - VIEW.margin - shown / 2,
      to: span.from + VIEW.margin + shown / 2,
    }
    return { x: onTheKeys(middle, top, needed), y, z: zAt(y), follow: null }
  }
  const from = span.from + shown / 2
  const to = span.to - shown / 2
  return { x: Math.min(to, Math.max(from, middle)), y, z: zAt(y), follow: { from, to } }
}

/** Where a following camera stands for hands at `x`: over them, within the music's range. */
export const followed = (framing: Framing, x: number): number =>
  framing.follow ? Math.min(framing.follow.to, Math.max(framing.follow.from, x)) : framing.x
