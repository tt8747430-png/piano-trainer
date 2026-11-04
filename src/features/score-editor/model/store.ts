import { createStore, type StoreApi } from 'zustand/vanilla'
import type { Draft } from './draft'
import { reduce } from './editor'
import { initialEditor, type EditMode, type EditorAction, type EditorState } from './state'

/** An editor's visit: its state, and the one way to change it. */
export interface EditorStore extends StoreApi<EditorState> {
  dispatch(action: EditorAction): void
  /** Opens on another draft afresh (another tab saved the music): nothing to undo, nothing saved. */
  replace(draft: Draft): void
}

/**
 * The editor's state for one visit, opening in `mode` (the learner's Input mode on opening);
 * `onChange` hears each draft an action makes (to save it).
 */
export function createEditorStore(
  draft: Draft,
  onChange: (draft: Draft) => void,
  mode?: EditMode,
): EditorStore {
  const store = createStore<EditorState>()(() => initialEditor(draft, mode))
  return {
    ...store,
    dispatch(action) {
      const before = store.getState()
      const after = reduce(before, action)
      if (after === before) return
      store.setState(after, true)
      if (after.draft !== before.draft) onChange(after.draft)
    },
    replace(next) {
      store.setState(initialEditor(next, store.getState().mode), true)
    },
  }
}
