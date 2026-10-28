import type { Finger, Hand } from './fingering'
import { chordInversions, placeChord, TWO_HANDS_FROM, type PlacedChord } from './place'
import type { Midi } from './pitch'
import type { Tone } from './tone'

/** A chord's fingering in both hands, each hand's fingers from its lowest key up. */
export type ChordFingers = Readonly<Record<Hand, readonly Finger[]>>

/** A 4th or wider: the gap the hand opens between its 5th finger and a 2nd finger. */
const FOURTH = 5
/** A 2nd: two keys under neighbouring fingers. */
const SECOND = 2

/** Two keys spread by their distance: a 2nd 1-2, a 3rd 1-3, a 4th or tritone 1-4, a 5th or wider 1-5. */
function pairFinger(gap: number): Finger {
  if (gap <= SECOND) return 2
  if (gap <= 4) return 3
  if (gap <= 6) return 4
  return 5
}

/**
 * The right hand's fingers over keys from its thumb up, by the gaps between them (`gaps[0]` the
 * lowest). Three keys: 1 and 5 outside, the middle key 2 where a 4th or more opens to the 5th finger
 * (the books' 1-2-5 for a first inversion), else 3; within a 4th, 1-2-3. Four keys: 1-2-3-5, the 4th
 * finger taking a 2nd at the top (1-2-4-5) and 3-4-5 two 2nds together there. Five: every finger.
 */
function fromThumb(gaps: readonly number[]): Finger[] {
  const [first = 0, second = 0, third = 0] = gaps
  switch (gaps.length) {
    case 0:
      return [1]
    case 1:
      return [1, pairFinger(first)]
    case 2:
      if (first + second < FOURTH) return [1, 2, 3]
      return [1, second >= FOURTH ? 2 : 3, 5]
    case 3:
      if (third <= SECOND && second <= SECOND) return [1, 3, 4, 5]
      return third <= SECOND ? [1, 2, 4, 5] : [1, 2, 3, 5]
    default:
      return [1, 2, 3, 4, 5]
  }
}

/**
 * A hand's fingers over the keys it holds together, from the lowest key up. The left hand mirrors
 * the right, its 5th finger on the lowest key: the shape is read from its thumb's end, so the left
 * hand's 2 sits beside a 4th at the bottom (the books' 5-2-1 for a second inversion). A lone key is
 * the right thumb's or the left 5th finger's, a bass under the chord.
 */
export function handFingers(keys: readonly Midi[], hand: Hand): Finger[] {
  const sorted = [...keys].sort((a, b) => a - b)
  if (sorted.length === 0) return []
  const gaps = sorted.slice(1).map((key, i) => key - (sorted[i] ?? key))
  if (hand === 'rh') return fromThumb(gaps)
  if (sorted.length === 1) return [5]
  return fromThumb(gaps.toReversed()).toReversed()
}

/**
 * A chord's block fingering, inversion by inversion as the Chords explorer offers them. Up to four
 * notes each hand holds the whole chord, so each row gives both hands' fingers over the same
 * stack. From five notes the hands share it (ADR 0046): each row the fingers of what each hand holds.
 */
export function blockFingering(tones: readonly Tone[]): ChordFingers[] {
  const bothHands = tones.length >= TWO_HANDS_FROM
  return chordInversions(tones).map((inversion) => {
    const placed = placeChord(tones, { inversion, bothHands })
    if (bothHands) {
      return {
        lh: handFingers(
          placed.lh.map((key) => key.midi),
          'lh',
        ),
        rh: handFingers(
          placed.rh.map((key) => key.midi),
          'rh',
        ),
      }
    }
    const keys = placed.rh.map((key) => key.midi)
    return { rh: handFingers(keys, 'rh'), lh: handFingers(keys, 'lh') }
  })
}

/** Within an octave of the right hand, a lone left-hand key is the thumb's: a voice, not a bass. */
const OCTAVE = 12

/**
 * The fingers of keys as they are placed, each hand's from its lowest key up. A lone left-hand key
 * an octave or more under the right hand is a bass, the 5th finger's; nearer, it is a voice of the
 * chord (drop 2's dropped note, locked hands' doubled melody), the thumb's.
 */
export function placedFingering(placed: PlacedChord): ChordFingers {
  const [lone, ...more] = placed.lh
  const [lowest] = placed.rh
  const voice = lone && more.length === 0 && lowest && lowest.midi - lone.midi < OCTAVE
  return {
    lh: voice
      ? [1]
      : handFingers(
          placed.lh.map((key) => key.midi),
          'lh',
        ),
    rh: handFingers(
      placed.rh.map((key) => key.midi),
      'rh',
    ),
  }
}
