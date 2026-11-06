import { chosenBars, clefAt } from '@/features/score-editor'
import { useEditorState } from './editor-context'

/**
 * The staff and bars the palette's Clef changes (R32-C, Flat's): the caret's staff from the first bar
 * chosen (a clef tapped on the score chooses its bar and staff); a range of bars chosen ends at `to`,
 * else the clef holds until the next one.
 */
export function useClefAt() {
  const staff = useEditorState((state) => (state.layer === 'chords' ? null : state.layer))
  const bar = useEditorState((state) => chosenBars(state).from)
  const to = useEditorState((state) => (state.selection ? chosenBars(state).to : undefined))
  const current = useEditorState((state) => (staff ? clefAt(state.draft, bar, staff) : null))
  return { staff, bar, to, current }
}
