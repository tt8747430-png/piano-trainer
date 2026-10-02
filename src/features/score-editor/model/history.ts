import { placed } from './caret-moves'
import type { Draft } from './draft'
import type { EditorState, Snapshot } from './state'

/** How many steps undo goes back. */
const HISTORY = 200

const snapshotOf = ({ draft, caret, layer }: Snapshot): Snapshot => ({ draft, caret, layer })

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
  return {
    ...next,
    draft,
    caret: placed(draft, next.layer, next.caret),
    past: joins ? state.past : [...state.past, snapshotOf(state)].slice(-HISTORY),
    future: [],
  }
}

/** The step before brought back (undo), or the one undone last (redo), with its caret and layer. */
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
    struck: null,
  }
}
