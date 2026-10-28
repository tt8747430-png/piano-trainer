import {
  CHORD_QUALITIES,
  INTERVAL_GROUPS,
  LETTERS,
  midi,
  note,
  noteFromParam,
  noteParam,
  parseNoteInOctave,
  PIANO,
  SCALE_KINDS,
  scaleSkill,
  spellChord,
  type ChordQuality,
  type NoteParam,
  type ReferenceInterval,
  type SkillId,
} from '@/shared/lib/music'
import { INTERVAL_WAYS, type IntervalWay } from '@/shared/lib/schedule'
import type { Asks, ChordItem } from './draw'
import { CHORD_LEVELS, chordLevel, type ChordLevel } from './ladders/chords'
import {
  EAR_SCALES,
  INTERVAL_LEVEL,
  INTERVAL_LEVELS,
  SCALE_EAR_LEVEL,
  SCALE_EAR_LEVELS,
  SIMPLE_INTERVALS,
  type IntervalLevel,
  type ScaleEarLevel,
} from './ladders/ear'
import {
  DEGREE_LEVEL,
  DEGREE_LEVELS,
  PROGRESSION_LEVEL,
  PROGRESSION_LEVELS,
  ROLE_LEVEL,
  ROLE_LEVELS,
  SIGNATURE_LEVEL,
  SIGNATURE_LEVELS,
  type DegreeLevel,
  type ProgressionLevel,
  type RoleLevel,
  type SignatureLevel,
} from './ladders/keys'
import { NOTE_LEVELS, NOTE_RANGE, noteLevel, rangeNotes, type NoteLevel } from './ladders/notes'
import { SCALE_LEVEL_KINDS, SCALE_LEVELS, type ScaleLevel } from './ladders/scales'
import {
  CUSTOM,
  DRILLS,
  readList,
  type Drill,
  type TrainerId,
  type TrainerView,
} from './trainer-view'

/** Custom's choices a trainer has: each a row of its setup. */
export type CustomField =
  | 'chords'
  | 'roots'
  | 'inversions'
  | 'scales'
  | 'intervals'
  | 'ways'
  | 'kinds'
  | 'descending'
  | 'range'
  | 'accidentals'

/**
 * A trainer: its ladder, Custom's choices (none: no Custom), the drills it asks in (none: one way
 * only), and what a run at a level asks.
 */
export interface Trainer {
  readonly id: TrainerId
  readonly levels: readonly string[]
  readonly custom: readonly CustomField[]
  readonly drills: readonly Drill[]
  asks(level: string, view: TrainerView, gaps: readonly SkillId[]): Asks
}

/** The roots a drill may ask from, as the URL writes them: the naturals, then the sharps, then the flats. */
export const ROOT_GROUPS = {
  natural: LETTERS.map((letter) => noteParam(note(letter))),
  sharp: (['C', 'D', 'F', 'G', 'A'] as const).map((letter) => noteParam(note(letter, 1))),
  flat: (['D', 'E', 'G', 'A', 'B'] as const).map((letter) => noteParam(note(letter, -1))),
} as const satisfies Readonly<Record<string, readonly NoteParam[]>>

/** What each of Custom's lists chooses from. */
export const CUSTOM_CHOICES = {
  chords: CHORD_QUALITIES,
  roots: [...ROOT_GROUPS.natural, ...ROOT_GROUPS.sharp, ...ROOT_GROUPS.flat],
  scales: SCALE_KINDS,
  intervals: [...INTERVAL_GROUPS.simple.slice(1), ...INTERVAL_GROUPS.compound],
  ways: INTERVAL_WAYS,
  kinds: EAR_SCALES,
} as const

/** Custom's own choices: what a trainer's Custom asks before the learner changes it. */
export const CUSTOM_OWN = {
  chords: ['maj', 'min'],
  roots: ROOT_GROUPS.natural,
  scales: ['major', 'natural', 'harmonic'],
  intervals: SIMPLE_INTERVALS,
  ways: ['up'],
  kinds: ['major', 'natural', 'harmonic'],
} as const satisfies {
  readonly [List in keyof typeof CUSTOM_CHOICES]: readonly (typeof CUSTOM_CHOICES)[List][number][]
}

/** A list Custom reads from the URL; none read is Custom's own. */
export const orOwn = <T>(read: readonly T[], own: readonly T[]): readonly T[] =>
  read.length > 0 ? read : own

