import type { Chord, Finger, Hand, Key, Midi, Tone } from '@/shared/lib/music'

/** The domain's unit of time: 12 per beat, so 16ths (3) and triplet 8ths (4) are whole. */
export type Tick = number
export const TICKS_PER_BEAT = 12

/** A chart as the engine reads it: chords by section, line and bar, in the key it is written in. */
export interface ChartChord extends Chord {
  readonly beats: number
  /** The method code written after the chord (`t1`, `3ch`): which pattern plays it. */
  readonly method?: string
}
export interface ChartBar {
  readonly chords: readonly ChartChord[]
  readonly beats: number
}
export interface ChartSection {
  readonly lines: readonly (readonly ChartBar[])[]
}
export interface Chart {
  readonly key: Key
  readonly beatsPerBar: number
  readonly sections: readonly ChartSection[]
}

export interface MelodyNote {
  readonly midi: Midi
  readonly startTick: Tick
  readonly durationTicks: Tick
}
export type Melody = readonly MelodyNote[]

/** One token of the figure notation (`C`, `T1`, `v3`, `s7`…): which notes of the chord being played it stands for. */
export type FigureToken =
  /** `C`: the voice-led chord */
  | { readonly kind: 'chord' }
  /** `T` `T1` `T2`: the close triad from the root, or an inversion of it */
  | { readonly kind: 'triad'; readonly inversion: 0 | 1 | 2 }
  /** `T8`: the close triad an octave up */
  | { readonly kind: 'triad-octave' }
  /** `U`: the triad's 3rd and 5th */
  | { readonly kind: 'upper-pair' }
  /** `1`–`15`: a degree above the root, on the chord's own 3rd, 5th and 7th */
  | { readonly kind: 'chord-degree'; readonly degree: number }
  /** `vN`: the Nth note of the voiced chord (index N − 1), repeating an octave up past its top */
  | { readonly kind: 'voice'; readonly index: number }
  /** `_7` `_b7` `_6`: 1, 2 or 3 semitones below the root */
  | { readonly kind: 'below-root'; readonly semitones: 1 | 2 | 3 }
  /** `sN`: N steps up the chord's major or minor scale from the root (`s0` is the root) */
  | { readonly kind: 'scale-degree'; readonly degree: number }
  /** `LN`: a degree above the bass, in the left hand's register */
  | { readonly kind: 'bass-degree'; readonly degree: number }
  /** `Ka` `Kb` `Kc`: the key's I, IV or V triad, voice-led from the chord */
  | { readonly kind: 'key-triad'; readonly triad: 'I' | 'IV' | 'V' }
export interface FigureTone {
  readonly token: FigureToken
  readonly finger?: Finger
}
export interface FigureEvent {
  readonly start: Tick
  readonly duration: Tick
  readonly tones: readonly FigureTone[]
  readonly accent: boolean
  readonly rolled: boolean
}
/** A hand's figure as fixed events for a 4/4 bar; `inThree` replaces them in 3/4, `onMajor` on major chords. */
export interface EventFigure {
  readonly kind: 'events'
  readonly events: readonly FigureEvent[]
  readonly inThree?: readonly FigureEvent[]
  readonly onMajor?: readonly FigureEvent[]
}
/**
 * A right hand that plays the tune: doubled, only at a line's ends, or harmonised under long notes.
 * `withoutMelody` plays when this figure is chosen on its own for a piece with no melody.
 */
export type MelodyFigure =
  | {
      readonly kind: 'melody'
      readonly use: 'double' | 'harmony'
      readonly withoutMelody: EventFigure
    }
  | {
      readonly kind: 'melody'
      readonly use: 'ends'
      readonly between: EventFigure
      readonly withoutMelody: EventFigure
    }
export type Figure = EventFigure | MelodyFigure
export interface EventPattern {
  readonly id: string
  readonly rh: EventFigure
  readonly lh: EventFigure
}
/** A pattern whose right hand plays the tune; on a piece with no melody `withoutMelody` plays instead, both hands. */
export interface MelodyPattern {
  readonly id: string
  readonly rh: MelodyFigure
  readonly lh: EventFigure
  readonly withoutMelody: EventPattern
}
export type Pattern = EventPattern | MelodyPattern

export type NoteHand = Hand | 'melody'
export interface PerformedChord extends Chord {
  readonly symbol: string
  readonly tones: readonly Tone[]
  readonly startTick: Tick
  readonly durationTicks: Tick
  readonly bar: number
  readonly method?: string
  /** The id of the pattern that played it. */
  readonly pattern: string
}
export interface PerformanceBar {
  readonly startTick: Tick
  readonly beats: number
  readonly section: number
  readonly line: number
  /** Indexes into Performance.chords. */
  readonly chords: readonly number[]
}
export interface PerformanceNote {
  readonly midi: Midi
  readonly hand: NoteHand
  readonly finger?: Finger
  readonly startTick: Tick
  readonly durationTicks: Tick
  readonly velocity: number
  /** Index into Performance.chords: the chord this note was played for. */
  readonly chord: number
}
/** Notes sharing an onset: what Step mode walks through. `notes` index into Performance.notes. */
export interface BeatGroup {
  readonly tick: Tick
  readonly bar: number
  readonly chord: number
  readonly notes: readonly number[]
}
export interface Performance {
  readonly key: Key
  readonly beatsPerBar: number
  readonly totalTicks: Tick
  readonly bars: readonly PerformanceBar[]
  readonly chords: readonly PerformedChord[]
  readonly notes: readonly PerformanceNote[]
  readonly beatGroups: readonly BeatGroup[]
}
