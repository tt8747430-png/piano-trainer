import { useEditorState } from '../model/editor-context'
import { ChordTools } from './ChordTools'
import { LayerChoice } from './LayerChoice'
import { NoteTools } from './NoteTools'

/**
 * The tool dock over the keys: what they write (the layer), then that layer's tools in one row,
 * scrolling sideways on a phone and wrapping from a laptop's width, where every tool is in sight.
 */
export function EditorTools() {
  const layer = useEditorState((state) => state.layer)
  return (
    <div className="flex flex-col gap-2">
      <LayerChoice />
      <div className="-mx-gutter flex items-end gap-2 overflow-x-auto px-gutter py-1 scrollbar-none lg:mx-0 lg:flex-wrap lg:overflow-visible lg:px-0">
        {layer === 'chords' ? <ChordTools /> : <NoteTools />}
      </div>
    </div>
  )
}