/** A drill's own list read from the URL, its own where none is read. */
const ownList = <F extends keyof typeof CUSTOM_CHOICES>(field: F, raw: string | undefined) =>
  orOwn(
    readList(raw, CUSTOM_CHOICES[field] as readonly string[]),
    CUSTOM_OWN[field] as readonly string[],
  )

/** Custom's roots, as notes. */
const customRoots = (view: TrainerView) =>
  ownList('roots', view.roots).map((root) => noteFromParam(root as NoteParam))

/** Custom's chords: each quality on each root, in each of its inversions where they are asked. */
function customChords(view: TrainerView): ChordItem[] {
  const qualities = ownList('chords', view.chords) as ChordQuality[]
  return qualities.flatMap((quality) =>
    customRoots(view).flatMap((root) => {
      const size = spellChord(root, quality).length
      const inversions =
        view.inversions === true ? Array.from({ length: size }, (_, i) => i) : [null]
      return inversions.map((inversion) => ({ root, quality, inversion }))
    }),
  )
}

/** The drill a URL names of these, the first where none. */
const drillIn = (drills: readonly Drill[], view: TrainerView): Drill =>
  view.drill !== undefined && drills.includes(view.drill) ? view.drill : (drills[0] ?? 'quiz')

/** The drill a trainer's URL names, its first where none; a trainer of one way, none. */
export const drillOf = (trainer: Trainer, view: TrainerView): Drill | undefined =>
  trainer.drills.length > 0 ? drillIn(trainer.drills, view) : undefined

/** An end of Reading notes' range on the piano's keys, read from the URL; one off them is none. */
const pianoKey = (text: string | undefined) => {
  const key = parseNoteInOctave(text ?? '')?.midi
  return key !== undefined && key >= PIANO.from && key <= PIANO.to ? key : undefined
}

/** Reading notes' Custom range, read from the URL; one that runs backwards is turned round. */
function customNotes(view: TrainerView) {
  const from = pianoKey(view.from) ?? NOTE_RANGE.from
  const to = pianoKey(view.to) ?? NOTE_RANGE.to
  const notes = rangeNotes(
    midi(Math.min(from, to)),
    midi(Math.max(from, to)),
    view.accidentals === true,
  )
  return notes.length > 0 ? notes : rangeNotes(NOTE_RANGE.from, NOTE_RANGE.to, false)
}

const TRAINERS: Readonly<Record<TrainerId, Trainer>> = {
  chords: {
    id: 'chords',
    levels: CHORD_LEVELS,
    custom: ['chords', 'roots', 'inversions'],
    drills: DRILLS,
    asks: (level, view) => {
      return {
        kind: 'chords',
        drill: drillIn(DRILLS, view),
        chords: level === CUSTOM ? customChords(view) : chordLevel(level as ChordLevel),
        show: view.show ?? 'name',
        arpeggio: view.arpeggio === true,
      }
    },
  },
  intervals: {
    id: 'intervals',
    levels: INTERVAL_LEVELS,
    custom: ['intervals', 'roots', 'ways'],
    drills: DRILLS,
    asks: (level, view) => {
      const drill = drillIn(DRILLS, view)
      const show = view.show ?? 'name'
      if (level !== CUSTOM)
        return { kind: 'intervals', drill, show, ...INTERVAL_LEVEL[level as IntervalLevel] }
      return {
        kind: 'intervals',
        drill,
        show,
        intervals: ownList('intervals', view.intervals) as ReferenceInterval[],
        ways: ownList('ways', view.ways) as IntervalWay[],
        roots: customRoots(view),
      }
    },
  },
  'build-scale': {
    id: 'build-scale',
    levels: SCALE_LEVELS,
    custom: ['scales'],
    drills: [],
    asks: (level, view) => ({
      kind: 'skills',
      skills: (level === CUSTOM
        ? orOwn(readList(view.scales, CUSTOM_CHOICES.scales), CUSTOM_OWN.scales)
        : SCALE_LEVEL_KINDS[level as ScaleLevel]
      ).map(scaleSkill),
    }),
  },
  gaps: {
    id: 'gaps',
    levels: [],
    custom: [],
    drills: [],
    asks: (_level, _view, gaps) => ({
      kind: 'skills',
      skills: gaps,
      ordered: true,
    }),
  },
  'scales-by-ear': {
    id: 'scales-by-ear',
    levels: SCALE_EAR_LEVELS,
    custom: ['kinds', 'descending'],
    drills: [],
    asks: (level, view) =>
      level === CUSTOM
        ? {
            kind: 'scales',
            kinds: orOwn(readList(view.kinds, CUSTOM_CHOICES.kinds), CUSTOM_OWN.kinds),
            descending: view.descending === true,
          }
        : { kind: 'scales', ...SCALE_EAR_LEVEL[level as ScaleEarLevel] },
  },
  'reading-notes': {
    id: 'reading-notes',
    levels: NOTE_LEVELS,
    custom: ['range', 'accidentals'],
    drills: [],
    asks: (level, view) => ({
      kind: 'notes',
      notes: level === CUSTOM ? customNotes(view) : noteLevel(level as NoteLevel),
    }),
  },
  'key-signatures': {
    id: 'key-signatures',
    levels: SIGNATURE_LEVELS,
    custom: [],
    drills: [],
    asks: (level) => ({ kind: 'signatures', keys: SIGNATURE_LEVEL[level as SignatureLevel] }),
  },
  'key-degrees': {
    id: 'key-degrees',
    levels: DEGREE_LEVELS,
    custom: [],
    drills: [],
    asks: (level) => ({ kind: 'degrees', keys: DEGREE_LEVEL[level as DegreeLevel] }),
  },
  'chord-role': {
    id: 'chord-role',
    levels: ROLE_LEVELS,
    custom: [],
    drills: [],
    asks: (level) => ({ kind: 'roles', ...ROLE_LEVEL[level as RoleLevel] }),
  },
  // A progression is no skill (UBIQUITOUS_LANGUAGE): its answers rate nothing.
  'progressions-by-ear': {
    id: 'progressions-by-ear',
    levels: PROGRESSION_LEVELS,
    custom: [],
    drills: [],
    asks: (level) => ({
      kind: 'progressions',
      ...PROGRESSION_LEVEL[level as ProgressionLevel],
    }),
  },
}

