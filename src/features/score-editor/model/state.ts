import type { SectionKind } from '@/entities/piece'
import type { Chord, Finger, Key, Meter, Midi, Tick } from '@/shared/lib/music'
import type { Clip } from './bars'
import type { Draft, DraftNote, Layer } from './draft'
import type { TakePart } from './take-edits'
import type { MarkChoice } from './marks'
import type { ChosenValue, Dots } from './values'

/** What undo and redo bring back. */
export interface Snapshot {
  readonly draft: Draft
  readonly caret: Tick
  readonly layer: Layer
}

/** Bars chosen with Shift: where the choice began and where it reaches. */
export interface Selection {
  readonly anchor: number
  readonly head: number
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
  readonly struck: Struck | null
  readonly clip: Clip | null
  readonly past: readonly Snapshot[]
  readonly future: readonly Snapshot[]
}

export type BarEdit =
  'insert' | 'delete' | 'copy' | 'cut' | 'paste' | 'newLine' | 'joinLine' | 'newSection'

/** How far the caret moves: a step of the value (or to the next place), a bar, or to an end. */
export type CaretMove = 'step' | 'bar' | 'end'

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
    }
  | { readonly type: 'key'; readonly key: Midi; readonly time: number }
  | { readonly type: 'rest' }
  /** The notes or chord at the caret; with `back`, else the ones before it (Backspace). */
  | { readonly type: 'delete'; readonly back?: boolean }
  /** The notes at the caret moved by notes of the key: a note dragged on its staff. */
  | { readonly type: 'step'; readonly steps: number }
  /** The tune's staff added over the grand staff, or taken away with its notes (ADR 0064). */
  | { readonly type: 'melodyStaff'; readonly on: boolean }
  | { readonly type: 'shift'; readonly semitones: number }
  | { readonly type: 'respell' }
  | { readonly type: 'finger'; readonly midi: Midi; readonly finger: Finger | null }
  /** A mark put on the notes at the caret, or those of the bars chosen, or taken off them all (ADR 0063). */
  | { readonly type: 'mark'; readonly mark: MarkChoice }
  /** The notes at the caret joined to the same keys' notes after them. */
  | { readonly type: 'tie' }
  | { readonly type: 'chord'; readonly chord: Chord; readonly advance: ChordAdvance }
  | { readonly type: 'writeOut'; readonly played: readonly DraftNote[] }
  | { readonly type: 'backToPattern' }
  /** A take written from the caret's bar (spec 2026-10-05 §4). */
  | { readonly type: 'take'; readonly parts: readonly TakePart[] }
  | { readonly type: 'bars'; readonly edit: BarEdit }
  | { readonly type: 'barLength'; readonly ticks: Tick }
  | { readonly type: 'sectionKind'; readonly section: number; readonly kind: SectionKind }
  | { readonly type: 'joinSection'; readonly section: number }
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
  // The tune where the piece has a staff for it, else the right hand.
  layer: draft.melodyStaff ? 'melody' : 'rh',
  value: { value: 4, dots: 0, triplet: false },
  chord: false,
  selection: null,
  struck: null,
  clip: null,
  past: [],
  future: [],
})
