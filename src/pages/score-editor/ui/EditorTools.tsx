import { useEditorState } from '../model/editor-context'
import { ChordTools } from './ChordTools'
import { NoteTools } from './NoteTools'

/**
 * The tools over the keys: those of where the caret writes (a click on the sheet chooses: the chord
 * row, the treble staff or the bass staff), wrapping and never scrolling sideways: two rows on a
 * phone, six across in the column of a phone on its side, every tool in sight on a laptop.
 */
export function EditorTools() {
  const layer = useEditorState((state) => state.layer)
  return (
    <div className="flex flex-wrap items-end gap-1 lg:gap-2">
      {layer === 'chords' ? <ChordTools /> : <NoteTools />}
    </div>
  )
}
