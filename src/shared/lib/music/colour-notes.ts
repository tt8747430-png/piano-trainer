import type { ChordQuality } from './chord'
import { buildChord, CHORD_PARTS, type ChordParts } from './chord-parts'
import {
  INTERVALS,
  intervalBetween,
  type Interval,
  type IntervalName,
  type LabelledInterval,
} from './interval'
import type { Key } from './key'
import { note, pitchClassOf, type SpelledNote } from './note'
import type { PitchClass } from './pitch'
import { keyScale, spellScale } from './scale'
import { toneAbove, type ChordRole } from './tone'

/**
 * A chord's colour notes in three groups (A33): its own tones, the tensions it takes on top, and
 * the notes to avoid (a minor 9th over a chord tone, or outside the table's or the key's tensions).
 */
export const COLOUR_GROUPS = ['chord', 'tension', 'avoid'] as const
export type ColourGroup = (typeof COLOUR_GROUPS)[number]

/** One note over a chord's root, in its group, and what choosing it makes of the chord. */
export interface ColourNote {
  readonly interval: Interval
  /** As a symbol writes it: `9`, `#11`, `add9`, `6`; a chord tone by its degree (`♭7`). */
  readonly label: string
  readonly group: ColourGroup
  /** Spelled by letters from the root. */
  readonly note: SpelledNote
  readonly pitchClass: PitchClass
  /** Its place over the root, as the keys colour it. */
  readonly role: ChordRole
  /** Whether the chord has it now, over its triad and 7th. */
  readonly added: boolean
  /** The chord with it added or taken off; null for a chord tone or a note no chord the builder makes holds. */
  readonly toggled: ChordParts | null
}

/** The 7th chords chord-scale theory tabulates the tensions of: what a lesson opens Chords on. */
export const TENSION_CHORDS = [
  'maj7',
  'm7',
  'd7',
  'hd',
  's5',
  'mM7',
  'M7s5',
  'sus7',
  'o7',
] as const satisfies readonly ChordQuality[]
export type TensionChord = (typeof TENSION_CHORDS)[number]

/**
 * The tensions of the 7th chords chord-scale theory tabulates (the owner's table for Maj7, m7 and 7;
 * a whole step over each chord tone for °7): what each takes on top with no key around it.
 */
const AVAILABLE: Readonly<Partial<Record<ChordQuality, readonly IntervalName[]>>> &
  Readonly<Record<TensionChord, readonly IntervalName[]>> = {
  maj7: ['M9', 'A11', 'M13'],
  m7: ['M9', 'P11', 'M13'],
  d7: ['m9', 'M9', 'A9', 'A11', 'm13', 'M13'],
  hd: ['M9', 'P11', 'm13'],
  s5: ['m9', 'M9', 'A9', 'A11'],
  mM7: ['M9', 'P11', 'M13'],
  M7s5: ['M9', 'A11'],
  sus7: ['m9', 'M9', 'M13'],
  o7: ['M9', 'P11', 'm13', 'M7'],
}

/** The tensions a 7th chord takes, by the table; none for any other chord. */
export const availableTensions = (quality: ChordQuality): readonly LabelledInterval[] =>
  (AVAILABLE[quality] ?? []).map((name) => INTERVALS[name])

/** The 7th chords a dominant function keeps its altered tensions over, in any key. */
const DOMINANTS: ReadonlySet<ChordQuality> = new Set(['d7', 's5', 'sus7'])

/**
 * The note a colour chip may stand for, by its semitones over the root: a triad's 2nd, 4th and 6th
 * beside their octaves; over a 7th chord the 9th, 11th and 13th alone. The 7ths are the size's.
 */
const CANDIDATES: readonly (readonly IntervalName[])[] = [
  [],
  ['m9'],
  ['M2', 'M9'],
  ['A9'],
  ['M3'],
  ['P4', 'P11'],
  ['A11'],
  ['P5'],
  ['m13'],
  ['M6', 'M13'],
  ['m7'],
  ['M7'],
]
const INSIDE_THE_OCTAVE: ReadonlySet<IntervalName> = new Set(['M2', 'P4', 'M6'])
const SEVENTHS: ReadonlySet<IntervalName> = new Set(['m7', 'M7'])

const REFERENCE = note('C')
const setKey = (semitones: readonly number[]): string =>
  [...semitones].sort((a, b) => a - b).join(' ')
const semitonesOf = (parts: ChordParts): number[] =>
  buildChord(REFERENCE, parts).tones.map((tone) => tone.semitones)

