import { qualityIntervals, spellChord, type ChordQuality } from './chord'
import { MIDDLE_C } from './keyboard'
import { pitchClassOf, type SpelledNote } from './note'
import { midi, type Midi } from './pitch'
import { spellScale, type ScaleKind } from './scale'
import type { Tone } from './tone'

/** A tone at a key on the keyboard. */
export interface PlacedTone {
  readonly tone: Tone
  readonly midi: Midi
}

/** A chord's keys, by hand. */
export interface PlacedChord {
  readonly rh: readonly PlacedTone[]
  readonly lh: readonly PlacedTone[]
}

/** The explorer offers root position and at most the first three inversions. */
const MOST_INVERSIONS = 3

/** The last inversion the explorer offers for a chord: one per tone after the root, at most three. */
export const lastInversion = (quality: ChordQuality): number =>
  Math.min(qualityIntervals(quality).length - 1, MOST_INVERSIONS)

/**
 * A chord as the explorers place it: the right hand from the root at or above middle C, the first
 * `inversion` tones an octave up (a chord's tones rise in formula order, so these are its lowest),
 * and for both hands the root an octave below in the left hand.
 */
export function placeChord(
  root: SpelledNote,
  quality: ChordQuality,
  options: { readonly inversion: number; readonly bothHands: boolean },
): PlacedChord {
  const last = lastInversion(quality)
  if (!Number.isInteger(options.inversion) || options.inversion < 0 || options.inversion > last) {
    throw new RangeError(`${quality} has inversions 0–${last}, not ${options.inversion}`)
  }
  const base = MIDDLE_C + pitchClassOf(root)
  const tones = spellChord(root, quality)
  return {
    rh: tones
      .map((tone, i) => ({
        tone,
        midi: midi(base + tone.semitones + (i < options.inversion ? 12 : 0)),
      }))
      .sort((a, b) => a.midi - b.midi),
    lh: options.bothHands ? tones.slice(0, 1).map((tone) => ({ tone, midi: midi(base - 12) })) : [],
  }
}

/** A scale as the keyboard shows it: from the root at or above middle C to the root an octave up. */
export function placeScale(root: SpelledNote, kind: ScaleKind): PlacedTone[] {
  const base = MIDDLE_C + pitchClassOf(root)
  const tones = spellScale(root, kind)
  return [
    ...tones.map((tone) => ({ tone, midi: midi(base + tone.semitones) })),
    ...tones.slice(0, 1).map((tone) => ({ tone, midi: midi(base + 12) })),
  ]
}
