import {
  chordSkill,
  INTERVAL_GROUPS,
  midi,
  parseNoteInOctave,
  SCALE_KINDS,
  scaleSkill,
  type SkillId,
} from '@/shared/lib/music'
import { INTERVAL_WAYS } from '@/shared/lib/schedule'
import type { Asks } from './draw'
import { CHORD_LEVELS, chordLevel, type ChordLevel } from './ladders/chords'
import {
  EAR_QUALITIES,
  EAR_SCALES,
  INTERVAL_LEVEL,
  INTERVAL_LEVELS,
  QUALITY_LEVEL,
  QUALITY_LEVELS,
  SCALE_EAR_LEVEL,
  SCALE_EAR_LEVELS,
  SIMPLE_INTERVALS,
  type IntervalLevel,
  type QualityLevel,
  type ScaleEarLevel,
} from './ladders/ear'
import {
  DEGREE_LEVEL,
  DEGREE_LEVELS,
  ROLE_LEVEL,
  ROLE_LEVELS,
  SIGNATURE_LEVEL,
  SIGNATURE_LEVELS,
  type DegreeLevel,
  type RoleLevel,
  type SignatureLevel,
} from './ladders/keys'
import { NOTE_LEVELS, NOTE_RANGE, noteLevel, rangeNotes, type NoteLevel } from './ladders/notes'
import { SCALE_LEVEL_KINDS, SCALE_LEVELS, type ScaleLevel } from './ladders/scales'
import { chordTypes, TYPE_ADDED, TYPE_SIZES, TYPE_SUSPENDED, type ChordTypes } from './chord-types'
import { CUSTOM, readList, type TrainerId, type TrainerView } from './trainer-view'

/** Custom's choices a trainer has: each a field of its sheet. */
export type CustomField =
  | 'chordTypes'
  | 'scales'
  | 'intervals'
  | 'ways'
  | 'qualities'
  | 'arpeggio'
  | 'kinds'
  | 'descending'
  | 'range'
  | 'accidentals'

/** A trainer: its ladder, Custom's choices (none: no Custom), and what a run at a level asks. */
export interface Trainer {
  readonly id: TrainerId
  readonly levels: readonly string[]
  readonly custom: readonly CustomField[]
  /** Its answers are evidence on a skill (ADR 0006). */
  readonly rates: boolean
  asks(level: string, view: TrainerView, gaps: readonly SkillId[]): Asks
}

/** What each of Custom's lists chooses from. */
export const CUSTOM_CHOICES = {
  sizes: TYPE_SIZES,
  scales: SCALE_KINDS,
  intervals: [...INTERVAL_GROUPS.simple.slice(1), ...INTERVAL_GROUPS.compound],
  ways: INTERVAL_WAYS,
  qualities: EAR_QUALITIES,
  kinds: EAR_SCALES,
} as const

/** Custom's own choices: what a trainer's Custom asks before the learner changes it. */
export const CUSTOM_OWN = {
  sizes: ['triads', 'sevenths'],
  scales: ['major', 'natural', 'harmonic'],
  intervals: SIMPLE_INTERVALS,
  ways: ['up'],
  qualities: EAR_QUALITIES,
  kinds: ['major', 'natural', 'harmonic'],
} as const satisfies {
  readonly [List in keyof typeof CUSTOM_CHOICES]: readonly (typeof CUSTOM_CHOICES)[List][number][]
}

/** A list Custom reads from the URL; none read is Custom's own. */
export const orOwn = <T>(read: readonly T[], own: readonly T[]): readonly T[] =>
  read.length > 0 ? read : own

/** Custom's chord types as the URL writes them: sizes (its own where none), then what each adds. */
export const chordTypesOf = (view: TrainerView): ChordTypes => ({
  sizes: orOwn(readList(view.sizes, CUSTOM_CHOICES.sizes), CUSTOM_OWN.sizes),
  suspended: readList(view.suspended, TYPE_SUSPENDED),
  added: readList(view.added, TYPE_ADDED),
  altered: view.altered === true,
})

/** Custom's chord types, as the skills they rate. */
const typeSkills = (view: TrainerView): SkillId[] => chordTypes(chordTypesOf(view)).map(chordSkill)

function chordTrainer(id: 'build-chord' | 'name-chord'): Trainer {
  return {
    id,
    levels: CHORD_LEVELS,
    custom: ['chordTypes'],
    rates: true,
    asks: (level, view) =>
      level === CUSTOM
        ? { kind: 'skills', chords: id, skills: typeSkills(view) }
        : { kind: 'chords', mode: id, chords: chordLevel(level as ChordLevel) },
  }
}

/** Reading notes' Custom range, read from the URL; one that runs backwards is turned round. */
function customNotes(view: TrainerView) {
  const from = parseNoteInOctave(view.from ?? '')?.midi ?? NOTE_RANGE.from
  const to = parseNoteInOctave(view.to ?? '')?.midi ?? NOTE_RANGE.to
  const notes = rangeNotes(
    midi(Math.min(from, to)),
    midi(Math.max(from, to)),
    view.accidentals === true,
  )
  return notes.length > 0 ? notes : rangeNotes(NOTE_RANGE.from, NOTE_RANGE.to, false)
}

