import { ScoreEditorContext } from '../model/editor-context'
import type { EditorTarget } from '../model/editor-target'
import { useEditorShortcutList } from '../model/use-editor-shortcut-list'
import { useScoreEditor } from '../model/use-score-editor'
import { CaretLine } from './CaretLine'
import { EditorDock } from './EditorDock'
import { EditorKeyboard } from './EditorKeyboard'
import { EditorSheet } from './EditorSheet'
import { EditorToolbar } from './EditorToolbar'
import { EditorTools } from './EditorTools'
import { RecordingStrip } from './RecordingStrip'

/**
 * The score editor (spec §6, ADR 0061): the bar, the sheet scrolling under it, the dock (Undo, Redo,
 * Play, Record), then at the foot the tools (what the keys write, and that layer's tools), the caret's
 * line and the keys; while a take records, the recording strip in place of the tools and the caret's
 * line. A phone on its side gives the sheet the whole height over the keys, the dock standing at its
 * right edge and the bar and the tools in a column beside them (`editor-screen`).
 */
export function ScoreEditor({ target }: { target: EditorTarget }) {
  const editor = useScoreEditor(target)
  useEditorShortcutList()
  return (
    <ScoreEditorContext value={editor}>
      <div className="editor-screen min-h-0 flex-1 gap-3 py-2 landscape-phone:gap-x-3 landscape-phone:gap-y-2 landscape-phone:py-1">
        <div data-area="bar">
          <EditorToolbar />
        </div>
        <div data-area="sheet" className="min-h-0 overflow-y-auto overscroll-contain">
          <EditorSheet />
        </div>
        <div data-area="dock" className="flex justify-center landscape-phone:items-center">
          <EditorDock />
        </div>
        <div
          data-area="tools"
          className="flex min-h-0 flex-col gap-3 landscape-phone:gap-1 landscape-phone:overflow-y-auto landscape-phone:overscroll-contain"
        >
          {editor.takes.stage === 'idle' ? (
            <>
              <EditorTools />
              <CaretLine />
            </>
          ) : (
            <RecordingStrip />
          )}
        </div>
        <div data-area="keys">
          <EditorKeyboard />
        </div>
      </div>
    </ScoreEditorContext>
  )
}
