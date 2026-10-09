import { spellChord, type Chord } from './chord'
import { MIDDLE_C } from './keyboard'
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

const middle = (keys: readonly Midi[]): number =>
  keys.reduce((sum, key) => sum + key, 0) / Math.max(keys.length, 1)

/**
 * A row of chords as a hand plays it smoothly: each chord over its root in the bass, or over the bass
 * a slash chord writes (`C/G`), the right hand held close from one of its tones (in its own octave or
 * an octave down), the one whose middle lies nearest the chord before's, the first from its lowest
 * tone at middle C. A chord of five notes or more leaves its root to the bass when the bass plays it
 * (a 9th chord's hand is its 3rd, 5th, 7th and 9th), and the bass always sits under the hand.
 */
export function voiceLead(chords: readonly Chord[]): Midi[][] {
  let previous: readonly Midi[] | null = null
  return chords.map((chord) => {
    const tones = spellChord(chord.root, chord.quality)
    const rootClass = tones[0]?.pitchClass ?? 0
    const held = tones.length >= ROOTLESS_FROM && !chord.bass ? tones.slice(1) : tones
    // The hand from each of its tones, held close: a triad's or a 7th chord's inversions, and a
    // bigger chord inside an octave (a 13th's 3rd, 5th, 13th, 7th and 9th, not a stack an 11th wide).
    const options = held
      .map((start) =>
        closeFrom(held, start, midi(MIDDLE_C + rootClass + (start.semitones % 12))).map(
          (placed) => placed.midi,
        ),
      )
      .flatMap((keys) => [keys, keys.map((key) => midi(key - 12))])
    const [first = []] = options
    const target = previous === null ? null : middle(previous)
    const hand =
      target === null
        ? first
        : options.reduce((best, keys) =>
            Math.abs(middle(keys) - target) < Math.abs(middle(best) - target) ? keys : best,
          )
    previous = hand
    const bass = BASS_FROM + (chord.bass ? pitchClassOf(chord.bass) : rootClass)
    return [midi(bass < Math.min(...hand) ? bass : bass - 12), ...hand]
  })
}
