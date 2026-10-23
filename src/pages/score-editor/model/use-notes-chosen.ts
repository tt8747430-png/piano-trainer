import { chosenNotes } from '@/features/score-editor'
import { useEditorState } from './editor-context'

/** Whether notes are chosen for the palette to act on, not only a place for the next. */
export const useNotesChosen = (): boolean =>
  useEditorState((state) => chosenNotes(state).length > 0)
