import { useEditorState } from '../model/editor-context'
import { ChordTools } from './ChordTools'
import { NoteTools } from './NoteTools'

/**
 * The layer's tools over the keys: one row scrolling sideways on a phone, wrapping onto a second from
 * a laptop's width, where every tool is in sight.
 */
export function EditorTools() {
  const layer = useEditorState((state) => state.layer)
  return (
    <div className="-mx-4 flex items-end gap-2 overflow-x-auto px-4 py-1 scrollbar-none lg:mx-0 lg:flex-wrap lg:overflow-visible lg:px-0">
      {layer === 'chords' ? <ChordTools /> : <NoteTools />}
    </div>
  )
}
