import { handFingers } from './chord-fingering'
import type { Finger, Hand } from './fingering'
import { isBlackKey } from './keyboard'
import type { Midi } from './pitch'

/**
 * How far apart two fingers of the right hand reach, in semitones, from the lower finger's key to
 * the higher's (Parncutt, Sloboda, Clarke, Raekallio and Desain's table, 1997): the practical least,
 * the comfortable least, the relaxed least and most, the comfortable most, the practical most. A
 * negative reach is the higher finger crossing under or over the lower (the thumb under the 3rd).
 */
const REACH: Readonly<Record<string, readonly [number, number, number, number, number, number]>> = {
  '1-2': [-5, -3, 1, 5, 8, 10],
  '1-3': [-4, -2, 3, 7, 10, 12],
  '1-4': [-3, -1, 5, 9, 12, 14],
  '1-5': [-1, 1, 7, 10, 13, 15],
  '2-3': [1, 1, 1, 2, 3, 5],
  '2-4': [1, 1, 3, 4, 5, 7],
  '2-5': [2, 2, 5, 6, 8, 10],
  '3-4': [1, 1, 1, 2, 2, 4],
  '3-5': [1, 1, 3, 4, 5, 7],
  '4-5': [1, 1, 1, 2, 3, 5],
}

const FINGERS: readonly Finger[] = [1, 2, 3, 4, 5]

/** What the hand cannot do: a stretch past its reach, a finger on two keys at once. */
const OUT_OF_REACH = 40

/**
 * What it costs to play `to` with finger `b` after `from` with finger `a`, in the right hand: or to
 * hold the two together.
 */
function step(from: number, a: Finger, to: number, b: Finger): number {
  const d = to - from
  if (d === 0) return a === b ? 0 : 2
  if (a === b) return 12
  const [low, high, reach] = a < b ? [a, b, d] : [b, a, -d]
  const [minPrac, minComf, minRel, maxRel, maxComf, maxPrac] = REACH[`${low}-${high}`] ?? [
    0, 0, 0, 0, 0, 0,
  ]
  // A crossing without the thumb (3 over 4) is not played.
  if (reach < 0 && low !== 1) return OUT_OF_REACH
  if (reach < minPrac || reach > maxPrac) return OUT_OF_REACH
  let cost = 0
  if (reach > maxComf) cost += 2 * (reach - maxComf)
  if (reach < minComf) cost += 2 * (minComf - reach)
  if (reach > maxRel) cost += reach - maxRel
  if (reach < minRel) cost += minRel - reach
  return cost
}

/** What a finger costs on its own key: the thumb, and less so the 5th, prefer a white key. */
const place = (key: Midi, finger: Finger) =>
  isBlackKey(key) ? (finger === 1 ? 3 : finger === 5 ? 1 : 0) : 0

/** A note a hand plays: its key, when it sounds (any unit of time), and the finger written for it. */
export interface PartNote {
  readonly key: Midi
  readonly start: number
  readonly end: number
  readonly finger?: Finger | undefined
}

/** One way to play an onset: a finger for each of its notes, and what the shape costs on its own. */
interface Shape {
  readonly fingers: readonly Finger[]
  readonly cost: number
}

/**
 * The ways to play an onset's keys (lowest first), the written fingers kept: a lone key with any
 * finger; two keys with any two fingers in order, at what the stretch costs; more with the books'
 * chord fingering (`handFingers`). `seen` are its keys as the right hand reads them.
 */
function shapesOf(notes: readonly PartNote[], seen: readonly number[], hand: Hand): Shape[] {
  const written = notes.map((note) => note.finger)
  if (written.every((finger) => finger !== undefined)) return [{ fingers: written, cost: 0 }]
  const [only] = notes
  if (notes.length === 1 && only)
    return FINGERS.map((finger) => ({ fingers: [finger], cost: place(only.key, finger) }))
  const [one, two] = seen
  if (notes.length === 2 && one !== undefined && two !== undefined) {
    const shapes: Shape[] = []
    for (const a of FINGERS)
      for (const b of FINGERS) {
        // The right hand reads up from its lower key, the left from its higher.
        const [low, high] = one < two ? [a, b] : [b, a]
        const fingers = [low, high]
        if (
          low >= high ||
          written.some((finger, i) => finger !== undefined && finger !== fingers[i])
        )
          continue
        const cost =
          step(Math.min(one, two), low, Math.max(one, two), high) +
          notes.reduce((sum, note, i) => sum + place(note.key, fingers[i] ?? 1), 0)
        if (cost < OUT_OF_REACH) shapes.push({ fingers, cost })
      }
    if (shapes.length > 0) return shapes
  }
  // The books' fingering for a chord, from the thumb's end; past five keys the outer finger takes
  // the rest.
  const books = handFingers(
    notes.map((note) => note.key),
    hand,
  )
  const outer: Finger = hand === 'rh' ? 5 : 1
  return [
    {
      fingers: notes.map((_, i) => written[i] ?? books[i] ?? outer),
      cost: 0,
    },
  ]
}

