import type {
  Accidental,
  Finger,
  Hand,
  Key,
  Meter,
  Midi,
  SpelledNote,
  Tick,
  TimeSignature,
} from '@/shared/lib/music'

/** A note value by its denominator: 1 a whole, 32 a 32nd. */
export type NoteValue = 1 | 2 | 4 | 8 | 16 | 32

export interface Duration {
  readonly value: NoteValue
  readonly dots: 0 | 1
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
}

/** Timed notes with their bars and chord symbols: a Performance is this. */
export interface TimedMusic {
  readonly key: Key
  readonly meter: Meter
  readonly bars: readonly {
    readonly startTick: Tick
    readonly beats: number
    /** Staves with nothing to write in this bar: each holds the time with a rest that is not printed. */
    readonly blank?: readonly StaffId[]
  }[]
  readonly notes: readonly TimedNote[]
  readonly chords: readonly { readonly startTick: Tick; readonly symbol: string }[]
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

export const STAVES = ['treble', 'bass'] as const
export type StaffId = (typeof STAVES)[number]

export interface ChordMark {
  readonly tick: Tick
  readonly symbol: string
}

export interface Measure {
  readonly startTick: Tick
  readonly ticks: Tick
  readonly time: TimeSignature
  /** One or two voices on each staff. */
  readonly staves: Readonly<Record<StaffId, readonly ScoreVoice[]>>
  readonly chords: readonly ChordMark[]
}

/** Music as it is written: a grand staff's measures in a key and a meter. */
export interface Score {
  readonly key: Key
  readonly meter: Meter
  readonly measures: readonly Measure[]
}
