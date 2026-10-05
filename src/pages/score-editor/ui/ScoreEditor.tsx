import { ScoreEditorContext } from '../model/editor-context'
import type { EditorTarget } from '../model/editor-target'
import { useScoreEditor } from '../model/use-score-editor'
import { CaretLine } from './CaretLine'
import { EditorKeyboard } from './EditorKeyboard'
import { EditorSheet } from './EditorSheet'
import { EditorToolbar } from './EditorToolbar'
import { EditorTools } from './EditorTools'
import { RecordingStrip } from './RecordingStrip'

/**
 * The score editor (spec §6): the toolbar, the sheet scrolling under it, then at the foot the tool
 * dock (what the keys write, and that layer's tools), the caret's line and the keys; while a take
 * records, the recording strip in place of the dock and the caret's line.
 */
export function ScoreEditor({ target }: { target: EditorTarget }) {
  const editor = useScoreEditor(target)
  return (
    <ScoreEditorContext value={editor}>
      <div className="flex min-h-0 flex-1 flex-col gap-3 py-2">
        <EditorToolbar />
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <EditorSheet />
        </div>
        {editor.takes.stage === 'idle' ? (
          <>
            <EditorTools />
            <CaretLine />
          </>
        ) : (
          <RecordingStrip />
        )}
        <EditorKeyboard />
      </div>
    </ScoreEditorContext>
  )
}
