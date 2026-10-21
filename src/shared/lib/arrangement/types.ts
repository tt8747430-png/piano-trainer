import type {
  BarMarks,
  Chord,
  Finger,
  Hand,
  Key,
  Meter,
  Midi,
  NoteMarks,
  SpelledNote,
  Tick,
  Tone,
} from '@/shared/lib/music'

/** A chart as the engine reads it: chords by section, line and bar, in the key it is written in. */
export interface ChartChord extends Chord {
  readonly beats: number
  /** The method code written after the chord (`t1`, `3ch`): which pattern plays it. */
  readonly method?: string
}
/** A note a hand plays as written in its bar: from the bar's start, in the chart's key. */
export interface HandNote {
  readonly midi: Midi
  readonly spelled: SpelledNote
  readonly startTick: Tick
  readonly durationTicks: Tick
  readonly finger?: Finger
  readonly marks?: NoteMarks
}
/** A bar's hands written note by note: a hand here (even with no notes) is played as written, not by the pattern. */
export interface WrittenHands {
  readonly rh?: readonly HandNote[]
  readonly lh?: readonly HandNote[]
}
/** A bar of a chart: its chords, its beats, its written hands and its barlines (a repeat, an ending). */
export interface ChartBar extends BarMarks {
  readonly chords: readonly ChartChord[]
  readonly beats: number
  readonly hands?: WrittenHands
}
export interface ChartSection {
  readonly lines: readonly (readonly ChartBar[])[]
  /** The key its bars are written in, where that is not the chart's (a key change). */
  readonly key?: Key
}
export interface Chart {
  readonly key: Key
  readonly meter: Meter
  readonly sections: readonly ChartSection[]
}

export interface MelodyNote {
  readonly midi: Midi
  /** As the melody writes it: C♯5 is C♯, never D♭. */
  readonly spelled: SpelledNote
  readonly startTick: Tick
  readonly durationTicks: Tick
  /** What its text marks on it (ADR 0063). */
  readonly marks?: NoteMarks
}
export type Melody = readonly MelodyNote[]

/** One token of the figure notation (`C`, `T1`, `v3`, `s7`…): which notes of the chord being played it stands for. */
export type FigureToken =
  /** `C`: the voice-led chord */
  | { readonly kind: 'chord' }
  /** `T` `T1` `T2`: the close triad from the root, or an inversion of it; `T8` `T15` it one or two octaves up */
  | { readonly kind: 'triad'; readonly inversion: 0 | 1 | 2; readonly octaves: 0 | 1 | 2 }
  /** `U`: the voice-led chord's upper notes, all but its lowest (`v1`) */
  | { readonly kind: 'upper-voices' }
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
  /** `Sh`: a jazz shell's top over the bass: the chord's 7th above it, or its 5th where it has none */
  | { readonly kind: 'shell' }
  /** `A`: in the left hand's register, a semitone under the bass coming next (a walking bass's approach) */
  | { readonly kind: 'approach' }
export interface FigureTone {
  readonly token: FigureToken
  readonly finger?: Finger
}
export interface FigureEvent {
  readonly start: Tick
  readonly duration: Tick
  readonly tones: readonly FigureTone[]
  readonly accent: boolean
}
/** A hand's figure as fixed events for a 4/4 bar; `inThree` replaces them in 3/4, `onMajor` on major chords. */
/**
 * A hand's figure as events in a 4/4 bar; with what it plays instead in 3/4, over a major chord, and in
 * compound time (6/8, 12/8: a 12/8 bar, whose first half a 6/8 bar plays), over a major chord there too;
 * and in a 6/8 bar alone, where a figure of four beats has its own two-beat form.
 */
export interface EventFigure {
  readonly kind: 'events'
  readonly events: readonly FigureEvent[]
  readonly inThree?: readonly FigureEvent[]
  readonly onMajor?: readonly FigureEvent[]
  readonly inCompound?: readonly FigureEvent[]
  readonly inCompoundOnMajor?: readonly FigureEvent[]
  readonly inSix?: readonly FigureEvent[]
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
  /** The right hand's chord as voiced, where its figure plays the voiced chord (not a tune, nor its own shapes). */
  readonly hand?: readonly Midi[]
}
export interface PerformanceBar extends BarMarks {
  /** The chart's bar it plays, where the repeats are played (`unfold`): its index as written. */
  readonly written?: number
  readonly startTick: Tick
  readonly beats: number
  readonly section: number
  readonly line: number
  /** Indexes into Performance.chords. */
  readonly chords: readonly number[]
  /** The key it is played in, where that is not the Performance's (a key change). */
  readonly key?: Key
}
export interface PerformanceNote {
  readonly midi: Midi
  /** As it is written: a chord tone as its chord spells it, another note as its token or the key does. */
  readonly spelled: SpelledNote
  readonly hand: NoteHand
  readonly finger?: Finger
  readonly startTick: Tick
  readonly durationTicks: Tick
  readonly velocity: number
  /** Index into Performance.chords: the chord this note was played for. */
  readonly chord: number
  /** What a written note's text marks on it (ADR 0063). */
  readonly marks?: NoteMarks
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
  readonly meter: Meter
  readonly totalTicks: Tick
  readonly bars: readonly PerformanceBar[]
  readonly chords: readonly PerformedChord[]
  readonly notes: readonly PerformanceNote[]
  readonly beatGroups: readonly BeatGroup[]
  /**
   * Where a piece has more voices (ADR 0066), every voice sung, in the key played: the tune first, then
   * the more voices. Heard and shown, never the learner's to play, so apart from `notes` and the beat
   * groups.
   */
  readonly sung?: readonly Melody[]
}
