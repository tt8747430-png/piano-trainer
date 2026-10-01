import { writtenSymbol } from './chord'
import type { Key } from './key'
import { MIDDLE_C } from './keyboard'
import { pitchClassOf, type SpelledNote } from './note'
import { midi, pitchClass, type Midi } from './pitch'
import { spellScale, type ScaleKind } from './scale'
import type { Tone } from './tone'
import {
  borrowedChords,
  romanFigure,
  scaleChords,
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

/** The explorers offer root position and at most the first three inversions. */
const MOST_INVERSIONS = 3

/**
 * The last inversion a chord of `notes` notes is shown in: one per tone after the root, at most
 * three (the 3rd, 5th or 7th in the bass).
 */
export const lastInversion = (notes: number): number => Math.min(notes - 1, MOST_INVERSIONS)

/** An inversion a chord of `notes` notes is shown in: the one asked, else its last. */
export const fitInversion = (inversion: number, notes: number): number =>
  Math.min(inversion, lastInversion(notes))

/**
 * A chord's tones from its root's key, its lowest `inversion` tones an octave up (a chord's tones
 * rise from the root, so these are its lowest), lowest first.
 */
function inverted(tones: readonly Tone[], key: Midi, inversion: number): PlacedTone[] {
  const last = lastInversion(tones.length)
  if (!Number.isInteger(inversion) || inversion < 0 || inversion > last) {
    throw new RangeError(
      `A chord of ${tones.length} notes has inversions 0–${last}, not ${inversion}`,
    )
  }
  return tones
    .map((tone, i) => ({ tone, midi: midi(key + tone.semitones + (i < inversion ? 12 : 0)) }))
    .sort((a, b) => a.midi - b.midi)
}

/**
 * A chord's tones, from its root up, as the explorers place them: the right hand from the root at or
 * above middle C in an inversion, and for both hands the root an octave below in the left hand.
 */
export function placeChord(
  tones: readonly Tone[],
  options: { readonly inversion: number; readonly bothHands: boolean },
): PlacedChord {
  const [root] = tones
  if (!root) throw new RangeError('A chord has at least its root')
  const key = midi(MIDDLE_C + root.pitchClass)
  return {
    rh: inverted(tones, key, options.inversion),
    lh: options.bothHands ? [{ tone: root, midi: midi(key - 12) }] : [],
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
  const tones = inverted(chord.tones, key, inversion)
  const bass = inversion > 0 ? tones[0]?.tone.note : undefined
  return {
    chord,
    key,
    tones,
    symbol: writtenSymbol(chord, bass),
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

/** A key's borrowed chords, each on its root's key above the tonic (at or above middle C), in an inversion. */
export function placeBorrowedChords(
  key: Key,
  notes: ChordNotes,
  inversion: number,
): PlacedScaleChord[] {
  const tonic = MIDDLE_C + pitchClassOf(key.tonic)
  return borrowedChords(key, notes).map((chord) =>
    placeStack(
      chord,
      notes,
      midi(tonic + pitchClass(pitchClassOf(chord.root) - pitchClassOf(key.tonic))),
      inversion,
    ),
  )
}

/** Walk the chords: the seven up, the tonic's an octave up, and back down to the tonic. */
export function walkChords(chords: readonly PlacedScaleChord[]): PlacedScaleChord[] {
  const [tonic] = chords
  if (!tonic) return []
  const octave: PlacedScaleChord = {
    ...tonic,
    key: midi(tonic.key + 12),
    tones: tonic.tones.map((tone) => ({ ...tone, midi: midi(tone.midi + 12) })),
  }
  return [...chords, octave, ...[...chords].reverse()]
}
