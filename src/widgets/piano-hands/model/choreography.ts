import type { PerformanceNote } from '@/shared/lib/arrangement'
import {
  FINGERS,
  fingerPart,
  isBlackKey,
  type Finger,
  type Midi,
  type Tick,
} from '@/shared/lib/music'
import { fingerName, restingPlace, type Side } from './fingers'
import { handIn, KEY, keyX } from './keys'
import type { FingerAim } from './poses'

/** A note at the keys: its key, the finger that plays it, and when, in ticks. */
export interface FingeredNote {
  readonly key: Midi
  readonly finger: Finger
  readonly start: Tick
  readonly end: Tick
}

/**
 * Where a hand stands for an onset: `x` across the keys (where its middle finger rests, in metres
 * from middle C), and `depth` into the keys (0 or less: moved in for a short finger's black key).
 */
export interface HandPlace {
  readonly tick: Tick
  readonly x: number
  readonly depth: number
}

/** A hand's part at the keys: its notes, its place for each onset, and each finger's notes. */
export interface HandPart {
  readonly side: Side
  readonly notes: readonly FingeredNote[]
  readonly places: readonly HandPlace[]
  /** Thumb first, each finger's notes by their start. */
  readonly fingers: readonly { readonly finger: Finger; readonly notes: readonly FingeredNote[] }[]
}

/** Both hands' parts; a hand the music gives nothing to play has none. */
export interface Choreography {
  readonly rh: HandPart | null
  readonly lh: HandPart | null
}

/**
 * How far each finger reaches from where it rests, in white keys, toward the hand's thumb (−) and
 * away from it (+): the thumb passes far under the hand but opens little outward; the 5th opens
 * out further than it closes in. Beyond it the model hand cannot place its pad on the key.
 */
const REACH: Readonly<Record<Finger, readonly [number, number]>> = {
  1: [-0.4, 2.5],
  2: [-1.5, 1.5],
  3: [-1.5, 1.5],
  4: [-1.5, 1.5],
  5: [-1.75, 1.25],
}

/**
 * The hand's place for the keys it holds together: each finger as near where it rests as the
 * others let it (the middle of the places they allow), within its reach; where they cannot all be
 * reached, the place that leaves the farthest one as near as it can.
 */
export function handPlace(side: Side, held: readonly { key: Midi; finger: Finger }[]): number {
  const sign = side === 'rh' ? 1 : -1
  let low = -Infinity
  let high = Infinity
  let sum = 0
  for (const { key, finger } of held) {
    // The hand at x puts `finger` over x + its resting place; it reaches `key` from x within its reach.
    const at = keyX(key) - restingPlace(side, finger) * KEY.width
    const [toThumb, away] = REACH[finger]
    const reaches = [at - sign * toThumb * KEY.width, at - sign * away * KEY.width]
    low = Math.max(low, Math.min(...reaches))
    high = Math.min(high, Math.max(...reaches))
    sum += at
  }
  if (held.length === 0) return 0
  const centre = sum / held.length
  return low <= high ? Math.min(high, Math.max(low, centre)) : (low + high) / 2
}

/** How far in the hand moves for the keys it holds: as far as its shortest finger on a black key needs. */
const depthFor = (held: readonly { key: Midi; finger: Finger }[]) =>
  Math.min(
    0,
    ...held.filter(({ key }) => isBlackKey(key)).map(({ finger }) => handIn(fingerName(finger))),
  )

/** The notes of `notes` sounding at `tick`: started, not yet ended. */
const soundingAt = (notes: readonly FingeredNote[], tick: Tick) =>
  notes.filter((note) => note.start <= tick && note.end > tick)

function partOf(side: Side, notes: readonly PerformanceNote[]): HandPart | null {
  const played = notes
    .filter((note) => note.hand === side && !note.silent)
    .toSorted((a, b) => a.startTick - b.startTick || a.midi - b.midi)
  if (played.length === 0) return null
  const fingers = fingerPart(
    played.map((note) => ({
      key: note.midi,
      start: note.startTick,
      end: note.startTick + note.durationTicks,
      finger: note.finger,
    })),
    side,
  )
  const fingered: FingeredNote[] = played.map((note, i) => ({
    key: note.midi,
    finger: fingers[i] ?? 3,
    start: note.startTick,
    end: note.startTick + note.durationTicks,
  }))
  const ticks = [...new Set(fingered.map((note) => note.start))]
  const places = ticks.map((tick): HandPlace => {
    const held = soundingAt(fingered, tick)
    return { tick, x: handPlace(side, held), depth: depthFor(held) }
  })
  return {
    side,
    notes: fingered,
    places,
    fingers: FINGERS.map((finger) => ({
      finger,
      notes: fingered.filter((note) => note.finger === finger),
    })),
  }
}

/**
 * The hands at the keys for a Performance (R36): each hand's notes as its fingers play them, the
 * fingers the music writes and the rest suggested (`fingerPart`), and where the hand stands for each
 * onset. A staff's notes (a tune over the piano) and notes not heard are played by neither hand.
 */
