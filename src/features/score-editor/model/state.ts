import type { BarMarkChoice } from './bar-marks'
import type { SectionKind } from '@/entities/piece'
import type { Chord, Clef, Finger, Key, Midi, TempoUnit, Tick } from '@/shared/lib/music'
import type { Clip } from './clip'
import type { Draft, Layer, NoteLayer } from './draft'
import { topStaff } from './rows'
import type { TakePart } from './take-edits'
import type { Line } from './lines'
import type { MarkChoice } from './marks'
import type { TransposeApplies } from './settings'
import type { ChosenValue, Dots } from './values'
import type { TimeChoice } from './meters'

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
 * Notes chosen with Shift (ADR 0096), as a notation app chooses a range: the note (or chord, or empty
 * place) where the choice began and the one it reaches, both inside it.
 */
export interface Selection {
  readonly anchor: TickSpan
  readonly head: TickSpan
}

/** Keys struck together, written as one entry. */
export interface Struck {
  readonly at: Tick
  /** When its first key went down, in milliseconds. */
  readonly time: number
  readonly keys: readonly Midi[]
  readonly layer: Layer
  /** Whether it has changed the draft yet: then a key joining it is no new undo step. */
  readonly written: boolean
}

/**
 * How a key played is written at the caret (ADR 0114, Flat's editing modes): Replace, over what is
 * there; Insert, pushing the staff's later notes right, and Delete closing the gap; Chord, joining
 * the chord there, the caret staying.
 */
export type EditMode = 'replace' | 'insert' | 'chord'
export const EDIT_MODES = ['replace', 'insert', 'chord'] as const satisfies readonly EditMode[]

/** The mode after `mode`, round: what I cycles. */
export const nextMode = (mode: EditMode): EditMode =>
  EDIT_MODES[(EDIT_MODES.indexOf(mode) + 1) % EDIT_MODES.length] ?? 'replace'

export interface EditorState extends Snapshot {
  readonly value: ChosenValue
  readonly mode: EditMode
  readonly selection: Selection | null
  /** One note of the chord at the caret chosen alone, by its key (ADR 0096): else the whole chord. */
  readonly chordNote: Midi | null
  readonly struck: Struck | null
  readonly clip: Clip | null
  readonly past: readonly Snapshot[]
  readonly future: readonly Snapshot[]
}

export type BarEdit = 'insert' | 'insertBefore' | 'delete' | 'newLine' | 'joinLine' | 'newSection'

/** The clipboard's edits, on what is chosen (ADR 0114): the bars in the chord row, the notes on a staff. */
export type ClipEdit = 'copy' | 'cut' | 'paste'

/** How far the caret moves: a step of the value (or to the next place), a bar, or to an end. */
export type CaretMove = 'step' | 'bar' | 'line' | 'end'

