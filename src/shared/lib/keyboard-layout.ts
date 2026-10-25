import {
  isBlackKey,
  midi,
  MIDDLE_C,
  PIANO,
  pitchClass,
  type KeyRange,
  type Midi,
} from '@/shared/lib/music'

/** A black key sits over the gap between two white keys, 62% as wide… */
const BLACK_WIDTH = 0.62
/** …and 62% as long, in percent of the keys' height: below it, a white key's face is whole. */
export const BLACK_HEIGHT = 62

export interface KeyGeometry {
  readonly midi: Midi
  readonly black: boolean
  /** Percent of the keyboard's width. */
  readonly left: number
  readonly width: number
  /** Percent of the keyboard's height. */
  readonly height: number
}

/** Every key of the range (widened to white keys), placed in percent of the keyboard. */
export function keyboardLayout(range: KeyRange): { keys: KeyGeometry[]; whites: number } {
  let low: number = range.from
  let high: number = range.to
  while (isBlackKey(midi(low))) low--
  while (isBlackKey(midi(high))) high++
  const whiteKeys: number[] = []
  for (let key = low; key <= high; key++) if (!isBlackKey(midi(key))) whiteKeys.push(key)
  const width = 100 / whiteKeys.length
  const keys: KeyGeometry[] = []
  for (let key = low; key <= high; key++) {
    if (isBlackKey(midi(key))) {
      const left = (whiteKeys.indexOf(key - 1) + 1) * width - (width * BLACK_WIDTH) / 2
      keys.push({
        midi: midi(key),
        black: true,
        left,
        width: width * BLACK_WIDTH,
        height: BLACK_HEIGHT,
      })
    } else {
      keys.push({
        midi: midi(key),
        black: false,
        left: whiteKeys.indexOf(key) * width,
        width,
        height: 100,
      })
    }
  }
  return { keys, whites: whiteKeys.length }
}

/** A chord's diagram shows at least this many white keys: a little over an octave. */
const DIAGRAM_WHITES = 10
/** Where a group of black keys starts (C, F) and ends (E, B): a diagram's two ends. */
const GROUP_START = new Set([0, 5])
const GROUP_END = new Set([4, 11])

const whitesIn = (from: number, to: number) => {
  let whites = 0
  for (let key = from; key <= to; key++) if (!isBlackKey(midi(key))) whites++
  return whites
}
const startBelow = (key: number) => {
  let start = key
  while (!GROUP_START.has(pitchClass(start))) start--
  return start
}
const endAbove = (key: number) => {
  let end = key
  while (!GROUP_END.has(pitchClass(end))) end++
  return end
}

/**
 * The keys a chord's diagram spans (ADR 0099): from the C or F at or below its lowest key to the E
 * or B at or above its highest, whole groups of black keys, grown a group at a time on the side with
 * less room until it shows ten white keys, so the chord sits with room round it. No keys: round
 * middle C.
 */
export function diagramRange(keys: readonly Midi[]): KeyRange {
  const lowest = keys.length > 0 ? Math.min(...keys) : MIDDLE_C
  const highest = keys.length > 0 ? Math.max(...keys) : MIDDLE_C
  let from = startBelow(lowest)
  let to = endAbove(highest)
  while (whitesIn(from, to) < DIAGRAM_WHITES) {
    if (whitesIn(from, lowest - 1) < whitesIn(highest + 1, to)) from = startBelow(from - 1)
    else to = endAbove(to + 1)
  }
  return { from: midi(from), to: midi(to) }
}

/** Where a stretch of keys sits on a laid-out keyboard. */
export interface KeySpan {
  /** Percent of the keyboard's width. */
  readonly left: number
  readonly right: number
  /** The white keys in it. */
  readonly whites: number
}

/** Where a range sits on a laid-out keyboard. */
export function spanOf(keys: readonly KeyGeometry[], range: KeyRange): KeySpan {
  const inRange = keys.filter((key) => key.midi >= range.from && key.midi <= range.to)
  return {
    left: Math.min(...inRange.map((key) => key.left)),
    right: Math.max(...inRange.map((key) => key.left + key.width)),
    whites: inRange.filter((key) => !key.black).length,
  }
}

/** The whole piano laid out once: every keyboard holds all of it and scrolls. */
export const PIANO_LAYOUT = keyboardLayout(PIANO)

/**
 * The key under a point given in fractions (0–1) of the keyboard's width and height: a black key
 * where it covers a white one; nothing outside the keyboard.
 */
export function keyAt(keys: readonly KeyGeometry[], x: number, y: number): Midi | null {
  if (!(x >= 0 && x < 1 && y >= 0 && y < 1)) return null
  const left = x * 100
  const top = y * 100
  const under = (key: KeyGeometry) => left >= key.left && left < key.left + key.width
  const black = keys.find((key) => key.black && top < key.height && under(key))
  return (black ?? keys.find((key) => !key.black && under(key)))?.midi ?? null
}
