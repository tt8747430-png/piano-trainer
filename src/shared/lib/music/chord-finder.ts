import { writtenSymbol } from './chord'
import {
  buildChord,
  builtRootSpelling,
  CHORD_PARTS,
  type BuiltChord,
  type ChordParts,
} from './chord-parts'
import { note, type SpelledNote } from './note'
import { pitchClass, type Midi, type PitchClass } from './pitch'

/** A chord the notes played make: its parts, its bass when not its root, and whether its 5th is left out. */
export interface FoundChord {
  readonly chord: BuiltChord
  readonly parts: ChordParts
  /** The lowest note when it is not the root: the part after the slash. */
  readonly bass?: SpelledNote
  readonly symbol: string
  /** The perfect 5th left out, as a hand often leaves it. */
  readonly no5th: boolean
  /** Which chord tone is lowest, 0 the root, where the Chords reference can show it (up to the 3rd inversion). */
  readonly inversion?: number
}

/** A set of pitch classes above a root, as one key: `0 4 7`. */
const shapeKey = (semitones: readonly number[]): string =>
  [...new Set(semitones.map((each) => pitchClass(each)))].sort((a, b) => a - b).join(' ')

/**
 * Every chord the builder makes, as its notes above its root; and a 7th chord or larger without its
 * perfect 5th, as hands play them (a 6th or an added tone without its 5th would only invent names).
 */
const SHAPES = CHORD_PARTS.map((parts) => {
  const semitones = buildChord(note('C'), parts).tones.map((tone) => tone.semitones)
  const has5th = semitones.includes(7) && parts.size >= 7
  return {
    parts,
    exact: shapeKey(semitones),
    no5th: has5th ? shapeKey(semitones.filter((each) => each !== 7)) : null,
  }
})

/** The Chords reference shows root position and three inversions. */
const MOST_INVERSIONS = 3

/**
 * The chords three or more keys make, best first: every chord the builder makes, on each pitch class
 * played as its root, the root spelled by the builder's one rule. Root position first, then a chord
 * with every tone there, then one the table names, then fewer notes; each symbol once.
 */
export function nameChords(keys: readonly Midi[]): FoundChord[] {
  const lowest = Math.min(...keys)
  const pcs = [...new Set(keys.map((key) => pitchClass(key)))]
  if (pcs.length < 3) return []
  const bassPc = pitchClass(lowest)
  const found = pcs.flatMap((rootPc: PitchClass) => {
    const played = shapeKey(pcs.map((pc) => pc - rootPc))
    return SHAPES.flatMap((shape) => {
      const no5th = shape.exact !== played
      if (no5th && shape.no5th !== played) return []
      const chord = buildChord(builtRootSpelling(rootPc, shape.parts), shape.parts)
      const bassAt = chord.tones.findIndex((tone) => tone.pitchClass === bassPc)
      const bassTone = chord.tones[bassAt]
      const bass = rootPc === bassPc || !bassTone ? undefined : bassTone.note
      return [
        {
          chord,
          parts: shape.parts,
          ...(bass ? { bass } : {}),
          symbol: writtenSymbol(chord, bass),
          no5th,
          ...(bassAt >= 0 && bassAt <= MOST_INVERSIONS ? { inversion: bassAt } : {}),
        },
      ]
    })
  })
  const rank = (each: FoundChord) => [
    each.bass ? 1 : 0,
    each.no5th ? 1 : 0,
    each.chord.quality ? 0 : 1,
    each.chord.tones.length,
  ]
  const ranked = found.sort((a, b) => {
    const [ra, rb] = [rank(a), rank(b)]
    const at = ra.findIndex((value, i) => value !== rb[i])
    return at < 0 ? 0 : (ra[at] ?? 0) - (rb[at] ?? 0)
  })
  return ranked.filter((each, i) => ranked.findIndex((other) => other.symbol === each.symbol) === i)
}
