import { spellChord, type Chord } from './chord'
import { lastInversion, placeChord } from './place'
import { midi, type Midi } from './pitch'

/** The bass plays each root between C3 and B3. */
const BASS_FROM = 48

const middle = (keys: readonly Midi[]): number =>
  keys.reduce((sum, key) => sum + key, 0) / Math.max(keys.length, 1)

/**
 * A row of chords as a hand plays it smoothly: each chord over its root in the bass, the right hand in
 * the inversion (in its own octave or an octave down) whose middle lies nearest the chord before's,
 * the first in root position from middle C.
 */
export function voiceLead(chords: readonly Chord[]): Midi[][] {
  let previous: readonly Midi[] | null = null
  return chords.map((chord) => {
    const tones = spellChord(chord.root, chord.quality)
    const [rootTone] = tones
    const options = Array.from({ length: lastInversion(tones.length) + 1 }, (_, inversion) =>
      placeChord(tones, { inversion, bothHands: false }).rh.map((placed) => placed.midi),
    ).flatMap((keys) => [keys, keys.map((key) => midi(key - 12))])
    const [first = []] = options
    const target = previous === null ? null : middle(previous)
    const hand =
      target === null
        ? first
        : options.reduce((best, keys) =>
            Math.abs(middle(keys) - target) < Math.abs(middle(best) - target) ? keys : best,
          )
    previous = hand
    const bass = midi(BASS_FROM + (rootTone?.pitchClass ?? 0))
    return [bass, ...hand]
  })
}
