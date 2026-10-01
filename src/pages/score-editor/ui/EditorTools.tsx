import { useEditorState } from '../model/editor-context'
import { ChordTools } from './ChordTools'
import { NoteTools } from './NoteTools'

/** The layer's tools in one row over the keys, scrolling sideways where the screen is narrow. */
export function EditorTools() {
  const layer = useEditorState((state) => state.layer)
  return (
    <div className="-mx-4 flex items-end gap-2 overflow-x-auto px-4 py-1 scrollbar-none">
      {layer === 'chords' ? <ChordTools /> : <NoteTools />}
    </div>
  )
}