const TRAINERS: Readonly<Record<TrainerId, Trainer>> = {
  'build-chord': chordTrainer('build-chord'),
  'name-chord': chordTrainer('name-chord'),
  'build-scale': {
    id: 'build-scale',
    levels: SCALE_LEVELS,
    custom: ['scales'],
    rates: true,
    asks: (level, view) => ({
      kind: 'skills',
      chords: 'build-chord',
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
    rates: true,
    asks: (_level, _view, gaps) => ({
      kind: 'skills',
      chords: 'build-chord',
      skills: gaps,
      ordered: true,
    }),
  },
  'intervals-by-ear': {
    id: 'intervals-by-ear',
    levels: INTERVAL_LEVELS,
    custom: ['intervals', 'ways'],
    rates: false,
    asks: (level, view) =>
      level === CUSTOM
        ? {
            kind: 'intervals',
            intervals: orOwn(
              readList(view.intervals, CUSTOM_CHOICES.intervals),
              CUSTOM_OWN.intervals,
            ),
            ways: orOwn(readList(view.ways, CUSTOM_CHOICES.ways), CUSTOM_OWN.ways),
          }
        : { kind: 'intervals', ...INTERVAL_LEVEL[level as IntervalLevel] },
  },
  'chords-by-ear': {
    id: 'chords-by-ear',
    levels: QUALITY_LEVELS,
    custom: ['qualities', 'arpeggio'],
    rates: false,
    asks: (level, view) =>
      level === CUSTOM
        ? {
            kind: 'qualities',
            qualities: orOwn(
              readList(view.qualities, CUSTOM_CHOICES.qualities),
              CUSTOM_OWN.qualities,
            ),
            arpeggio: view.arpeggio === true,
          }
        : { kind: 'qualities', ...QUALITY_LEVEL[level as QualityLevel] },
  },
  'scales-by-ear': {
    id: 'scales-by-ear',
    levels: SCALE_EAR_LEVELS,
    custom: ['kinds', 'descending'],
    rates: false,
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
    rates: false,
    asks: (level, view) => ({
      kind: 'notes',
      notes: level === CUSTOM ? customNotes(view) : noteLevel(level as NoteLevel),
    }),
  },
  'key-signatures': {
    id: 'key-signatures',
    levels: SIGNATURE_LEVELS,
    custom: [],
    rates: false,
    asks: (level) => ({ kind: 'signatures', keys: SIGNATURE_LEVEL[level as SignatureLevel] }),
  },
  'key-degrees': {
    id: 'key-degrees',
    levels: DEGREE_LEVELS,
    custom: [],
    rates: false,
    asks: (level) => ({ kind: 'degrees', keys: DEGREE_LEVEL[level as DegreeLevel] }),
  },
  'chord-role': {
    id: 'chord-role',
    levels: ROLE_LEVELS,
    custom: [],
    rates: false,
    asks: (level) => ({ kind: 'roles', ...ROLE_LEVEL[level as RoleLevel] }),
  },
}

export const trainerOf = (id: TrainerId): Trainer => TRAINERS[id]

/** The level a trainer's URL names: one of its ladder, or Custom where it has one; else its first. */
export function levelOf(trainer: Trainer, view: TrainerView): string {
  const { level } = view
  if (level === CUSTOM && trainer.custom.length > 0) return CUSTOM
  return level !== undefined && trainer.levels.includes(level) ? level : (trainer.levels[0] ?? '')
}

/** Where a trainer keeps a level's record: `name-chord:c-main`; My gaps, with no ladder, `gaps:all`. */
export const runKeyOf = (trainer: Trainer, level: string) =>
  `${trainer.id}:${level || 'all'}` as const

/** Each trainer's ladder by the name its levels are kept under; My gaps has none. */
export const LADDERS = {
  chords: CHORD_LEVELS,
  scales: SCALE_LEVELS,
  intervals: INTERVAL_LEVELS,
  qualities: QUALITY_LEVELS,
  scalesByEar: SCALE_EAR_LEVELS,
  notes: NOTE_LEVELS,
  signatures: SIGNATURE_LEVELS,
  degrees: DEGREE_LEVELS,
  roles: ROLE_LEVELS,
} as const
export type Ladder = keyof typeof LADDERS

const LADDER_OF: Readonly<Record<TrainerId, Ladder | null>> = {
  'build-chord': 'chords',
  'name-chord': 'chords',
  'build-scale': 'scales',
  gaps: null,
  'intervals-by-ear': 'intervals',
  'chords-by-ear': 'qualities',
  'scales-by-ear': 'scalesByEar',
  'reading-notes': 'notes',
  'key-signatures': 'signatures',
  'key-degrees': 'degrees',
  'chord-role': 'roles',
}

/** The ladder a trainer climbs; null for My gaps. */
export const ladderOf = (id: TrainerId): Ladder | null => LADDER_OF[id]
