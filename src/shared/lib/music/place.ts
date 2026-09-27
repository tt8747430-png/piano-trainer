import { qualityIntervals, spellChord, type ChordQuality } from './chord'
import { MIDDLE_C } from './keyboard'
import { pitchClassOf, type SpelledNote } from './note'
import { midi, type Midi } from './pitch'
import { spellScale, type ScaleKind } from './scale'
import type { Tone } from './tone'
import {
  romanFigure,
  scaleChords,
  scaleChordSymbol,
  type ChordNotes,
  type ScaleChord,
} from './scale-chord'

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

/** The last inversion a chord of a scale is shown in: the 3rd, 5th or 7th in the bass, as far as it stacks. */
export const lastStackInversion = (notes: ChordNotes): number =>
  Math.min(notes - 1, MOST_INVERSIONS)

/** A chord of a scale on the keyboard: on its root's key, in an inversion, labelled as the keys show it. */
export interface PlacedScaleChord {
  readonly chord: ScaleChord
  /** Its root's key, where the scale places the degree. */
  readonly key: Midi
  readonly tones: readonly PlacedTone[]
  /** Its symbol, over its bass in an inversion: `Dm7`, `C/E`. */
  readonly symbol: string
  /** Its numeral with the inversion's figure: `ii⁷`, `I⁶`. */
  readonly numeral: string
}

/** A stack from its root's key, its lowest `inversion` tones an octave up. */
export function placeStack(
  chord: ScaleChord,
  notes: ChordNotes,
  key: Midi,
  inversion: number,
): PlacedScaleChord {
  const last = lastStackInversion(notes)
  if (!Number.isInteger(inversion) || inversion < 0 || inversion > last) {
    throw new RangeError(`A chord of ${notes} notes has inversions 0–${last}, not ${inversion}`)
  }
  const tones = chord.tones
    .map((tone, i) => ({ tone, midi: midi(key + tone.semitones + (i < inversion ? 12 : 0)) }))
    .sort((a, b) => a.midi - b.midi)
  const bass = inversion > 0 ? tones[0]?.tone.note : undefined
  return {
    chord,
    key,
    tones,
    symbol: scaleChordSymbol(chord, bass),
    numeral: chord.roman + romanFigure(notes, inversion),
  }
}

/** A seven-note scale's chords of `notes` notes, each on its degree's key as `placeScale` places it, in an inversion. */
export function placeScaleChords(
  root: SpelledNote,
  kind: ScaleKind,
  notes: ChordNotes,
  inversion: number,
): PlacedScaleChord[] {
  const degrees = placeScale(root, kind)
  return scaleChords(root, kind, notes).flatMap((chord) => {
    const degree = degrees[chord.degree]
    return degree ? [placeStack(chord, notes, degree.midi, inversion)] : []
  })
}
