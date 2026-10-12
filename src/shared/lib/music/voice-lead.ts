import { spellChord, type Chord } from './chord'
import { closeFrom } from './place'
import { pitchClassOf } from './note'
import { midi, type Midi } from './pitch'

/**
 * The bass plays each chord's lowest note between C3 and B3, an octave lower where the hand reaches
 * down to it.
 */
const BASS_FROM = 48

/** A chord of this many notes leaves its root to the bass. */
const ROOTLESS_FROM = 5

/**
 * Where the hand sits: its lowest key no lower than G3 (a close 3rd below it turns muddy) nor higher
 * than C5, its top no higher than G5, and its middle drawn towards E4.
 */
const HAND = { lowest: 55, highestStart: 72, top: 79, home: 64 } as const

/** How much each fault weighs against a semitone of a voice's movement. */
const WEIGHT = {
  /** The top voice is the one heard as a line: its leaps count again. */
  top: 0.5,
  /** Each semitone the hand's middle strays from home: what keeps a long row from drifting. */
  home: 0.25,
  /** Parallel 5ths or octaves between the bass and the top voice. */
  parallels: 4,
} as const

const middle = (keys: readonly number[]): number =>
  keys.reduce((sum, key) => sum + key, 0) / Math.max(keys.length, 1)

/** How far each voice of one hand moves to the nearest of the other's, both ways, halved. */
function movement(before: readonly number[], after: readonly number[]): number {
  const nearest = (key: number, others: readonly number[]) =>
    Math.min(...others.map((other) => Math.abs(other - key)))
  const there = after.reduce((sum, key) => sum + nearest(key, before), 0)
  const back = before.reduce((sum, key) => sum + nearest(key, after), 0)
  return (there + back) / 2
}

/** A perfect 5th or octave (or unison) between two keys, as an interval class. */
const perfect = (low: number, high: number): number | null => {
  const interval = (((high - low) % 12) + 12) % 12
  return interval === 0 || interval === 7 ? interval : null
}

interface Voicing {
  readonly bass: number
  readonly hand: readonly number[]
}

/**
 * What a voicing costs after the one before: its voices' movement (a common tone held costs
 * nothing), the top voice's leap again, its distance from home, and parallel 5ths or octaves with
 * the bass. The first chord costs only its distance from home.
 */
function cost(voicing: Voicing, before: Voicing | null): number {
  const home = WEIGHT.home * Math.abs(middle(voicing.hand) - HAND.home)
  if (!before) return home
  const top = Math.max(...voicing.hand)
  const topBefore = Math.max(...before.hand)
  const outer = perfect(voicing.bass, top)
  const parallels =
    outer !== null &&
    outer === perfect(before.bass, topBefore) &&
    voicing.bass !== before.bass &&
    top !== topBefore
  return (
    movement(before.hand, voicing.hand) +
    WEIGHT.top * Math.abs(top - topBefore) +
    home +
    (parallels ? WEIGHT.parallels : 0)
  )
}

/** Every close position of the hand's tones the hand may take: each tone lowest, in each octave. */
function handsFor(chord: Chord): { hands: number[][]; rootPosition: number[][] } {
  const tones = spellChord(chord.root, chord.quality)
  const held = tones.length >= ROOTLESS_FROM && !chord.bass ? tones.slice(1) : tones
  const hands: number[][] = []
  const rootPosition: number[][] = []
  for (const start of held) {
    for (let base = HAND.lowest; base <= HAND.highestStart; base++) {
      if (base % 12 !== start.pitchClass) continue
      // A bigger chord stays inside an octave: a 13th's 3rd, 5th, 13th, 7th and 9th, not a stack an
      // 11th wide.
      const hand = closeFrom(held, start, midi(base)).map((placed) => placed.midi)
      if (Math.max(...hand) > HAND.top) continue
      hands.push(hand)
      if (start === tones[0]) rootPosition.push(hand)
    }
  }
  return { hands, rootPosition }
}

/** The bass under a hand: the root, or the bass a slash chord writes, from C3, an octave down below the hand. */
function bassUnder(chord: Chord, hand: readonly number[]): number {
  const pc = chord.bass ? pitchClassOf(chord.bass) : pitchClassOf(chord.root)
  const bass = BASS_FROM + pc
  return bass < Math.min(...hand) ? bass : bass - 12
}

/**
 * A row of chords as a hand plays it smoothly, by the rules of keyboard voice leading: each chord
 * over its root in the bass (or the bass a slash chord writes), the right hand in the close position
 * that holds the tones the chords share and moves the others least, its top voice above all, kept
 * between G3 and G5 around E4, with no parallel 5ths or octaves against the bass. The first chord is
 * in root position nearest E4. A chord of five notes or more leaves its root to the bass (a 9th
 * chord's hand is its 3rd, 5th, 7th and 9th).
 */
export function voiceLead(chords: readonly Chord[]): Midi[][] {
  let before: Voicing | null = null
  return chords.map((chord) => {
    const { hands, rootPosition } = handsFor(chord)
    const choices = before === null && rootPosition.length > 0 ? rootPosition : hands
    let best: Voicing | null = null
    let lowest = Infinity
    for (const hand of choices) {
      const voicing = { bass: bassUnder(chord, hand), hand }
      const each = cost(voicing, before)
      if (each < lowest) {
        lowest = each
        best = voicing
      }
    }
    if (!best) throw new RangeError(`No hand plays ${chord.root.letter} ${chord.quality}`)
    before = best
    return [midi(best.bass), ...best.hand.map(midi)]
  })
}