export const trainerOf = (id: TrainerId): Trainer => TRAINERS[id]

/** The level a trainer's URL names: one of its ladder, or Custom where it has one; else its first. */
export function levelOf(trainer: Trainer, view: TrainerView): string {
  const { level } = view
  if (level === CUSTOM && trainer.custom.length > 0) return CUSTOM
  return level !== undefined && trainer.levels.includes(level) ? level : (trainer.levels[0] ?? '')
}

/**
 * A trainer's URL as it should be: a level of its own, none for its first (absent is its first) or for
 * one it does not have. The same view when it already is.
 */
export function ownTrainerView(trainer: Trainer, view: TrainerView): TrainerView {
  const level = levelOf(trainer, view)
  const own = level === (trainer.levels[0] ?? '') ? undefined : level
  return own === view.level ? view : { ...view, level: own }
}

/**
 * Where a trainer keeps a level's record: `build-scale:major`; a drill's under its way too,
 * `chords:quiz:c-main`; My gaps, with no ladder, `gaps:all`.
 */
export const runKeyOf = (trainer: Trainer, level: string, drill?: Drill) =>
  `${trainer.id}:${drill && trainer.drills.length > 0 ? `${drill}:` : ''}${level || 'all'}` as const

/** Each trainer's ladder by the name its levels are kept under; My gaps has none. */
export const LADDERS = {
  chords: CHORD_LEVELS,
  scales: SCALE_LEVELS,
  intervals: INTERVAL_LEVELS,
  scalesByEar: SCALE_EAR_LEVELS,
  notes: NOTE_LEVELS,
  signatures: SIGNATURE_LEVELS,
  degrees: DEGREE_LEVELS,
  roles: ROLE_LEVELS,
  progressions: PROGRESSION_LEVELS,
} as const
type Ladder = keyof typeof LADDERS

const LADDER_OF: Readonly<Record<TrainerId, Ladder | null>> = {
  chords: 'chords',
  intervals: 'intervals',
  'build-scale': 'scales',
  gaps: null,
  'scales-by-ear': 'scalesByEar',
  'reading-notes': 'notes',
  'key-signatures': 'signatures',
  'key-degrees': 'degrees',
  'chord-role': 'roles',
  'progressions-by-ear': 'progressions',
}

/** The ladder a trainer climbs; null for My gaps. */
export const ladderOf = (id: TrainerId): Ladder | null => LADDER_OF[id]
