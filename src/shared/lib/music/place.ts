import { qualityIntervals, spellChord, type ChordQuality } from './chord'
import { diatonicChords, type DiatonicChord } from './diatonic'
import { MIDDLE_C } from './keyboard'
import { pitchClassOf, sameNote, type SpelledNote } from './note'
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

/**
 * A scale as the keyboard shows it: from degree `start` (0 the tonic, at or above middle C) up to
 * that note an octave higher, each tone keeping its degree from the tonic.
 */
export function placeScale(root: SpelledNote, kind: ScaleKind, start = 0): PlacedTone[] {
  const base = MIDDLE_C + pitchClassOf(root)
  const tones = spellScale(root, kind)
  return Array.from({ length: tones.length + 1 }, (_, i) => {
    const index = start + i
    const tone = tones[index % tones.length]
    if (!tone) throw new RangeError(`${kind} has no degree ${start}`)
    return { tone, midi: midi(base + tone.semitones + 12 * Math.floor(index / tones.length)) }
  })
}

/** A chord of a scale where the keyboard shows the scale: on its degree's key, stacked upwards from it. */
export interface PlacedScaleChord extends DiatonicChord {
  /** The degree's key, as `placeScale` places it. */
  readonly key: Midi
  /** The chord's tones in root position from that key. */
  readonly tones: readonly PlacedTone[]
}

/** The triads (3) or 7th chords (4) of a seven-note scale, each on its degree's key. */
export function placeScaleChords(
  root: SpelledNote,
  kind: ScaleKind,
  size: 3 | 4,
): PlacedScaleChord[] {
  const degrees = placeScale(root, kind)
  return diatonicChords(spellScale(root, kind), size).flatMap((diatonic) => {
    const degree = degrees.find((placed) => sameNote(placed.tone.note, diatonic.chord.root))
    if (!degree) return []
    const tones = spellChord(diatonic.chord.root, diatonic.chord.quality).map((tone) => ({
      tone,
      midi: midi(degree.midi + tone.semitones),
    }))
    return [{ ...diatonic, key: degree.midi, tones }]
  })
}
