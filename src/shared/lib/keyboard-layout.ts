import { isBlackKey, midi, type KeyRange, type Midi } from '@/shared/lib/music'

/** A black key sits over the gap between two white keys, 62% as wide and 62% as long. */
const BLACK_WIDTH = 0.62
const BLACK_HEIGHT = 62

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
