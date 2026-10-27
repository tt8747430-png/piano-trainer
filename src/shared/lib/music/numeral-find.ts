import { qualityIntervals, type Chord, type ChordQuality } from './chord'
import type { Key } from './key'
import { readInKey } from './key-of-chords'
import { numeralOf, numeralText, type Numeral } from './numerals'
import { pitchClass } from './pitch'

// A line of numerals found in a line of chords (ADR 0112): each chord read in its key every way a
// progression may hear it, then the numerals matched in order, a chord held over several.

/** Where a line of numerals is found: its first chord's index and the index of its last's arrival. */
export interface FoundSpan {
  readonly first: number
  readonly last: number
}

/** The 3rd a chord has: the semitones of its 3rd above the root, or none (a sus chord's). */
const thirdOf = (quality: ChordQuality): number | undefined =>
  qualityIntervals(quality).find((each) => each.steps === 2)?.semitones

/** A chord's tones as pitch classes above its root. */
const tonesOf = (quality: ChordQuality): Set<number> =>
  new Set(qualityIntervals(quality).map((each) => pitchClass(each.semitones)))

/**
 * Whether a chord of `heard`'s quality holds every tone of `wanted`'s: a sus chord's 4th or 2nd
 * standing for the 3rd it leaves out, so Gsus4 is a G where the line writes V.
 */
function holds(heard: ChordQuality, wanted: ChordQuality): boolean {
  const tones = tonesOf(heard)
  const third = thirdOf(wanted)
  if (thirdOf(heard) === undefined && third !== undefined) tones.add(third)
  return [...tonesOf(wanted)].every((tone) => tones.has(tone))
}

const sameApplied = (a: Numeral['of'], b: Numeral['of']): boolean =>
  a === b ||
  (a !== undefined &&
    b !== undefined &&
    a.degree === b.degree &&
    a.shift === b.shift &&
    a.minor === b.minor)

/**
 * Whether a chord heard as `heard` stands for a progression's `wanted`: on the same degree, applied to
 * the same chord if either is, and holding every tone `wanted` writes. A plain triad is any chord of
 * it, its 7th, 6th, 9th or sus added (V7 and Vsus4 are V); a chord written out asks for what it
 * writes (I7 is no I, nor IMaj7). Its bass is never asked: C/E is I.
 */
export const standsFor = (heard: Numeral, wanted: Numeral): boolean =>
  heard.degree === wanted.degree &&
  heard.shift === wanted.shift &&
  sameApplied(heard.of, wanted.of) &&
  holds(heard.quality, wanted.quality)

/**
 * A line of chords in one key read every way a progression may hear each: its numeral there, an
 * applied dominant by the chord it leads to (`readInKey`), and that dominant as its own degree too, so
 * Amazing Grace's G7 before C is V7/IV and still the I it colours.
 */
export function numeralReadings(chords: readonly Chord[], key: Key): Numeral[][] {
  return readInKey(chords, key).map(({ chord, numeral }) => {
    const plain = numeral?.of ? numeralOf(chord, key) : null
    return [numeral, plain].filter((each) => each !== null)
  })
}

/** A line of numerals with each chord held over several written once: `I v v ii` is I–v–ii. */
const heldOnce = (numerals: readonly Numeral[]): Numeral[] =>
  numerals.filter(
    (numeral, i) => i === 0 || numeralText(numeral) !== numeralText(numerals[i - 1] as Numeral),
  )

/**
 * Every place a line of numerals is heard in a line of chords, in order: each numeral by one chord or
 * by several running on that each stand for it, from the first of the first numeral's to the arrival
 * of the last. A place may start where the one before arrived (a loop going round). A line of one
 * chord is no progression and is found nowhere.
 */
export function findNumerals(
  readings: readonly (readonly Numeral[])[],
  wanted: readonly Numeral[],
): FoundSpan[] {
  const line = heldOnce(wanted)
  if (line.length < 2) return []
  const heardAs = (at: number, step: number): boolean => {
    const want = line[step]
    return want !== undefined && (readings[at] ?? []).some((each) => standsFor(each, want))
  }
  // The arrival of the line's last numeral, from a chord heard as its `step`th; none where it fails.
  const arrival = (at: number, step: number): number | null => {
    if (!heardAs(at, step)) return null
    if (step === line.length - 1) return at
    let end = at
    while (heardAs(end + 1, step)) end++
    // The longest hold first, then shorter: a chord may stand for this numeral and the next.
    for (let next = end + 1; next > at; next--) {
      const found = arrival(next, step + 1)
      if (found !== null) return found
    }
    return null
  }
  const places: FoundSpan[] = []
  let from = 0
  for (let at = 0; at < readings.length; at++) {
    if (at < from || (at > from && heardAs(at - 1, 0))) continue
    const last = arrival(at, 0)
    if (last === null) continue
    places.push({ first: at, last })
    from = last
    at = last - 1
  }
  return places
}