export type EditorAction =
  | { readonly type: 'layer'; readonly layer: Layer }
  | { readonly type: 'value'; readonly value: ChosenValue['value'] }
  | { readonly type: 'dot'; readonly dots?: Dots }
  | { readonly type: 'triplet' }
  /** The editing mode chosen; none, the next round (I). */
  | { readonly type: 'mode'; readonly mode?: EditMode }
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
      /** One note of the chord there, clicked on its head (ADR 0096). */
      readonly key?: Midi
    }
  /** What is chosen let go: the notes chosen, a chord's one note (Escape). */
  | { readonly type: 'deselect' }
  /**
   * The note over (1) or under (−1) the one chosen in the chord at the caret, the chord's top or foot
   * from the whole chord; past its last, the staff over or under (Alt ↑ ↓, ADR 0096).
   */
  | { readonly type: 'chordNote'; readonly direction: -1 | 1 }
  | { readonly type: 'key'; readonly key: Midi; readonly time: number }
  | { readonly type: 'rest' }
  /**
   * The notes chosen, a chord's one note, else the notes or chord at the caret; with `back`, where
   * none is there, the ones before it (Backspace).
   */
  | { readonly type: 'delete'; readonly back?: boolean }
  /** The notes chosen (else at the caret) moved by notes of the key: ↑ ↓, or a note dragged on its staff. */
  | { readonly type: 'step'; readonly steps: number; readonly joins?: boolean }
  /**
   * A single staff added at a place top down (ADR 0097): over a staff, or after the last, over the
   * piano; the caret goes to it.
   */
  | { readonly type: 'addStaff'; readonly place: number }
  /** A single staff taken away with its notes (ADR 0097); Undo brings them back. */
  | { readonly type: 'removeStaff'; readonly place: number }
  /** A single staff's printed name as typed (ADR 0097): an empty one takes it away. */
  | { readonly type: 'renameStaff'; readonly place: number; readonly name: string }
  /** The piano's grand staff hidden, a lead sheet, its music kept and played, or shown (ADR 0114). */
  | { readonly type: 'piano'; readonly hidden: boolean }
  | { readonly type: 'shift'; readonly semitones: number }
  | { readonly type: 'respell' }
  /** A grace note before each note chosen, a step above in the key; taken off where they all have one. */
  | { readonly type: 'grace' }
  /**
   * The notes chosen written on their letter ♯ (1), ♭ (−1) or ♮ (0); where every one carries the
   * sign already, taken off, each spelled as its key spells it (ADR 0114).
   */
  | { readonly type: 'accidental'; readonly accidental: -1 | 0 | 1 }
  /**
   * Fingers on the notes at the caret in a hand, bottom up, or on the chord's one note chosen, as
   * the fingering field writes them (ADR 0096); none takes them off.
   */
  | { readonly type: 'fingers'; readonly fingers: readonly Finger[] }
  /** A mark put on the notes chosen (else at the caret), or taken off them all (ADR 0097). */
  | { readonly type: 'mark'; readonly mark: MarkChoice }
  /** A line drawn over the notes chosen, else from the caret to its bar's end, or taken away (ADR 0114). */
  | { readonly type: 'line'; readonly line: Line }
  /**
   * What the tune's note at the caret sings in a verse, as the Lyrics field writes it (ADR 0097):
   * `-` where the word goes on, `_` holding it over the next notes, nothing for silence.
   */
  | { readonly type: 'syllable'; readonly verse: number; readonly text: string }
  /** The notes at the caret joined to the same keys' notes after them. */
  | { readonly type: 'tie' }
  /** A chord set at the caret's place in the chords (the chord-symbol field's), the caret staying. */
  | { readonly type: 'chord'; readonly chord: Chord }
  /** A take written from the caret's bar. */
  | { readonly type: 'take'; readonly parts: readonly TakePart[] }
  | { readonly type: 'bars'; readonly edit: BarEdit }
  | { readonly type: 'clip'; readonly edit: ClipEdit }
  | { readonly type: 'barLength'; readonly ticks: Tick }
  /** Barlines on the bars chosen, else the caret's (a repeat, an ending, a double or final barline). */
  | { readonly type: 'barMarks'; readonly choice: BarMarkChoice }
  /**
   * A staff's clef (a clef's on the sheet, else the caret's staff from the first bar chosen): a
   * hand's staff changes clef from that bar on (ADR 0097), a single staff is written in it whole
   * (ADR 0097).
   */
  | { readonly type: 'clef'; readonly staff: NoteLayer; readonly clef: Clef; readonly bar: number }
  | { readonly type: 'sectionKind'; readonly section: number; readonly kind: SectionKind }
  | { readonly type: 'joinSection'; readonly section: number }
  /**
   * A key change from a bar's section on (ADR 0114): the first bar chosen's, or a key signature's on
   * the sheet (ADR 0114).
   */
  | { readonly type: 'sectionKey'; readonly bar: number; readonly key: Key }
  /**
   * A time signature from a bar's section on (ADR 0097, 0114): the first bar chosen's, or a time
   * signature's on the sheet; at the song's first section the whole song's, with its C and pickup.
   */
  | { readonly type: 'time'; readonly bar: number; readonly time: TimeChoice }
  | {
      readonly type: 'settings'
      readonly key?: Key
      readonly tempo?: number
    }
  /** The tempo mark as its picker sets it: a number of a note a minute (ADR 0114). */
  | { readonly type: 'tempo'; readonly mark: number; readonly unit: TempoUnit }
  /** The music moved by semitones, the key and the chord symbols with it as asked (ADR 0115). */
  | {
      readonly type: 'transpose'
      readonly semitones: number
      readonly applies: TransposeApplies
    }
  /** The title printed at the sheet's head, given anew (ADR 0114): an empty one changes nothing. */
  | { readonly type: 'title'; readonly title: string }
  | { readonly type: 'undo' }
  | { readonly type: 'redo' }

export const initialEditor = (draft: Draft): EditorState => ({
  draft,
  caret: 0,
  // The top staff: the top single staff's where the score has one, else the right hand's.
  layer: topStaff(draft),
  value: { value: 4, dots: 0, triplet: false },
  mode: 'replace',
  selection: null,
  chordNote: null,
  struck: null,
  clip: null,
  past: [],
  future: [],
})
