import type { ChosenInversions } from '@/entities/diagram-inversion'
import type { Performance, PerformedChord } from '@/shared/lib/arrangement'
import {
  isInversion,
  midi,
  pitchClass,
  pitchClassOf,
  spellInKey,
  TWO_HANDS_FROM,
  type Inversion,
  type Key,
  type KeyRange,
  type Midi,
  type PitchClass,
  type SpelledNote,
} from '@/shared/lib/music'

// A chord as its diagram draws it (ADR 0101, Chordify's): on one keyboard, F3 to B4, its notes
// folded into the octave from F3 to E4, so a song's chords stand in one place and change by a key
// or two; a chord of three or four notes in the inversion the learner chose for it in that song.

/** The keys every chord diagram is drawn on: F3 to B4, eleven white keys. */
export const DIAGRAM_KEYS: KeyRange = { from: midi(53), to: midi(71) }

/** The lowest key a chord's notes fold onto: F3, the octave up to E4. */
const FOLD_FROM = DIAGRAM_KEYS.from

const NONE_CHOSEN: ChosenInversions = {}

/** Which inversions a chord's diagram can be drawn in. */
export type DiagramInversions =
  | {
      /** A chord of three or four notes, drawn in any of its inversions that fit the keys. */
      readonly kind: 'free'
      /** Its notes: its inversions are Root · 1st · 2nd (· 3rd). */
      readonly notes: number
      /** The inversion drawn: the one chosen, else the fold's. */
      readonly drawn: Inversion
      /** Where its notes fall folded into F3–E4: drawn until another is chosen. */
      readonly folded: Inversion
      /** Each inversion whose keys all stand on the diagram's, in order. */
      readonly fitting: readonly Inversion[]
    }
  | {
      /** Drawn one way: a slash chord over its bass, a chord of five notes or more folded. */
      readonly kind: 'slash' | 'large'
      /** Its notes, a slash chord's bass apart. */
      readonly notes: number
    }

/** A chord of the music as a diagram shows it. */
export interface DiagramChord {
  /** Where it sounds: its index among the performance's chords. */
  readonly chord: number
  readonly symbol: string
  /** The keys its diagram marks, lowest first. */
  readonly keys: readonly Midi[]
  /**
   * A slash chord's bass drawn as a ring: one the chord has not (C/B♭), or one that cannot stand
   * lowest on the keys (C/E); else none.
   */
  readonly ring: Midi | null
  /** Those keys' notes as the chord spells them, lowest first. */
  readonly notes: readonly SpelledNote[]
  /** Every note the chord has, its root first: its tones, and a slash chord's bass. */
  readonly pitchClasses: readonly PitchClass[]
  readonly inversions: DiagramInversions
}

/** A note's key in the octave a chord folds into, F3 to E4. */
const foldedKey = (pc: PitchClass): Midi => midi(FOLD_FROM + pitchClass(pc - FOLD_FROM))

/** Keys lowest first, each once. */
const lowestFirst = (keys: readonly Midi[]): Midi[] => [...new Set(keys)].sort((a, b) => a - b)

/** A chord's tones close over a key: each on the nearest key at or above it. */
const closeOver = (from: Midi, base: PitchClass, tones: readonly PitchClass[]): Midi[] =>
  tones.map((tone) => midi(from + pitchClass(tone - base)))

/** Whether keys all stand on the diagram's. */
const fits = (keys: readonly Midi[]): boolean => keys.every((key) => key <= DIAGRAM_KEYS.to)

/** A chord's inversions, each its keys: its lowest tone at its key in F3–E4, the rest close over it. */
const inversionsOf = (tones: readonly PitchClass[]) =>
  tones.flatMap((bass, inversion) =>
    isInversion(inversion)
      ? [{ inversion, keys: lowestFirst(closeOver(foldedKey(bass), bass, tones)) }]
      : [],
  )

/** A chord's keys, the bass it rings and the inversions it can be drawn in. */
interface Placed {
  readonly keys: Midi[]
  readonly ring: Midi | null
  readonly inversions: DiagramInversions
}

