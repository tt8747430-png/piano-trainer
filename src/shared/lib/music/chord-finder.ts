import { writtenSymbol } from './chord'
import {
  buildChord,
  builtRootSpelling,
  CHORD_PARTS,
  highestNatural,
  type AddedTone,
  type BuiltChord,
  type ChordParts,
} from './chord-parts'
import type { Key } from './key'
import { note, type SpelledNote } from './note'
import { pitchClass, type Midi, type PitchClass } from './pitch'
import { keyTones } from './scale'
import { TWO_HANDS_FROM } from './place'
import type { ChordRole, Tone } from './tone'

/** The tones a hand may leave out of a chord, in the order they are said. */
const LEFT_OUT = ['3rd', '5th', '9th', '11th'] as const satisfies readonly ChordRole[]
export type LeftOut = (typeof LEFT_OUT)[number]

/** A chord the notes played make: its parts, its bass when not its root, and the tones left out. */
export interface FoundChord {
  readonly chord: BuiltChord
  readonly parts: ChordParts
  /** The lowest note when it is not the root: the part after the slash. */
  readonly bass?: SpelledNote
  readonly symbol: string
  /** The tones the hand left out, as `LEFT_OUT` orders them: none when every tone is there. */
  readonly leftOut: readonly LeftOut[]
  /** Which chord tone is lowest, 0 the root, where the Chords explorer can show it (up to the 3rd inversion). */
  readonly inversion?: number
}

/** A set of pitch classes above a root, as one key: `0 4 7`. */
const shapeKey = (semitones: readonly number[]): string =>
  [...new Set(semitones.map((each) => pitchClass(each)))].sort((a, b) => a - b).join(' ')

/** The plain tone of each number a hand leaves out: a major 3rd, a perfect 5th, a natural 9th or 11th. */
const PLAIN: Readonly<Record<LeftOut, string>> = {
  '3rd': '3',
  '5th': '5',
  '9th': '9',
  '11th': '11',
}
const isPlain = (tone: Tone, role: LeftOut) => tone.role === role && tone.degree === PLAIN[role]

/** A 6/9 over a 3rd: a suspended one keeps its 5th, or it is only stacked 4ths. */
const isSixNine = (parts: ChordParts): boolean =>
  parts.triad !== 'sus4' &&
  parts.added.length === 2 &&
  parts.added.includes('add6') &&
  parts.added.includes('add9')

/**
 * The tones of a chord a hand may leave out (spec 2026-10-05 §5): its perfect 5th, from a 7th chord
 * up and from a 6/9; its natural 9th and 11th under its highest number (a 13th's, an 11th's 9th); and
 * the major 3rd of an unaltered 7th chord, where the 5th is played. Never the root, the 7th, the
 * highest number or an alteration: they are what the name says. A 6th or an added tone keeps its 5th,
 * or its name would be invented.
 */
function leavable(parts: ChordParts, tones: readonly Tone[]): LeftOut[] {
  const has = (role: LeftOut) => tones.some((tone) => isPlain(tone, role))
  const top = parts.size === 5 ? 5 : highestNatural(parts)
  const rules: Readonly<Record<LeftOut, boolean>> = {
    '3rd': parts.size === 7 && parts.triad === 'maj' && parts.alterations.length === 0,
    '5th': parts.size >= 7 || isSixNine(parts),
    '9th': top >= 11,
    '11th': top === 13,
  }
  return LEFT_OUT.filter((role) => rules[role] && has(role))
}

/** Every way of leaving tones out: none, each alone, and together, but never the 3rd and the 5th both. */
const waysToLeaveOut = (roles: readonly LeftOut[]): LeftOut[][] =>
  roles
    .reduce<LeftOut[][]>((ways, role) => [...ways, ...ways.map((way) => [...way, role])], [[]])
    .filter((way) => !(way.includes('3rd') && way.includes('5th')))

/** Three tones at least name a chord. */
const FEWEST_TONES = 3

interface Shape {
  readonly parts: ChordParts
  readonly leftOut: readonly LeftOut[]
}

/**
 * Every chord the builder makes, whole and with each way of leaving tones out, by its notes above its
 * root (`shapeKey`): the chords a set of pitch classes over a root may be.
 */
const SHAPES = CHORD_PARTS.reduce((byKey, parts) => {
  const tones = buildChord(note('C'), parts).tones
  for (const leftOut of waysToLeaveOut(leavable(parts, tones))) {
    const kept = tones.filter((tone) => !leftOut.some((role) => isPlain(tone, role)))
    if (kept.length < FEWEST_TONES) continue
    const key = shapeKey(kept.map((tone) => tone.semitones))
    byKey.set(key, [...(byKey.get(key) ?? []), { parts, leftOut }])
  }
  return byKey
}, new Map<string, Shape[]>())

/**
 * A ♭5 and a #11 are one key: from a 9th up it reads as the #11, a tension, and in a 7th chord as an
 * altered 5th. So `C E B♭ D F#` is C9#11 with no 5th before C9♭5, and `C E G♭ B♭` stays C7♭5.
 */
const flatFiveOverTensions = (parts: ChordParts): boolean =>
  parts.size >= 9 && parts.alterations.includes('b5')

/**
 * A 7th chord with an added tone is a part of the chord stacked to that tone: `C E B♭ A` reads as C13
 * with its 5th and 9th left out before C7(add13), and `C E♭ B♭ F` as Cm11 before Cm7(add11).
 */
const addsOverSeventh = (parts: ChordParts): boolean => parts.size >= 7 && parts.added.length > 0

