import type { BarMarkChoice } from './bar-marks'
import type { PatternId } from '@/entities/pattern'
import type { ExtraVoice } from '@/shared/lib/notation'
import type { HiddenRow, SectionKind } from '@/entities/piece'
import type {
  Chord,
  Clef,
  Finger,
  Hand,
  Instrument,
  Key,
  Meter,
  Midi,
  Tick,
} from '@/shared/lib/music'
import type { Clip } from './bars'
import type { Draft, DraftNote, Layer } from './draft'
import { topStaff } from './rows'
import type { TakePart } from './take-edits'
import type { Line } from './lines'
import type { MarkChoice } from './marks'
import type { ChosenValue, Dots } from './values'

/** What undo and redo bring back. */
export interface Snapshot {
  readonly draft: Draft
  readonly caret: Tick
  readonly layer: Layer
}

/** Ticks from `from` up to, not including, `to`: a note's (or chord's, or empty place's) time. */
export interface TickSpan {
  readonly from: Tick
  readonly to: Tick
}

/**
 * Notes chosen with Shift (ADR 0086), as a notation app chooses a range: the note (or chord, or empty
 * place) where the choice began and the one it reaches, both inside it.
 */
export interface Selection {
  readonly anchor: TickSpan
  readonly head: TickSpan
}

/** Keys struck together, written as one entry (spec §6.3). */
export interface Struck {
  readonly at: Tick
  /** When its first key went down, in milliseconds. */
  readonly time: number
  readonly keys: readonly Midi[]
  readonly layer: Layer
  /** Whether it has changed the draft yet: then a key joining it is no new undo step. */
  readonly written: boolean
}

export interface EditorState extends Snapshot {
  readonly value: ChosenValue
  /** Chord: a key played joins the notes at the caret, which stays. */
  readonly chord: boolean
  readonly selection: Selection | null
  /** One note of the chord at the caret chosen alone, by its key (ADR 0086): else the whole chord. */
  readonly chordNote: Midi | null
  readonly struck: Struck | null
  readonly clip: Clip | null
  readonly past: readonly Snapshot[]
  readonly future: readonly Snapshot[]
}

export type BarEdit =
  'insert' | 'delete' | 'copy' | 'cut' | 'paste' | 'newLine' | 'joinLine' | 'newSection'

/** How far the caret moves: a step of the value (or to the next place), a bar, or to an end. */
export type CaretMove = 'step' | 'bar' | 'line' | 'end'

/**
 * Where the caret goes after a chord: nowhere (a chord built part by part); the next beat; the next
 * bar (staying on the last, a tapped chord); or the next bar, one added past the last (a chart typed on).
 */
export type ChordAdvance = 'stay' | 'beat' | 'bar' | 'barAdding'

export type EditorAction =
  | { readonly type: 'layer'; readonly layer: Layer }
  | { readonly type: 'value'; readonly value: ChosenValue['value'] }
  | { readonly type: 'dot'; readonly dots?: Dots }
  | { readonly type: 'triplet' }
  | { readonly type: 'chordMode' }
  | {
      readonly type: 'move'
      readonly by: CaretMove
      readonly direction: -1 | 1
      readonly extend?: boolean
    }
  | {
      readonly type: 'place'
      readonly tick: Tick
      readonly layer: Layer
      readonly extend?: boolean
      /** One note of the chord there, clicked on its head (ADR 0086). */
      readonly key?: Midi
    }
  /** What is chosen let go: the notes chosen, a chord's one note (Escape). */
  | { readonly type: 'deselect' }
  /**
   * The note over (1) or under (−1) the one chosen in the chord at the caret, the chord's top or foot
   * from the whole chord; past its last, the staff over or under (Alt ↑ ↓, ADR 0086).
   */
  | { readonly type: 'chordNote'; readonly direction: -1 | 1 }
  | { readonly type: 'key'; readonly key: Midi; readonly time: number }
  | { readonly type: 'rest' }
  /** The notes or chord at the caret; with `back`, else the ones before it (Backspace). */
  | { readonly type: 'delete'; readonly back?: boolean }
  /** The notes at the caret moved by notes of the key: a note dragged on its staff. */
  | { readonly type: 'step'; readonly steps: number; readonly joins?: boolean }
  /** The tune's staff added over the grand staff, or taken away with its notes (ADR 0064). */
  | { readonly type: 'melodyStaff'; readonly on: boolean }
  /** A more voice's staff added (the next one) or taken away with its notes, the later voices moving up. */
  | {
      readonly type: 'voiceStaff'
      readonly voice: ExtraVoice
      readonly on: boolean
      /** What the voice added is played on (ADR 0070): the voice where none. */
      readonly instrument?: Instrument
    }
  /** A row shown or hidden, its music kept (ADR 0072). */
  | { readonly type: 'hide'; readonly row: HiddenRow; readonly hidden: boolean }
  /** What a sung part is played on: 0 the tune, then each more voice (ADR 0070). */
  | { readonly type: 'instrument'; readonly part: number; readonly instrument: Instrument }
  | { readonly type: 'shift'; readonly semitones: number }
  | { readonly type: 'respell' }
  | { readonly type: 'finger'; readonly midi: Midi; readonly finger: Finger | null }
  /** A mark put on the notes at the caret, or those of the bars chosen, or taken off them all (ADR 0063). */
  | { readonly type: 'mark'; readonly mark: MarkChoice }
  /** A line drawn over the bars chosen, else from the caret to its bar's end, or taken away (ADR 0080). */
  | { readonly type: 'line'; readonly line: Line }
  /** The notes at the caret joined to the same keys' notes after them. */
  | { readonly type: 'tie' }
  | { readonly type: 'chord'; readonly chord: Chord; readonly advance: ChordAdvance }
  | { readonly type: 'writeOut'; readonly played: readonly DraftNote[] }
  | { readonly type: 'backToPattern' }
  /** A take written from the caret's bar (spec 2026-10-05 §4). */
  | { readonly type: 'take'; readonly parts: readonly TakePart[] }
  | { readonly type: 'bars'; readonly edit: BarEdit }
  | { readonly type: 'barLength'; readonly ticks: Tick }
  /** Barlines on the bars chosen, else the caret's (a repeat, an ending, a double or final barline). */
  | { readonly type: 'barMarks'; readonly choice: BarMarkChoice }
  /** A hand's staff changes clef at the caret's bar (ADR 0069). */
  | { readonly type: 'clef'; readonly hand: Hand; readonly clef: Clef }
  | { readonly type: 'sectionKind'; readonly section: number; readonly kind: SectionKind }
  | { readonly type: 'joinSection'; readonly section: number }
  | {
      readonly type: 'sectionPattern'
      readonly section: number
      readonly pattern: PatternId | null
    }
  | {
      readonly type: 'settings'
      readonly key?: Key
      readonly tempo?: number
      readonly meter?: Meter
    }
  | { readonly type: 'undo' }
  | { readonly type: 'redo' }

export const initialEditor = (draft: Draft): EditorState => ({
  draft,
  caret: 0,
  // The top staff in sight: the tune's where the piece shows one, else the right hand's.
  layer: topStaff(draft),
  value: { value: 4, dots: 0, triplet: false },
  chord: false,
  selection: null,
  chordNote: null,
  struck: null,
  clip: null,
  past: [],
  future: [],
})
