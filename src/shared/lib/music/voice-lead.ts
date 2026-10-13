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

/** Root position and at most the first three inversions, as the Player offers. */
const MOST_INVERSIONS = 3

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

/** The tones a chord adds above its 7th. */
const TENSIONS = new Set(['9th', '11th', '13th'])

/** A hand the chord may take, and which of its inversions it is. */
interface Hand {
  readonly keys: number[]
  /** The place of its lowest tone in the hand's order: 0 is root position. */
  readonly inversion: number
}

/**
 * Every close position of the hand's tones the hand may take: each tone lowest, in each octave. A
 * rootless hand's order puts its first tension where the root was, as the Player's inversions do.
 */
function handsFor(chord: Chord): { hands: Hand[]; rootPosition: Hand[] } {
  const tones = spellChord(chord.root, chord.quality)
  const rootless = tones.length >= ROOTLESS_FROM && !chord.bass
  const held = rootless ? tones.slice(1) : tones
  const tension = rootless ? held.find((tone) => TENSIONS.has(tone.role)) : undefined
  const order = tension ? [tension, ...held.filter((tone) => tone !== tension)] : held
  const hands: Hand[] = []
  const rootPosition: Hand[] = []
  order.forEach((start, inversion) => {
    for (let base = HAND.lowest; base <= HAND.highestStart; base++) {
      if (base % 12 !== start.pitchClass) continue
      // A bigger chord stays inside an octave: a 13th's 3rd, 5th, 13th, 7th and 9th, not a stack an
      // 11th wide.
      const keys = closeFrom(held, start, midi(base)).map((placed) => placed.midi)
      if (Math.max(...keys) > HAND.top) continue
      hands.push({ keys, inversion })
      if (start === tones[0]) rootPosition.push({ keys, inversion })
    }
  })
  return { hands, rootPosition }
}

/**
 * Where a row's hand stands: its first chord in `inversion` (a smaller chord in its last), then each
 * chord nearest the last or, without `nearest`, in that inversion too.
 */
export interface RowPosition {
  readonly inversion: number
  readonly nearest: boolean
}

/** The hands a chord of the row may take: those in the inversion the position keeps, where it keeps one. */
function choicesFor(chord: Chord, first: boolean, position: RowPosition | undefined): Hand[] {
  const { hands, rootPosition } = handsFor(chord)
  if (!position) return first && rootPosition.length > 0 ? rootPosition : hands
  if (!first && position.nearest) return hands
  const last = Math.max(...hands.map((hand) => hand.inversion))
  const kept = Math.min(position.inversion, last, MOST_INVERSIONS)
  const inKept = hands.filter((hand) => hand.inversion === kept)
  return inKept.length > 0 ? inKept : hands
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
 * in root position nearest E4, or in the `position` asked. A chord of five notes or more leaves its root
 * to the bass (a 9th chord's hand is its 3rd, 5th, 7th and 9th).
 */
export function voiceLead(chords: readonly Chord[], position?: RowPosition): Midi[][] {
  let before: Voicing | null = null
  return chords.map((chord) => {
    const choices = choicesFor(chord, before === null, position)
    let best: Voicing | null = null
    let lowest = Infinity
    for (const { keys: hand } of choices) {
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
