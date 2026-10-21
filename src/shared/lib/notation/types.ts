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
  NoteMarks,
  SpelledNote,
  Tick,
  TimeSignature,
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
  readonly hand: Hand | 'melody'
  readonly startTick: Tick
  readonly durationTicks: Tick
  readonly finger?: Finger
  readonly marks?: NoteMarks
  /** A tune's note sung by another voice than the tune's: written on that voice's own staff. */
  readonly voice?: ExtraVoice
}

/** Timed notes with their bars and chord symbols: a Performance is this. */
export interface TimedMusic {
  readonly key: Key
  readonly meter: Meter
  readonly bars: readonly (BarMarks & {
    /** The tempo marked over it, at the music's head: beats a minute. */
    readonly tempo?: number
    readonly startTick: Tick
    readonly beats: number
    /** Staves with nothing to write in this bar: each holds the time with a rest that is not printed. */
    readonly blank?: readonly StaffId[]
    /** The key it is written in, where that is not the music's (a key change). */
    readonly key?: Key
    /** The clef a hand's staff changes to at this bar (ADR 0069). */
    readonly clefs?: HandClefs
  })[]
  readonly notes: readonly TimedNote[]
  readonly chords: readonly { readonly startTick: Tick; readonly symbol: string }[]
  /** The tune on a staff of its own over the grand staff (ADR 0064); else it is the treble's upper voice. */
  readonly melodyStaff?: boolean
  /** The more voices written, each on its own staff under the tune's (ADR 0066). */
  readonly voiceStaves?: readonly ExtraVoice[]
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
   * Its notes' marks (ADR 0063): those of the notes it starts, a slur's end where its notes end, and an
   * octave line on every piece under it.
   */
  readonly marks?: NoteMarks
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

/** The staves a score may write, top down: the tune's own (ADR 0064), the more voices' (ADR 0066), then the piano's grand staff. */
/** The voices sung besides the tune, each on a staff of its own (ADR 0066): the tune is the first. */
export const EXTRA_VOICES = ['voice2', 'voice3', 'voice4'] as const
export type ExtraVoice = (typeof EXTRA_VOICES)[number]

export const STAVES = ['melody', ...EXTRA_VOICES, 'treble', 'bass'] as const
export type StaffId = (typeof STAVES)[number]
/** The piano's grand staff: the right hand's treble and the left hand's bass. */
export const PIANO_STAVES = ['treble', 'bass'] as const satisfies readonly StaffId[]
/** The clef a staff is written in: the tune's is a treble. */
export const clefOf = (staff: StaffId): Clef => (staff === 'bass' ? 'bass' : 'treble')
/** The clef a staff is in at a measure: a hand's changed clef (ADR 0069), else its own. */
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
  /** The clef each staff is in here, where that is not its own (`clefOf`): a hand's changed clef. */
  readonly clefs?: Readonly<Partial<Record<StaffId, Clef>>>
  /** One or two voices on each of the score's staves; none on a staff it does not write. */
  readonly staves: Readonly<Record<StaffId, readonly ScoreVoice[]>>
  readonly chords: readonly ChordMark[]
}

/** Music as it is written: measures on its staves (the grand staff, the tune's over it) in a key and a meter. */
export interface Score {
  readonly key: Key
  readonly meter: Meter
  /** The staves it writes, top down. */
  readonly staves: readonly StaffId[]
  readonly measures: readonly Measure[]
}
