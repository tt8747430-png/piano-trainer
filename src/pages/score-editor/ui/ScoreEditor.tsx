import { useRef } from 'react'
import {
  selectKeyboard,
  selectPaletteFolded,
  selectPaletteSide,
  useSettings,
  useSettingsStoreApi,
} from '@/entities/settings'
import { setPaletteFolded } from '@/features/set-preference'
import {
  cn,
  LANDSCAPE_PHONE,
  useElementSize,
  useHiddenWhileReading,
  useMediaQuery,
} from '@/shared/lib'
import { ScoreEditorContext } from '../model/editor-context'
import type { EditorTarget } from '../model/editor-target'
import { useEditorShortcutList } from '../model/use-editor-shortcut-list'
import { usePaletteBeside } from '../model/use-palette-beside'
import { useScoreEditor } from '../model/use-score-editor'
import { CaretLine } from './CaretLine'
import { EditorDock } from './EditorDock'
import { EditorHeader } from './EditorHeader'
import { EditorKeyboard } from './EditorKeyboard'
import { EditorSheet } from './EditorSheet'
import { EditorTools } from './EditorTools'
import { RecordingStrip } from './RecordingStrip'

/** What the sheet keeps between its music and what floats over it, in CSS px. */
const GAP = 8

/**
 * The score editor (spec §6, ADR 0064, 0065), laid out as a notation app, one screen that never
 * scrolls as a whole: the bar, saying where the caret is; the sheet, its one scroller; the keys at
 * the foot or under the bar. Over the sheet floats what works on it, above everything and never
 * moving it (ADR 0079): the dock (`EditorDock`), the Player's transport in shape and place, and the
 * palette, a card that hugs its keys, at the foot on a phone held upright and a tablet, beside the
 * sheet on a laptop and a phone on its side; folded, its row of tabs alone, where the card was.
 * Floating, they take no room of the sheet's: it only has room to scroll its last line above the
 * dock (ADR 0081). What floats at the foot steps aside while the music is read (dragged,
 * scrolled, pinched) and comes back at a tap on the sheet. While a take records, its strip stands
 * where the dock was.
 */
export function ScoreEditor({ target }: { target: EditorTarget }) {
  const editor = useScoreEditor(target)
  useEditorShortcutList()
  const onSide = useMediaQuery(LANDSCAPE_PHONE)
  const side = usePaletteBeside()
  const idle = editor.takes.stage === 'idle'
  const dock = useSettings((state) => selectKeyboard(state).dock)
  const paletteSide = useSettings(selectPaletteSide)
  const settings = useSettingsStoreApi()
  const palette = !useSettings(selectPaletteFolded)
  const setPalette = (open: boolean) => setPaletteFolded(settings, !open)
  // What floats over the sheet's foot, measured: the sheet has room to scroll its last line above it.
  const sheet = useRef<HTMLDivElement>(null)
  const foot = useRef<HTMLDivElement>(null)
  const { height } = useElementSize(sheet)
  const { height: below } = useElementSize(foot)
  // What floats at the foot steps aside while the music is read; a tap on the sheet brings it back.
  const floating = useHiddenWhileReading()
  // A take's strip, with its Stop, never steps aside.
  const footShown = floating.shown || !idle
  const left = paletteSide === 'left'
  const tools = (
    <EditorTools side={side} folded={!palette} onFold={(folded) => setPalette(!folded)} />
  )
  return (
    <ScoreEditorContext value={editor}>
      <div
        data-keys={dock}
        className="editor-screen min-h-0 flex-1 gap-2 py-2 landscape-phone:gap-1.5 landscape-phone:py-1"
      >
        <div data-area="bar">
          <EditorHeader status={idle ? <CaretLine /> : undefined} />
        </div>
        {editor.view.layout === 'pages' ? (
          // Pages on their canvas (ADR 0075): it moves and zooms them itself, the area never scrolls.
          <div
            ref={sheet}
            data-area="sheet"
            className="min-h-0 overflow-clip"
            {...floating.reading}
            onClickCapture={floating.show}
          >
            <div className="h-full overflow-clip rounded-2xl">
              <EditorSheet />
            </div>
          </div>
        ) : (
          <div
            ref={sheet}
            data-area="sheet"
            className="min-h-0 overflow-y-auto overscroll-contain"
            {...floating.reading}
            onClickCapture={floating.show}
          >
            <EditorSheet room={onSide ? height : undefined} />
            {/* Room past the last line, so it scrolls clear of what floats over the sheet's foot. */}
            <div aria-hidden style={{ height: below + GAP }} />
          </div>
        )}
        <div data-area="float">
          {side ? (
            // Beside the sheet, over its edge: folded, its row of tabs stays where the card's was.
            <div
              className={cn(
                'pointer-events-auto absolute top-0 flex max-h-full flex-col',
                palette ? 'w-84 landscape-phone:w-70 xl:w-96' : 'w-auto',
                left ? 'left-0' : 'right-0',
              )}
            >
              {tools}
            </div>
          ) : null}
          <div
            ref={foot}
            data-hidden={footShown ? undefined : true}
            inert={!footShown}
            className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-2 px-1 transition-[opacity,translate] duration-200 ease-out data-hidden:translate-y-2 data-hidden:opacity-0 motion-reduce:transition-none"
          >
            <div className="pointer-events-auto">{idle ? <EditorDock /> : <RecordingStrip />}</div>
            {side ? null : <div className="pointer-events-auto w-full max-w-xl">{tools}</div>}
          </div>
        </div>
        <EditorKeyboard />
      </div>
    </ScoreEditorContext>
  )
}
