import { ScoreEditorContext } from '../model/editor-context'
import type { EditorTarget } from '../model/editor-target'
import { useScoreEditor } from '../model/use-score-editor'
import { CaretLine } from './CaretLine'
import { EditorKeyboard } from './EditorKeyboard'
import { EditorSheet } from './EditorSheet'
import { EditorToolbar } from './EditorToolbar'
import { EditorTools } from './EditorTools'
import { LayerChoice } from './LayerChoice'

/**
 * The score editor (spec §6): the toolbar, what to write, the sheet scrolling between them and the
 * layer's tools, the caret's line and the keys at the foot.
 */
export function ScoreEditor({ target }: { target: EditorTarget }) {
  const editor = useScoreEditor(target)
  return (
    <ScoreEditorContext value={editor}>
      <div className="flex min-h-0 flex-1 flex-col gap-3 py-2">
        <EditorToolbar />
        <LayerChoice />
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <EditorSheet />
        </div>
        <EditorTools />
        <CaretLine />
        <EditorKeyboard />
      </div>
    </ScoreEditorContext>
  )
}
