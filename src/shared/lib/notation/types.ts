import type {
  Accidental,
  BarMarks,
  Clef,
  Finger,
  Hand,
  HandClefs,
  Key,
  Meter,
  Midi,
  NoteLyrics,
  NoteMarks,
  SpelledNote,
  Tick,
  TimeSignature,
  TempoUnit,
} from '@/shared/lib/music'

/** A note value by its denominator: 1 a whole, 32 a 32nd. */
export type NoteValue = 1 | 2 | 4 | 8 | 16 | 32

export interface Duration {
  readonly value: NoteValue
  /** One dot adds half the value, two add three quarters. */
  readonly dots: 0 | 1 | 2
  /** Three in the time of two: only in a triplet beat. */
  readonly triplet: boolean
}

/** A note on a timeline: what `notate` reads. A Performance's notes are these. */
export interface TimedNote {
  readonly midi: Midi
  readonly spelled: SpelledNote
  /** Who plays it: a hand of the piano, or a single staff over it (ADR 0097). */
  readonly hand: Hand | 'staff'
  /** A single staff's note: its staff's place, top down from 0. */
  readonly staff?: number
  readonly startTick: Tick
  readonly durationTicks: Tick
  readonly finger?: Finger
  readonly marks?: NoteMarks
  /** What it sings, by verse (ADR 0097): written under the staff whose notes sing it. */
  readonly lyrics?: NoteLyrics
}

/** Timed notes with their bars and chord symbols: a Performance is this. */
export interface TimedMusic {
  readonly key: Key
  readonly meter: Meter
  /** 4/4 printed as common time's C, 2/2 as cut time's ¢ (ADR 0114). */
  readonly timeSymbol?: true
  /** The note its tempo mark counts, where not the meter's beat (ADR 0114): ♪ = 180. */
  readonly tempoUnit?: TempoUnit
  readonly bars: readonly (BarMarks & {
    /** The tempo marked over it, at the music's head: beats a minute. */
    readonly tempo?: number
    readonly startTick: Tick
    readonly beats: number
    /** Staves with nothing to write in this bar: each holds the time with a rest that is not printed. */
    readonly blank?: readonly StaffId[]
    /** The key it is written in, where that is not the music's (a key change). */
    readonly key?: Key
    /** The meter it is counted in, where that is not the music's (a change of time, ADR 0097). */
    readonly meter?: Meter
    /** The clef a hand's staff changes to at this bar (ADR 0097). */
    readonly clefs?: HandClefs
  })[]
  readonly notes: readonly TimedNote[]
  readonly chords: readonly { readonly startTick: Tick; readonly symbol: string }[]
  /** The single staves over the grand staff, top down (ADR 0097): each one's clef. None by default. */
  readonly staves?: readonly { readonly clef: Clef }[]
  /** Whether the piano's grand staff is written: not on a lead sheet (ADR 0114). Written by default. */
  readonly piano?: boolean
  /**
   * Music going on from bars before it, a later line of a piece written alone (the editor's): its
   * first bar is never a pickup, which only a piece's first bar is.
   */
  readonly continued?: boolean
}

export interface WrittenNote {
  readonly midi: Midi
  readonly spelled: SpelledNote
  /** The octave it is written in: B♯3 is 60. */
  readonly octave: number
  /** The accidental printed before it; null when the key signature or the bar already says it. */
  readonly accidental: Accidental | null
  /** Tied to the same key's next note. */
  readonly tie: boolean
  readonly finger?: Finger
}

export interface NotesEvent {
  readonly kind: 'notes'
  readonly tick: Tick
  readonly duration: Duration
  readonly notes: readonly WrittenNote[]
  /**
   * Its notes' marks (ADR 0097): those of the notes it starts, a slur's end where its notes end, and an
   * octave line on every piece under it.
   */
  readonly marks?: NoteMarks
  /**
   * The syllables sung on it, by verse (ADR 0097): the tune's, on the piece that starts its notes, a
   * chord's one note singing for the chord; none on a tied continuation.
   */
  readonly lyrics?: NoteLyrics
}