export function choreograph(notes: readonly PerformanceNote[]): Choreography {
  return { rh: partOf('rh', notes), lh: partOf('lh', notes) }
}

/** A hand at a moment: its place and lift, and each finger's aim, thumb first. */
export interface HandPose {
  readonly x: number
  readonly depth: number
  /** How high the hand is lifted off the keys as it travels, in metres. */
  readonly lift: number
  readonly fingers: readonly FingerAim[]
  /** The keys its fingers hold down now, and how far down (0–1). */
  readonly keys: ReadonlyMap<Midi, number>
}

/**
 * The motion's times, in seconds: a finger goes down in 50 ms and up in 70; the hand moves to its
 * next place in the 160 ms before it plays there, a finger turns to its next key in the 220 ms before
 * it plays it, and back to rest in the 150 ms after. A hand travelling with no key held lifts, up to
 * 12 mm.
 */
export const MOTION = {
  attack: 0.05,
  release: 0.07,
  glide: 0.16,
  approach: 0.22,
  relax: 0.15,
  lift: 0.012,
} as const

/** Ease in and out over 0–1. */
const smooth = (u: number) => {
  const t = Math.min(1, Math.max(0, u))
  return t * t * (3 - 2 * t)
}

/** The last index of a sorted list whose `at` is at or before `tick`, or −1. */
function lastAtOrBefore<T>(list: readonly T[], at: (item: T) => number, tick: number): number {
  let low = 0
  let high = list.length - 1
  let found = -1
  while (low <= high) {
    const mid = (low + high) >> 1
    const item = list[mid]
    if (item !== undefined && at(item) <= tick) {
      found = mid
      low = mid + 1
    } else high = mid - 1
  }
  return found
}

/** The hand's place and lift at `tick`: still at an onset's place, then gliding to the next one's. */
function placeAt(part: HandPart, tick: number, perSecond: number) {
  const { places } = part
  const i = lastAtOrBefore(places, (place) => place.tick, tick)
  const here = places[Math.max(0, i)]
  const next = places[i + 1]
  if (!here) return { x: 0, depth: 0, lift: 0 }
  if (i < 0 || !next) return { x: here.x, depth: here.depth, lift: 0 }
  const window = Math.min(MOTION.glide * perSecond, (next.tick - here.tick) * 0.5)
  const u = smooth((tick - (next.tick - window)) / window)
  if (u <= 0) return { x: here.x, depth: here.depth, lift: 0 }
  const free = soundingAt(part.notes, tick).length === 0
  const travel = Math.abs(next.x - here.x)
  return {
    x: here.x + (next.x - here.x) * u,
    depth: here.depth + (next.depth - here.depth) * u,
    lift: free ? Math.min(MOTION.lift, travel * 0.3) * Math.sin(Math.PI * u) : 0,
  }
}

/**
 * A hand at `tick` (R36): where it stands and how high, each finger's aim and the keys it holds down.
 * A finger playing presses its key from its start and lets it up by its end; one about to play turns
 * to its key first; the others hover where they rest. `perSecond`: the music's ticks a second.
 */
export function handPose(part: HandPart, tick: number, perSecond: number): HandPose {
  const { x, depth, lift } = placeAt(part, tick, perSecond)
  const keys = new Map<Midi, number>()
  const fingers = part.fingers.map(({ finger, notes }): FingerAim => {
    const resting = x + restingPlace(part.side, finger) * KEY.width
    const toward = (key: Midi) => ({ dx: keyX(key) - resting, black: isBlackKey(key) ? 1 : 0 })
    const i = lastAtOrBefore(notes, (note) => note.start, tick)
    const now = notes[i]
    if (now && tick < now.end) {
      const length = now.end - now.start
      const attack = Math.min(MOTION.attack * perSecond, length * 0.5)
      const release = Math.min(MOTION.release * perSecond, length * 0.4)
      const press = Math.min(1, (tick - now.start) / attack, (now.end - tick) / release)
      keys.set(now.key, Math.max(keys.get(now.key) ?? 0, press))
      return { ...toward(now.key), press }
    }
    // Hovering: from the key it last played back to rest, then on to the key it plays next.
    const rest = { dx: 0, black: 0 }
    const after = now ? smooth((tick - now.end) / (MOTION.relax * perSecond)) : 1
    const from = now && after < 1 ? mix(toward(now.key), rest, after) : rest
    const next = notes[i + 1]
    const before = next ? smooth(1 - (next.start - tick) / (MOTION.approach * perSecond)) : 0
    return { ...(next && before > 0 ? mix(from, toward(next.key), before) : from), press: 0 }
  })
  return { x, depth, lift, fingers, keys }
}

const mix = (
  a: { dx: number; black: number },
  b: { dx: number; black: number },
  share: number,
) => ({ dx: a.dx + (b.dx - a.dx) * share, black: a.black + (b.black - a.black) * share })