/** The Chords explorer shows root position and three inversions. */
const MOST_INVERSIONS = 3

/**
 * The chords three or more keys make, best first: every chord the builder makes, on each pitch class
 * played as its root, the root spelled by the builder's one rule (or as `key` spells it, where the
 * notes are written in a key). Root position first, then a ♭5 read
 * as a #11 from a 9th up, then a stacked chord before a 7th chord with an added tone, then the fewest
 * tones left out, then an added 2nd or 4th named as played (within the octave of the root, else a 9th
 * or 11th), then one the table names, then fewer notes; each chord once.
 */
export function nameChords(keys: readonly Midi[], key?: Key): FoundChord[] {
  const lowest = Math.min(...keys)
  const pcs = [...new Set(keys.map((key) => pitchClass(key)))]
  if (pcs.length < 3) return []
  const bassPc = pitchClass(lowest)
  const found = pcs.flatMap((rootPc: PitchClass) => {
    const shapes = SHAPES.get(shapeKey(pcs.map((pc) => pc - rootPc))) ?? []
    // The lowest key of the root played: an added tone within an octave above it is a 2nd or 4th.
    const rootKey = Math.min(...keys.filter((each) => pitchClass(each) === rootPc))
    return shapes.flatMap((shape) => {
      const chord = spelledChord(rootPc, shape.parts, key)
      const bassAt = chord.tones.findIndex((tone) => tone.pitchClass === bassPc)
      const bassTone = chord.tones[bassAt]
      const bass = rootPc === bassPc || !bassTone ? undefined : bassTone.note
      return [
        {
          chord,
          parts: shape.parts,
          ...(bass ? { bass } : {}),
          symbol: writtenSymbol(chord, bass),
          leftOut: shape.leftOut,
          // The Chords explorer reads a chord of five notes or more by hands, not inversions.
          ...(bassAt >= 0 && bassAt <= MOST_INVERSIONS && chord.tones.length < TWO_HANDS_FROM
            ? { inversion: bassAt }
            : {}),
          voicedAs: voicing(shape.parts, rootKey, keys),
        },
      ]
    })
  })
  const rank = (each: (typeof found)[number]) => [
    each.bass ? 1 : 0,
    flatFiveOverTensions(each.parts) ? 1 : 0,
    addsOverSeventh(each.parts) ? 1 : 0,
    each.leftOut.length,
    each.voicedAs,
    each.chord.quality ? 0 : 1,
    each.chord.tones.length,
  ]
  const ranked = found.sort((a, b) => {
    const [ra, rb] = [rank(a), rank(b)]
    const at = ra.findIndex((value, i) => value !== rb[i])
    return at < 0 ? 0 : (ra[at] ?? 0) - (rb[at] ?? 0)
  })
  // One name a chord: by its symbol, and by its tones over its bass (add2 or add9, as it is voiced).
  const sameChord = (a: (typeof ranked)[number], b: (typeof ranked)[number]) =>
    a.symbol === b.symbol ||
    (a.chord.root.letter === b.chord.root.letter &&
      a.chord.root.accidental === b.chord.root.accidental &&
      a.bass?.letter === b.bass?.letter &&
      a.bass?.accidental === b.bass?.accidental &&
      a.parts.triad === b.parts.triad &&
      a.parts.size === b.parts.size &&
      octaveTones(a.parts) === octaveTones(b.parts))
  return ranked
    .filter((each, i) => ranked.findIndex((other) => sameChord(other, each)) === i)
    .map(({ voicedAs: _voicedAs, ...chord }) => chord)
}

/** An added tone and the one an octave from it: the same note, named by where it is played. */
const OCTAVE_OF: Readonly<Record<AddedTone, AddedTone>> = {
  add2: 'add9',
  add9: 'add9',
  add4: 'add11',
  add11: 'add11',
  add6: 'add6',
  addS11: 'addS11',
  add13: 'add13',
}

/** A chord's added tones, each as the one an octave up names it: add2 and add9 are one. */
const octaveTones = (parts: ChordParts): string =>
  parts.added
    .map((tone) => OCTAVE_OF[tone])
    .toSorted()
    .join(' ')

/** How far a name's added 2nd, 4th, 9th or 11th is from how the keys voice it: 0 where each fits. */
function voicing(parts: ChordParts, rootKey: number, keys: readonly Midi[]): number {
  const SEMITONES: Partial<Record<AddedTone, number>> = { add2: 2, add9: 2, add4: 5, add11: 5 }
  return parts.added.filter((tone) => {
    const above = SEMITONES[tone]
    if (above === undefined) return false
    const close = keys.some((key) => key - rootKey === above)
    return (tone === 'add2' || tone === 'add4') !== close
  }).length
}

/**
 * A chord on a pitch class: on a note of `key`, its root spelled as the key writes it (G♭ in G♭, G#
 * in E), unless that writes a double sharp or flat its builder's own spelling does not; on a note
 * outside the key, by the builder's rule (C#m in C, not D♭m with its F♭).
 */
function spelledChord(rootPc: PitchClass, parts: ChordParts, key: Key | undefined): BuiltChord {
  const own = buildChord(builtRootSpelling(rootPc, parts), parts)
  const keyRoot = key && keyTones(key).find((tone) => tone.pitchClass === rootPc)?.note
  if (!keyRoot) return own
  const inKey = buildChord(keyRoot, parts)
  const doubled = (chord: BuiltChord) =>
    chord.tones.some((tone) => Math.abs(tone.note.accidental) > 1)
  return doubled(inKey) && !doubled(own) ? own : inKey
}