export interface RestEvent {
  readonly kind: 'rest'
  readonly tick: Tick
  readonly duration: Duration
  /** A second voice's gap: it holds the time and is not printed. */
  readonly hidden: boolean
}

export type ScoreEvent = NotesEvent | RestEvent

export type Stem = 'auto' | 'up' | 'down'

/** A voice's events end to end across its bar. */
export interface ScoreVoice {
  readonly events: readonly ScoreEvent[]
  readonly stem: Stem
}

/** A single staff over the piano's grand staff, by its place top down (ADR 0097): `staff0` the top. */
export type SingleStaff = `staff${number}`
/** The piano's grand staff: the right hand's treble and the left hand's bass. */
export const PIANO_STAVES = ['treble', 'bass'] as const
export type PianoStaff = (typeof PIANO_STAVES)[number]
/** The staves a score may write, top down: its single staves, then the piano's grand staff. */
export type StaffId = SingleStaff | PianoStaff
/** The single staff at a place, top down from 0. */
export const singleStaff = (place: number): SingleStaff => `staff${place}`
/** Whether a staff is a single staff, not one of the piano's. */
export const isSingleStaff = (staff: string): staff is SingleStaff => /^staff\d+$/.test(staff)
/** A single staff's place, top down from 0. */
export const staffPlace = (staff: SingleStaff): number => Number(staff.slice('staff'.length))
/** Whether a value names a staff a score may write (a saved one, say). */
export const isStaffId = (value: unknown): value is StaffId =>
  typeof value === 'string' && (isSingleStaff(value) || value === 'treble' || value === 'bass')
/**
 * The clef a staff is written in where nothing says otherwise: the piano's bass staff's is a bass,
 * every other a treble (a single staff written in the bass clef says so in its measures' `clefs`).
 */
export const clefOf = (staff: StaffId): Clef => (staff === 'bass' ? 'bass' : 'treble')
/** The clef a staff is in at a measure: its own (a single staff's, ADR 0097), or a hand's changed clef (ADR 0097). */
export const clefIn = (measure: Pick<Measure, 'clefs'>, staff: StaffId): Clef =>
  measure.clefs?.[staff] ?? clefOf(staff)

export interface ChordMark {
  readonly tick: Tick
  readonly symbol: string
}

/** A bar as written: its notes on each staff, its chords, and its barlines (a repeat, an ending). */
export interface Measure extends BarMarks {
  /** The tempo marked over it (♩ = n), at the music's head. */
  readonly tempo?: number
  readonly startTick: Tick
  readonly ticks: Tick
  readonly time: TimeSignature
  /** The key it is written in, where that is not the score's (a key change). */
  readonly key?: Key
  /**
   * The clef each staff is in here, where that is not `clefOf`'s: a single staff's written in the
   * bass clef, a hand's changed clef.
   */
  readonly clefs?: Readonly<Partial<Record<StaffId, Clef>>>
  /** One or two voices on each of the score's staves; none on a piano's staff it does not write. */
  readonly staves: StaffVoices
  readonly chords: readonly ChordMark[]
}

/** Each staff's voices in a measure: the piano's two always there, a single staff's where it is written. */
export type StaffVoices = Readonly<Record<PianoStaff, readonly ScoreVoice[]>> &
  Readonly<Partial<Record<SingleStaff, readonly ScoreVoice[]>>>

/** Music as it is written: measures on its staves (its single staves over the grand staff) in a key and a meter. */
export interface Score {
  readonly key: Key
  readonly meter: Meter
  /** 4/4 printed as common time's C, 2/2 as cut time's ¢ (ADR 0114). */
  readonly timeSymbol?: true
  /** The note its tempo mark counts, where not the meter's beat (ADR 0114): ♪ = 180. */
  readonly tempoUnit?: TempoUnit
  /** The staves it writes, top down. */
  readonly staves: readonly StaffId[]
  readonly measures: readonly Measure[]
}
