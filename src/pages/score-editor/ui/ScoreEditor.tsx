import { ScoreEditorContext } from '../model/editor-context'
import type { EditorTarget } from '../model/editor-target'
import { useEditorShortcutList } from '../model/use-editor-shortcut-list'
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
 * records, the recording strip in place of the dock and the caret's line. A phone on its side has no
 * height for them all in a column: the dock stands beside the sheet, the keys under both.
 */
export function ScoreEditor({ target }: { target: EditorTarget }) {
  const editor = useScoreEditor(target)
  useEditorShortcutList()
  return (
    <ScoreEditorContext value={editor}>
      <div className="flex min-h-0 flex-1 flex-col gap-3 py-2 landscape-phone:grid landscape-phone:grid-cols-[minmax(0,1fr)_minmax(0,18rem)] landscape-phone:grid-rows-[auto_minmax(0,1fr)_auto] landscape-phone:gap-2 landscape-phone:py-1">
        <div className="landscape-phone:col-span-2">
          <EditorToolbar />
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <EditorSheet />
        </div>
        <div className="flex min-h-0 flex-col gap-3 landscape-phone:gap-1 landscape-phone:overflow-y-auto">
          {editor.takes.stage === 'idle' ? (
            <>
              <EditorTools />
              <CaretLine />
            </>
          ) : (
            <RecordingStrip />
          )}
        </div>
        <div className="landscape-phone:col-span-2">
          <EditorKeyboard />
        </div>
      </div>
    </ScoreEditorContext>
  )
}
