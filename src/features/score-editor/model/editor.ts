import type { PatternId } from '@/entities/pattern'
import type { SectionKind } from '@/entities/piece'
import {
  isCompound,
  nameChords,
  readChordSymbol,
  TICKS_PER_BEAT,
  type Chord,
  type Finger,
  type Key,
  type Midi,
  type Tick,
} from '@/shared/lib/music'
import {
  copyBars,
  deleteBars,
  insertBar,
  joinLine,
  newLine,
  pasteBars,
  setBarTicks,
  type BarRange,
  type Clip,
} from './bars'
import { nextCaret, snapToChord } from './caret'
import { deleteChord, setChord } from './chords'
import type { Draft, DraftNote, Layer } from './draft'
import {
  addToChord,
  backToPattern,
  deleteNotes,
  respellNotes,
  setFinger,
  shiftNotes,
  writeNotes,
  writeOut,
  writeRest,
} from './notes'
import { joinSection, newSection, setSectionKind } from './sections'
import { setKey, setPattern, setTempo } from './settings'
import { barAt, barsOf, totalTicks } from './timeline'
import { valueTicks, type NoteValue } from './values'

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

/** The keys of one entry: those struck together go into it (spec §6.3). */
interface Entry {
  readonly at: Tick
  /** When its first key went down, in milliseconds. */
  readonly time: number
  readonly keys: readonly Midi[]
  readonly layer: Layer
  /** Whether it has changed the draft yet: then a key joining it is no new undo step. */
  readonly written: boolean
}

export interface EditorState extends Snapshot {
  readonly value: NoteValue
  /** Chord: a key played joins the notes at the caret, which stays. */
  readonly chord: boolean
  readonly selection: Selection | null
  readonly entry: Entry | null
  readonly clip: Clip | null
  readonly past: readonly Snapshot[]
  readonly future: readonly Snapshot[]
}

export type BarEdit =
  'insert' | 'delete' | 'copy' | 'cut' | 'paste' | 'newLine' | 'joinLine' | 'newSection'

