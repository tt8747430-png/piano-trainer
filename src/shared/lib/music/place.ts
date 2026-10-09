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

/** Root position and the first three inversions: the bass on the root, 3rd, 5th or 7th. */
export const INVERSIONS = [0, 1, 2, 3] as const
export type Inversion = (typeof INVERSIONS)[number]

/** Whether stored or typed text, or a number chosen, is one of the inversions. */
export const isInversion = (value: unknown): value is Inversion =>
  INVERSIONS.some((inversion) => inversion === value)

/** The explorers offer root position and at most the first three inversions. */
const MOST_INVERSIONS = INVERSIONS.length - 1

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
export function inverted(tones: readonly Tone[], key: Midi, inversion: number): PlacedTone[] {
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

/** From this many notes a chord takes two hands: one hand cannot hold its stack (ADR 0035). */
export const TWO_HANDS_FROM = 5

/** The most keys the right hand holds of a chord in two hands. */
const HAND_KEYS = 5
const PERFECT_FIFTH = 7
/** The inversion in which a two-handed chord's right hand starts from its 7th. */
const FROM_SEVENTH = 3

/**
 * A chord of five notes or more shared between the hands (ADR 0035): the left hand takes the root
 * and, from six notes, the perfect 5th over it; where the right hand would still hold more than five
 * keys, the 7th too (its shell), then an altered 5th. The right hand takes the rest, every tone once.
 */
function sharedOut(tones: readonly Tone[]): { lh: Tone[]; rh: Tone[] } {
  const [root, ...rest] = tones
  if (!root) throw new RangeError('A chord has at least its root')
  const lh = [root]
  let rh = rest
  const give = (wanted: (tone: Tone) => boolean) => {
    const tone = rh.find(wanted)
    if (!tone) return
    lh.push(tone)
    rh = rh.filter((each) => each !== tone)
  }
  if (tones.length > TWO_HANDS_FROM) {
    give((tone) => tone.role === '5th' && tone.semitones === PERFECT_FIFTH)
  }
  if (rh.length > HAND_KEYS) give((tone) => tone.role === '7th')
  if (rh.length > HAND_KEYS) give((tone) => tone.role === '5th')
  return { lh, rh }
}

/** The tone a two-handed chord's right hand can turn to start from: its 7th, or the 6th of a 6/9. */
const turnTone = (rh: readonly Tone[]): Tone | undefined =>
  rh.find((tone) => tone.role === '7th') ??
  rh.find((tone) => tone.role === '13th' && tone.semitones < 12)

/** A hand's tones held close: `start` on its key, each other tone on the nearest key above it. */
export const closeFrom = (tones: readonly Tone[], start: Tone, startKey: Midi): PlacedTone[] =>
  tones
    .map((tone) => ({
      tone,
      midi: midi(startKey + pitchClass(tone.pitchClass - start.pitchClass)),
    }))
    .sort((a, b) => a.midi - b.midi)

/**
 * The inversions a built chord is shown in. Up to four notes: root position and one per tone after
 * the root. From five, in two hands (ADR 0035), its root stays in the bass: root position, the right
 * hand from its lowest tone (the 3rd), and the 3rd inversion where that hand has a 7th or 6th to
 * start from instead (3-5-7-9 and 7-9-3-5).
 */
export function chordInversions(tones: readonly Tone[]): readonly number[] {
  if (tones.length < TWO_HANDS_FROM) return INVERSIONS.slice(0, lastInversion(tones.length) + 1)
  return turnTone(sharedOut(tones).rh) ? [0, FROM_SEVENTH] : [0]
}

/** An inversion a built chord is shown in: the one asked, else the nearest it has under it. */
export const fitChordInversion = (inversion: number, tones: readonly Tone[]): number =>
  chordInversions(tones).findLast((each) => each <= inversion) ?? 0

/** A chord of five notes or more in two hands from its root's key: see `sharedOut` and `chordInversions`. */
function twoHands(tones: readonly Tone[], key: Midi, inversion: number): PlacedChord {
  if (!chordInversions(tones).includes(inversion)) {
    throw new RangeError(
      `A chord of ${tones.length} notes in two hands has no inversion ${inversion}`,
    )
  }
  const { lh, rh } = sharedOut(tones)
  const turn = inversion === FROM_SEVENTH ? turnTone(rh) : undefined
  const start = turn ?? rh[0]
  if (!start) throw new RangeError('A chord in two hands has a note for the right hand')
  // The hand from the 7th sits under the hand from the 3rd, so both stay near middle C.
  const startKey = midi(key + (start.semitones % 12) - (turn ? 12 : 0))
  return {
    lh: lh.map((tone) => ({ tone, midi: midi(key - 12 + tone.semitones) })),
    rh: closeFrom(rh, start, startKey),
  }
}

/**
 * A chord's tones, from its root up, as the explorers place them. In one hand: the whole stack from
 * the root at or above middle C in an inversion (a chord spelled out, whatever its size). In both
 * hands: up to four notes, that hand over the root an octave below; from five notes, shared between
 * the hands as a pianist holds it (`sharedOut`, ADR 0035).
 */
export function placeChord(
  tones: readonly Tone[],
  options: { readonly inversion: number; readonly bothHands: boolean },
): PlacedChord {
  const [root] = tones
  if (!root) throw new RangeError('A chord has at least its root')
  const key = midi(MIDDLE_C + root.pitchClass)
  if (options.bothHands && tones.length >= TWO_HANDS_FROM) {
    return twoHands(tones, key, options.inversion)
  }
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