/**
 * A slash chord's place: its bass at its key in F3–E4, the chord's tones close over it, the bass a
 * ring where the chord has it not (C/B♭). Where they would run past B4 (C/E over E4), its notes
 * fold as any chord's and its bass is a ring wherever it falls, so it is still told apart.
 */
function overBass(tones: readonly PitchClass[], bass: PitchClass): Omit<Placed, 'inversions'> {
  const key = foldedKey(bass)
  const over = lowestFirst([key, ...closeOver(key, bass, tones)])
  if (fits(over)) return { keys: over, ring: tones.includes(bass) ? null : key }
  return { keys: lowestFirst([key, ...tones.map(foldedKey)]), ring: key }
}

/**
 * Where a chord's notes stand on the diagram's keys: each folded into F3–E4, as Chordify draws
 * them. A slash chord stands over its bass, and a chord of five notes or more (ADR 0035) folds with
 * its root wherever it falls; neither is turned. A chord of three or four notes is drawn in the
 * inversion chosen, where it fits.
 */
function placed(performed: PerformedChord, chosen: Inversion | undefined): Placed {
  const tones = performed.tones.map((tone) => tone.pitchClass)
  const notes = tones.length
  if (performed.bass) {
    return {
      ...overBass(tones, pitchClassOf(performed.bass)),
      inversions: { kind: 'slash', notes },
    }
  }
  const keys = lowestFirst(tones.map(foldedKey))
  if (notes >= TWO_HANDS_FROM) return { keys, ring: null, inversions: { kind: 'large', notes } }
  const turned = inversionsOf(tones)
  const fitting = turned.filter((each) => fits(each.keys)).map(({ inversion }) => inversion)
  // The fold is the inversion of its lowest note, close over it.
  const folded = turned.find((each) => each.keys[0] === keys[0])?.inversion ?? 0
  const drawn = chosen !== undefined && fitting.includes(chosen) ? chosen : folded
  return {
    keys: turned.find(({ inversion }) => inversion === drawn)?.keys ?? keys,
    ring: null,
    inversions: { kind: 'free', notes, drawn, folded, fitting },
  }
}

/** A key's note as the chord spells it: one of its tones or its bass, else as the key spells it. */
const spelledIn = (performed: PerformedChord, key: Midi, musicKey: Key): SpelledNote =>
  performed.tones.find((tone) => tone.pitchClass === pitchClass(key))?.note ??
  (performed.bass && pitchClassOf(performed.bass) === pitchClass(key)
    ? performed.bass
    : spellInKey(pitchClass(key), musicKey))

/**
 * A performed chord as its diagram shows it, in the inversion chosen for its symbol where it has
 * one; none for a chord the music has not.
 */
export function diagramChord(
  performance: Performance,
  chord: number,
  chosen: ChosenInversions = NONE_CHOSEN,
): DiagramChord | null {
  const performed = performance.chords[chord]
  if (!performed) return null
  const { keys, ring, inversions } = placed(performed, chosen[performed.symbol])
  const tones = performed.tones.map((tone) => tone.pitchClass)
  const bass = performed.bass ? pitchClassOf(performed.bass) : undefined
  return {
    chord,
    symbol: performed.symbol,
    keys,
    ring,
    notes: keys.map((key) => spelledIn(performed, key, performance.key)),
    pitchClasses: bass === undefined || tones.includes(bass) ? tones : [...tones, bass],
    inversions,
  }
}

/**
 * The music's chords in the order they first sound, each symbol once, each in the inversion chosen
 * for it: its chord summary.
 */
export function chordSummary(
  performance: Performance,
  chosen: ChosenInversions = NONE_CHOSEN,
): DiagramChord[] {
  const seen = new Set<string>()
  return performance.chords.flatMap((performed, chord) => {
    if (seen.has(performed.symbol)) return []
    seen.add(performed.symbol)
    return diagramChord(performance, chord, chosen) ?? []
  })
}