/** The keys of two onsets nearest each other: the voice that leads from one to the next. */
function nearest(
  from: readonly number[],
  to: readonly number[],
): { readonly i: number; readonly j: number } {
  let best = { i: 0, j: 0, d: Infinity }
  from.forEach((a, i) =>
    to.forEach((b, j) => {
      const d = Math.abs(b - a)
      if (d < best.d) best = { i, j, d }
    }),
  )
  return best
}

interface Onset {
  readonly notes: readonly PartNote[]
  /** Each note's place in the part as given. */
  readonly at: readonly number[]
  /** Its keys as the right hand reads them: the left hand's turned over. */
  readonly seen: readonly number[]
  readonly start: number
  readonly shapes: readonly Shape[]
}

/**
 * A hand's part fingered (R36, the hands at the keys; A30, Suggest fingering): each note's finger,
 * in the order given. A finger the music writes is kept; the rest are the fingers that play the
 * part at the least cost of stretch, crossing and a thumb on a black key, found over the whole part
 * at once (a Viterbi search, as Parncutt's model): a line note by note, two keys together as the
 * hand best spans them, a chord as the books finger it, and never a finger already holding another
 * key. The left hand is the right one mirrored: its keys read downward.
 */
export function fingerPart(notes: readonly PartNote[], hand: Hand): Finger[] {
  const read = (key: number) => (hand === 'rh' ? key : -key)
  const byStart = new Map<number, number[]>()
  notes.forEach((note, i) => byStart.set(note.start, [...(byStart.get(note.start) ?? []), i]))
  const onsets: Onset[] = [...byStart]
    .sort(([a], [b]) => a - b)
    .map(([start, at]) => {
      const sorted = at.toSorted((a, b) => (notes[a]?.key ?? 0) - (notes[b]?.key ?? 0))
      const group = sorted.flatMap((i) => notes[i] ?? [])
      const seen = group.map((note) => read(note.key))
      return { notes: group, at: sorted, seen, start, shapes: shapesOf(group, seen, hand) }
    })
  const [first] = onsets
  if (!first) return []
  type Path = { readonly cost: number; readonly shapes: readonly Shape[] }
  let paths: Path[] = first.shapes.map((shape) => ({
    // A lone first note leans to the middle finger, so the hand has room both ways.
    cost: shape.cost + (shape.fingers.length === 1 && shape.fingers[0] === 3 ? -0.5 : 0),
    shapes: [shape],
  }))
  for (let o = 1; o < onsets.length; o += 1) {
    const before = onsets[o - 1]
    const now = onsets[o]
    if (!before || !now) break
    const lead = nearest(before.seen, now.seen)
    paths = now.shapes.map((shape) => {
      let chosen: Path | null = null
      for (const path of paths) {
        const last = path.shapes.at(-1)
        const a = last?.fingers[lead.i] ?? 1
        const b = shape.fingers[lead.j] ?? 1
        const cost =
          path.cost +
          step(before.seen[lead.i] ?? 0, a, now.seen[lead.j] ?? 0, b) +
          shape.cost +
          held(onsets, path.shapes, o, shape)
        if (chosen === null || cost < chosen.cost)
          chosen = { cost, shapes: [...path.shapes, shape] }
      }
      return chosen ?? { cost: Infinity, shapes: [] }
    })
  }
  const best = paths.reduce((chosen, path) => (path.cost < chosen.cost ? path : chosen))
  const fingers: Finger[] = notes.map(() => 1)
  onsets.forEach((onset, o) =>
    onset.at.forEach((i, n) => {
      fingers[i] = best.shapes[o]?.fingers[n] ?? 1
    }),
  )
  return fingers
}

/** A finger of `shape` already holding a key of an earlier onset that still sounds: not played. */
function held(onsets: readonly Onset[], shapes: readonly Shape[], o: number, shape: Shape): number {
  const now = onsets[o]
  if (!now) return 0
  for (let earlier = 0; earlier < o; earlier += 1) {
    const onset = onsets[earlier]
    const fingers = shapes[earlier]?.fingers
    if (!onset || !fingers) continue
    for (const [n, note] of onset.notes.entries())
      if (note.end > now.start) {
        const finger = fingers[n]
        const on = shape.fingers.indexOf(finger ?? 1)
        if (on >= 0 && now.notes[on]?.key !== note.key) return OUT_OF_REACH
      }
  }
  return 0
}