export type EditorAction =
  | { readonly type: 'layer'; readonly layer: Layer }
  | { readonly type: 'value'; readonly value: NoteValue['value'] }
  | { readonly type: 'dot' }
  | { readonly type: 'triplet' }
  | { readonly type: 'chordMode' }
  | {
      readonly type: 'move'
      readonly by: 'step' | 'bar' | 'end'
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
  | { readonly type: 'delete' }
  | { readonly type: 'shift'; readonly semitones: number }
  | { readonly type: 'respell' }
  | { readonly type: 'finger'; readonly midi: Midi; readonly finger: Finger | null }
  | { readonly type: 'chord'; readonly chord: Chord; readonly advance: 'stay' | 'beat' | 'bar' }
  | { readonly type: 'writeOut'; readonly played: readonly DraftNote[] }
  | { readonly type: 'backToPattern' }
  | { readonly type: 'bars'; readonly edit: BarEdit }
  | { readonly type: 'barLength'; readonly ticks: Tick }
  | { readonly type: 'sectionKind'; readonly section: number; readonly kind: SectionKind }
  | { readonly type: 'joinSection'; readonly section: number }
  | {
      readonly type: 'settings'
      readonly key?: Key
      readonly tempo?: number
      readonly pattern?: PatternId
    }
  | { readonly type: 'undo' }
  | { readonly type: 'redo' }

/** Keys going down within this many milliseconds of an entry's first are struck together. */
export const STRUCK_TOGETHER_MS = 80
const HISTORY = 200

export const initialEditor = (draft: Draft): EditorState => ({
  draft,
  caret: 0,
  layer: 'chords',
  value: { value: 4, dots: 0, triplet: false },
  chord: false,
  selection: null,
  entry: null,
  clip: null,
  past: [],
  future: [],
})

const snapshotOf = ({ draft, caret, layer }: Snapshot): Snapshot => ({ draft, caret, layer })

/** The caret kept on the piece, and on the chords' places there. */
function placed(draft: Draft, layer: Layer, caret: Tick): Tick {
  const kept = Math.max(0, Math.min(caret, totalTicks(draft)))
  return layer === 'chords' ? snapToChord(draft, kept) : kept
}

/**
 * A draft changed: the state before goes on the undo list (unless the change joins the last one), the
 * redo list empties, and the caret stays on the piece.
 */
function commit(
  state: EditorState,
  draft: Draft,
  patch: Partial<EditorState> = {},
  joins = false,
): EditorState {
  const next = { ...state, ...patch }
  if (draft === state.draft) return next
  return {
    ...next,
    draft,
    caret: placed(draft, next.layer, next.caret),
    past: joins ? state.past : [...state.past, snapshotOf(state)].slice(-HISTORY),
    future: [],
  }
}

/** The bars an edit of the form acts on: those chosen, else the caret's. */
function chosenBars(state: EditorState): BarRange {
  if (state.selection) {
    const { anchor, head } = state.selection
    return { from: Math.min(anchor, head), to: Math.max(anchor, head) }
  }
  const { index } = barAt(state.draft, state.caret)
  return { from: index, to: index }
}

const startOf = (draft: Draft, index: number): Tick => {
  const bars = barsOf(draft)
  return (bars[Math.min(index, bars.length - 1)] ?? bars[0])?.start ?? 0
}

/** The chord the keys make, as a chart writes it; none for fewer than three notes or no chord. */
function chordOfKeys(keys: readonly Midi[]): Chord | undefined {
  for (const found of nameChords([...keys].sort((a, b) => a - b))) {
    const chord = readChordSymbol(found.symbol)
    if (chord) return chord
  }
  return undefined
}

function move(
  state: EditorState,
  by: 'step' | 'bar' | 'end',
  direction: -1 | 1,
  extend: boolean,
): EditorState {
  const { draft, layer, caret } = state
  const bars = barsOf(draft)
  let target: Tick
  if (by === 'step') {
    target = nextCaret(draft, layer, caret, valueTicks(state.value, draft.meter), direction)
  } else if (by === 'end') {
    target = direction < 0 ? 0 : totalTicks(draft)
  } else {
    const here = barAt(draft, caret)
    target =
      direction > 0
        ? (bars[here.index + 1]?.start ?? (layer === 'chords' ? caret : totalTicks(draft)))
        : caret > here.start
          ? here.start
          : (bars[here.index - 1]?.start ?? 0)
  }
  const next = placed(draft, layer, target)
  const selection =
    extend && layer === 'chords'
      ? {
          anchor: state.selection?.anchor ?? barAt(draft, caret).index,
          head: barAt(draft, next).index,
        }
      : null
  return { ...state, caret: next, selection, entry: null }
}

/** A key played: written as a note or chord, or named as a chord in the chords. */
function played(state: EditorState, key: Midi, time: number): EditorState {
  const { draft, layer, caret, entry } = state
  const joining =
    entry !== null &&
    entry.layer === layer &&
    time - entry.time <= STRUCK_TOGETHER_MS &&
    (layer === 'chords' ? entry.at === caret : true)
  if (layer === 'chords') {
    const keys = joining ? [...entry.keys, key] : [key]
    const chord = chordOfKeys(keys)
    const before = joining && entry.written
    const nextEntry: Entry = {
      at: caret,
      time: joining ? entry.time : time,
      keys,
      layer,
      written: before || chord !== undefined,
    }
    if (!chord) return { ...state, entry: nextEntry }
    const bar = barAt(draft, caret)
    return commit(
      state,
      setChord(draft, bar.index, caret - bar.start, chord),
      { entry: nextEntry },
      before,
    )
  }
  const ticks = valueTicks(state.value, draft.meter)
  if (state.chord) {
    return commit(state, addToChord(draft, layer, caret, key, ticks), { entry: null })
  }
  if (joining) {
    return commit(
      state,
      addToChord(draft, layer, entry.at, key, ticks),
      { entry: { ...entry, keys: [...entry.keys, key] } },
      true,
    )
  }
  const result = writeNotes(draft, layer, caret, [key], ticks)
  return commit(state, result.draft, {
    caret: result.end,
    entry: { at: caret, time, keys: [key], layer, written: true },
  })
}

function chordAt(state: EditorState, chord: Chord, advance: 'stay' | 'beat' | 'bar'): EditorState {
  const caret = snapToChord(state.draft, state.caret)
  const bar = barAt(state.draft, caret)
  const set = setChord(state.draft, bar.index, caret - bar.start, chord)
  if (advance === 'stay') return commit(state, set, { entry: null })
  if (advance === 'beat') {
    return commit(state, set, {
      caret: nextCaret(set, 'chords', caret, TICKS_PER_BEAT, 1),
      entry: null,
    })
  }
  const last = bar.index === barsOf(set).length - 1
  const grown = last ? insertBar(set, bar.index) : set
  return commit(state, grown, { caret: startOf(grown, bar.index + 1), entry: null })
}

function barsEdited(state: EditorState, edit: BarEdit): EditorState {
  const { draft } = state
  const range = chosenBars(state)
  switch (edit) {
    case 'insert': {
      const next = insertBar(draft, range.to)
      return commit(state, next, { caret: startOf(next, range.to + 1), selection: null })
    }
    case 'delete': {
      const next = deleteBars(draft, range)
      return commit(state, next, { caret: startOf(next, range.from), selection: null })
    }
    case 'copy':
      return { ...state, clip: copyBars(draft, range) }
    case 'cut': {
      const next = deleteBars(draft, range)
      return commit(state, next, {
        clip: copyBars(draft, range),
        caret: startOf(next, range.from),
        selection: null,
      })
    }
    case 'paste': {
      if (!state.clip) return state
      const next = pasteBars(draft, range.to, state.clip)
      const first = range.to + 1
      return commit(state, next, {
        caret: startOf(next, first),
        selection: { anchor: first, head: first + state.clip.bars.length - 1 },
      })
    }
    case 'newLine':
      return commit(state, newLine(draft, range.from), { selection: null })
    case 'joinLine':
      return commit(state, joinLine(draft, range.from), { selection: null })
    case 'newSection':
      return commit(state, newSection(draft, range.from), { selection: null })
  }
}

function undone(state: EditorState, direction: 'undo' | 'redo'): EditorState {
  const from = direction === 'undo' ? state.past : state.future
  const back = from.at(direction === 'undo' ? -1 : 0)
  if (!back) return state
  const now = snapshotOf(state)
  return {
    ...state,
    ...back,
    past: direction === 'undo' ? state.past.slice(0, -1) : [...state.past, now],
    future: direction === 'undo' ? [now, ...state.future] : state.future.slice(1),
    selection: null,
    entry: null,
  }
}

/** The editor's state after an action (spec §6). */
export function reduce(state: EditorState, action: EditorAction): EditorState {
  const { draft, layer, caret } = state
  switch (action.type) {
    case 'layer':
      return {
        ...state,
        layer: action.layer,
        caret: placed(draft, action.layer, caret),
        selection: null,
        entry: null,
      }
    case 'value':
      return { ...state, value: { ...state.value, value: action.value }, entry: null }
    case 'dot':
      return { ...state, value: { ...state.value, dots: state.value.dots === 1 ? 0 : 1 } }
    case 'triplet':
      return isCompound(draft.meter)
        ? state
        : { ...state, value: { ...state.value, triplet: !state.value.triplet } }
    case 'chordMode':
      return { ...state, chord: !state.chord, entry: null }
    case 'move':
      return move(state, action.by, action.direction, action.extend ?? false)
    case 'place': {
      const next = placed(draft, action.layer, action.tick)
      const selection =
        action.extend && action.layer === 'chords'
          ? {
              anchor: state.selection?.anchor ?? barAt(draft, caret).index,
              head: barAt(draft, next).index,
            }
          : null
      return { ...state, layer: action.layer, caret: next, selection, entry: null }
    }
    case 'key':
      return played(state, action.key, action.time)
    case 'rest': {
      if (layer === 'chords') return state
      const result = writeRest(draft, layer, caret, valueTicks(state.value, draft.meter))
      return commit(state, result.draft, { caret: result.end, entry: null })
    }
    case 'delete': {
      if (layer !== 'chords')
        return commit(state, deleteNotes(draft, layer, caret), { entry: null })
      if (state.selection) return barsEdited(state, 'delete')
      const bar = barAt(draft, caret)
      return commit(state, deleteChord(draft, bar.index, caret - bar.start), { entry: null })
    }
    case 'shift':
      return layer === 'chords'
        ? state
        : commit(state, shiftNotes(draft, layer, caret, action.semitones), { entry: null })
    case 'respell':
      return layer === 'chords'
        ? state
        : commit(state, respellNotes(draft, layer, caret), { entry: null })
    case 'finger':
      return layer === 'rh' || layer === 'lh'
        ? commit(state, setFinger(draft, layer, caret, action.midi, action.finger))
        : state
    case 'chord':
      return chordAt(state, action.chord, action.advance)
    case 'writeOut':
      return layer === 'rh' || layer === 'lh'
        ? commit(state, writeOut(draft, layer, barAt(draft, caret).index, action.played))
        : state
    case 'backToPattern':
      return layer === 'rh' || layer === 'lh'
        ? commit(state, backToPattern(draft, layer, barAt(draft, caret).index))
        : state
    case 'bars':
      return barsEdited(state, action.edit)
    case 'barLength':
      return commit(state, setBarTicks(draft, barAt(draft, caret).index, action.ticks))
    case 'sectionKind':
      return commit(state, setSectionKind(draft, action.section, action.kind))
    case 'joinSection':
      return commit(state, joinSection(draft, action.section))
    case 'settings': {
      let next = draft
      if (action.key) next = setKey(next, action.key)
      if (action.tempo !== undefined) next = setTempo(next, action.tempo)
      if (action.pattern) next = setPattern(next, action.pattern)
      return commit(state, next)
    }
    case 'undo':
    case 'redo':
      return undone(state, action.type)
  }
}