/** Every chord the builder makes, by the semitones it holds. */
let byTones: ReadonlyMap<string, ChordParts> | undefined
function builtWith(semitones: readonly number[]): ChordParts | null {
  byTones ??= new Map(CHORD_PARTS.map((parts) => [setKey(semitonesOf(parts)), parts]))
  return byTones.get(setKey(semitones)) ?? null
}

/** A chord's triad and 7th, without what it stacks or adds over them (a ♭5 kept in the 5th's place). */
const coreOf = (parts: ChordParts): ChordParts => ({
  ...parts,
  size: parts.size > 5 ? 7 : 5,
  added: [],
  alterations: parts.alterations.filter((each) => each === 'b5'),
})

/**
 * The chord with `interval` added, or taken off where it has it: the builder's chord holding
 * exactly those notes, so its symbol is written by the usual rule (C9, C7#11, Cadd9); null where the
 * builder makes none.
 */
export function withColour(parts: ChordParts, interval: LabelledInterval): ChordParts | null {
  const now = semitonesOf(parts)
  const next = now.includes(interval.semitones)
    ? now.filter((each) => each !== interval.semitones)
    : [...now, interval.semitones]
  return builtWith(next)
}

/** A chip's name: a triad's added tone as its symbol writes it (`add9`, a 6th `6`), else its degree. */
function labelOf(interval: LabelledInterval, triad: boolean, buildable: boolean): string {
  if (!triad || !buildable || interval.semitones === INTERVALS.M6.semitones) return interval.degree
  return `add${interval.degree}`
}

/**
 * Every note a chord can take on top, grouped: its own tones; the tensions (the table's for a 7th
 * chord, else any that is no minor 9th over a chord tone); the rest to avoid. In `key`, where the
 * chord's root is one of the key's and it is no dominant, the tensions are the key's notes over it
 * that are no minor 9th over a chord tone, those that are avoided, and notes outside the key left
 * out unless the chord has them. Each note the builder can add or take off toggles the chord.
 */
export function colourNotes(root: SpelledNote, parts: ChordParts, key?: Key): ColourNote[] {
  const core = buildChord(root, coreOf(parts))
  const corePcs = new Set(core.tones.map((tone) => tone.semitones % 12))
  const has = new Set(semitonesOf(parts))
  const triad = parts.size === 5
  const base = pitchClassOf(root)
  const scale =
    key && !(core.quality && DOMINANTS.has(core.quality))
      ? new Set(
          spellScale(key.tonic, keyScale(key)).map((tone) => (tone.pitchClass - base + 12) % 12),
        )
      : undefined
  const inKey = scale?.has(0) ? scale : undefined
  const table = !triad && core.quality ? AVAILABLE[core.quality] : undefined
  const tensions = new Set(table?.map((name) => INTERVALS[name].semitones % 12))
  const clashes = (pc: number) => corePcs.has((pc + 11) % 12)

  const own = core.tones.map((tone): ColourNote => ({
    interval: intervalBetween(root, tone.note),
    label: tone.degree,
    group: 'chord',
    note: tone.note,
    pitchClass: tone.pitchClass,
    role: tone.role,
    added: true,
    toggled: null,
  }))
  const colours = CANDIDATES.flatMap((names, pc): ColourNote[] => {
    if (corePcs.has(pc)) return []
    const intervals = names
      .filter((name) => (triad ? !SEVENTHS.has(name) : !INSIDE_THE_OCTAVE.has(name)))
      .map((name) => INTERVALS[name])
    const present = intervals.some((interval) => has.has(interval.semitones))
    if (inKey && !inKey.has(pc) && !present) return []
    const group: ColourGroup = inKey
      ? inKey.has(pc) && !clashes(pc)
        ? 'tension'
        : 'avoid'
      : table
        ? tensions.has(pc)
          ? 'tension'
          : 'avoid'
        : clashes(pc)
          ? 'avoid'
          : 'tension'
    const offered = intervals.map((interval) => ({
      interval,
      toggled: withColour(parts, interval),
    }))
    const buildable = offered.filter((each) => each.toggled !== null)
    const shown = buildable.length > 0 ? buildable : offered.slice(-1)
    return shown.map(({ interval, toggled }) => {
      const tone = toneAbove(root, interval)
      return {
        interval,
        label: labelOf(interval, triad, toggled !== null),
        group,
        note: tone.note,
        pitchClass: tone.pitchClass,
        role: tone.role,
        added: has.has(interval.semitones),
        toggled,
      }
    })
  })
  return [...own, ...colours]
}
