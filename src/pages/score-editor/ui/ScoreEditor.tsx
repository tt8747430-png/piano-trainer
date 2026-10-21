import { Music } from 'lucide-react'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { selectKeyboard, selectPaletteSide, useSettings } from '@/entities/settings'
import { LANDSCAPE_PHONE, useElementSize, useMediaQuery } from '@/shared/lib'
import { FabPill } from '@/shared/ui'
import { ScoreEditorContext } from '../model/editor-context'
import type { EditorTarget } from '../model/editor-target'
import { useEditorShortcutList } from '../model/use-editor-shortcut-list'
import { useScoreEditor } from '../model/use-score-editor'
import { CaretLine } from './CaretLine'
import { EditorHeader } from './EditorHeader'
import { EditorKeyboard, KeysButton } from './EditorKeyboard'
import { EditorSheet } from './EditorSheet'
import { EditorTools } from './EditorTools'
import { RecordingStrip } from './RecordingStrip'

/** A laptop's width: the palette a column beside the sheet. */
const LAPTOP = '(min-width: 64rem)'

/**
 * The score editor (spec §6, ADR 0064, 0065), laid out as a notation app, one screen that never
 * scrolls as a whole: the bar (Undo, Redo, Play, Record, the view); the sheet, the one part that
 * scrolls; the caret's line (in the bar on a phone on its side; while a take records, the recording
 * strip); the palette, a card of one size whatever its tab, at the foot on a phone held upright and
 * a tablet, a column beside the sheet on a laptop and a phone on its side; and the keys, at the foot
 * under the palette or under the bar as the keyboard settings dock them (`editor-screen`). Folded,
 * the palette and the keys leave their room to the sheet, each a button floating over its corner.
 */
export function ScoreEditor({ target }: { target: EditorTarget }) {
  const { t } = useTranslation('editor')
  const editor = useScoreEditor(target)
  useEditorShortcutList()
  const onSide = useMediaQuery(LANDSCAPE_PHONE)
  const side = useMediaQuery(LAPTOP) || onSide
  const idle = editor.takes.stage === 'idle'
  const dock = useSettings((state) => selectKeyboard(state).dock)
  const paletteSide = useSettings(selectPaletteSide)
  const [palette, setPalette] = useState(true)
  // The sheet's height on a phone on its side, where it is short: a line is drawn to fit it whole.
  const sheet = useRef<HTMLDivElement>(null)
  const { height: room } = useElementSize(sheet)
  return (
    <ScoreEditorContext value={editor}>
      <div
        data-keys={dock}
        data-palette={palette ? (side ? 'side' : 'foot') : 'folded'}
        data-side={paletteSide}
        className="editor-screen min-h-0 flex-1 gap-2 py-2 landscape-phone:gap-1.5 landscape-phone:py-1"
      >
        <div data-area="bar">
          <EditorHeader status={onSide && idle ? <CaretLine /> : undefined} />
        </div>
        <div ref={sheet} data-area="sheet" className="min-h-0 overflow-y-auto overscroll-contain">
          <EditorSheet room={onSide ? room : undefined} />
          {/* Room past the last line, so it scrolls clear of the buttons floating over the corners. */}
          <div aria-hidden className="h-14" />
        </div>
        <div data-area="float">
          <KeysButton />
          {palette ? null : (
            <FabPill
              label={t('palette.open')}
              icon={Music}
              onClick={() => setPalette(true)}
              className={side && paletteSide === 'left' ? undefined : 'ms-auto'}
            />
          )}
        </div>
        {onSide && idle ? null : (
          <div data-area="status" className="flex min-h-6 flex-col justify-center">
            {idle ? <CaretLine /> : <RecordingStrip />}
          </div>
        )}
        {palette ? (
          <div data-area="palette">
            <EditorTools side={side} onFold={() => setPalette(false)} />
          </div>
        ) : null}
        <EditorKeyboard />
      </div>
    </ScoreEditorContext>
  )
}
