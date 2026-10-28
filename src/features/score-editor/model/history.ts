import { placed } from './caret-moves'
import type { Midi, Tick } from '@/shared/lib/music'
import type { Draft, Layer } from './draft'
import { notesAt } from './notes'
import type { EditorState, Snapshot } from './state'

/** How many steps undo goes back. */
const HISTORY = 200

const snapshotOf = ({ draft, caret, layer, grace }: Snapshot): Snapshot => ({
  draft,
  caret,
  layer,
  grace,
})

/**
 * A draft changed: the state before goes on the undo list (unless the change joins the last one), the
 * redo list empties, and the caret stays on the piece. A draft that did not change is no step.
 */
export function commit(
  state: EditorState,
  draft: Draft,
  patch: Partial<EditorState> = {},
  joins = false,
): EditorState {
  const next = { ...state, ...patch }
  if (draft === state.draft) return next
  const caret = placed(draft, next.layer, next.caret)
  return {
    ...next,
    draft,
    caret,
    // A chord's one note chosen stays chosen while the chord at the caret still holds it.
    chordNote: stillChosen(draft, next.layer, caret, next.chordNote),
    // What was chosen stood on the music as it was: an edit ends it unless it keeps or chooses its
    // own (a paste), so Delete after a chord typed takes the chord, never what was chosen before it.
    selection: 'selection' in patch ? (patch.selection ?? null) : null,
    past: joins ? state.past : [...state.past, snapshotOf(state)].slice(-HISTORY),
    future: [],
  }
}

/**
 * The step before brought back (undo), or the one undone last (redo), with its caret, layer and
 * whether its grace notes were chosen.
 */
export function undone(state: EditorState, direction: 'undo' | 'redo'): EditorState {
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
    chordNote: null,
    struck: null,
  }
}

/** A chord's one note, where the chord at the caret still holds it with another. */
function stillChosen(draft: Draft, layer: Layer, caret: Tick, key: Midi | null): Midi | null {
  if (key === null || layer === 'chords') return null
  const chord = notesAt(draft, layer, caret)
  return chord.length > 1 && chord.some((n) => n.midi === key) ? key : null
}
