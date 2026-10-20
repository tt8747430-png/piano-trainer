import { useRef, type CSSProperties } from 'react'
import { selectKeyboard, useSettings } from '@/entities/settings'
import { LANDSCAPE_PHONE, useElementSize, useMediaQuery } from '@/shared/lib'
import { ScoreEditorContext } from '../model/editor-context'
import type { EditorTarget } from '../model/editor-target'
import { useEditorShortcutList } from '../model/use-editor-shortcut-list'
import { useScoreEditor } from '../model/use-score-editor'
import { CaretLine } from './CaretLine'
import { EditorHeader } from './EditorHeader'
import { EditorKeyboard } from './EditorKeyboard'
import { EditorSheet } from './EditorSheet'
import { EditorTools } from './EditorTools'
import { NoteColumn } from './NoteKeys'
import { RecordingStrip } from './RecordingStrip'

/** A laptop's width: the tools a ribbon over the sheet and a column beside it. */
const LAPTOP = '(min-width: 64rem)'

/**
 * The score editor (spec §6, ADR 0064), laid out as a notation app: the bar (Undo, Redo, Play,
 * Record, the view); on a laptop the tools' ribbon over the sheet and the notes' column beside it;
 * on a phone held upright the sheet over a keypad docked at its foot (Sibelius's), on its side the
 * sheet the whole screen under the keypad floating at its corner; the caret's line (under the title
 * on a phone on its side; while a take records, the recording strip); and the keys, at the foot or
 * under the bar as the keyboard settings dock them (`editor-screen`).
 */
export function ScoreEditor({ target }: { target: EditorTarget }) {
  const editor = useScoreEditor(target)
  useEditorShortcutList()
  const onSide = useMediaQuery(LANDSCAPE_PHONE)
  const laptop = useMediaQuery(LAPTOP)
  const idle = editor.takes.stage === 'idle'
  const dock = useSettings((state) => selectKeyboard(state).dock)
  const keypad = useRef<HTMLDivElement>(null)
  const { height } = useElementSize(keypad)
  const room = { '--palette-room': `${height}px` } as CSSProperties
  return (
    <ScoreEditorContext value={editor}>
      <div
        data-keys={dock}
        style={room}
        className="editor-screen min-h-0 flex-1 gap-2 py-2 landscape-phone:gap-x-3 landscape-phone:py-1"
      >
        <div data-area="bar">
          <EditorHeader status={onSide && idle ? <CaretLine /> : undefined} />
        </div>
        {laptop ? (
          <>
            <div data-area="tools">
              <EditorTools variant="ribbon" />
            </div>
            <div data-area="column">
              <NoteColumn />
            </div>
          </>
        ) : null}
        <div data-area="sheet" className="min-h-0 overflow-y-auto overscroll-contain">
          <EditorSheet />
        </div>
        {onSide && idle ? null : (
          <div data-area="status" className="flex min-h-6 flex-col justify-center">
            {idle ? <CaretLine /> : <RecordingStrip />}
          </div>
        )}
        {laptop ? null : (
          <div ref={keypad} data-area="dock">
            <EditorTools variant="dock" />
          </div>
        )}
        <EditorKeyboard />
      </div>
    </ScoreEditorContext>
  )
}
