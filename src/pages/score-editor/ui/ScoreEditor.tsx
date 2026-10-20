import { useRef, type CSSProperties } from 'react'
import { selectKeyboard, useSettings } from '@/entities/settings'
import { useElementSize } from '@/shared/lib'
import { ScoreEditorContext } from '../model/editor-context'
import type { EditorTarget } from '../model/editor-target'
import { useEditorShortcutList } from '../model/use-editor-shortcut-list'
import { useScoreEditor } from '../model/use-score-editor'
import { CaretLine } from './CaretLine'
import { EditorKeyboard } from './EditorKeyboard'
import { EditorPalette } from './EditorPalette'
import { EditorSheet } from './EditorSheet'
import { EditorToolbar } from './EditorToolbar'
import { RecordingStrip } from './RecordingStrip'

/**
 * The score editor (spec §6): the bar (Play and Record among its buttons), the sheet filling the
 * screen, the caret's line (while a take records, the recording strip) and the keys, at the foot or
 * under the bar as the keyboard settings dock them. The tools are a notation app's palette: on a
 * phone floating over the sheet's corner, the sheet scrolling clear of it; beside the sheet on a
 * phone on its side and on a laptop (`editor-screen`).
 */
export function ScoreEditor({ target }: { target: EditorTarget }) {
  const editor = useScoreEditor(target)
  useEditorShortcutList()
  const dock = useSettings((state) => selectKeyboard(state).dock)
  const palette = useRef<HTMLDivElement>(null)
  const { height } = useElementSize(palette)
  const room = { '--palette-room': `${height}px` } as CSSProperties
  return (
    <ScoreEditorContext value={editor}>
      <div
        data-keys={dock}
        style={room}
        className="editor-screen min-h-0 flex-1 gap-2 py-2 landscape-phone:gap-x-3 landscape-phone:py-1"
      >
        <div data-area="bar">
          <EditorToolbar />
        </div>
        <div data-area="sheet" className="min-h-0 overflow-y-auto overscroll-contain">
          <EditorSheet />
        </div>
        <div data-area="status" className="flex min-h-6 flex-col justify-center">
          {editor.takes.stage === 'idle' ? <CaretLine /> : <RecordingStrip />}
        </div>
        <div ref={palette} data-area="palette">
          <EditorPalette />
        </div>
        <EditorKeyboard />
      </div>
    </ScoreEditorContext>
  )
}
