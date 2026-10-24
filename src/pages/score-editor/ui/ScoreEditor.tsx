import { useEffect, useRef } from 'react'
import {
  selectKeyboard,
  selectPaletteFolded,
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
 * The score editor (spec §6, ADR 0064, 0089, 0091), laid out as a notation app, one screen that never
 * scrolls as a whole: the bar, saying where the caret is; the sheet, its one scroller; the keys at
 * the foot or under the bar. Over the sheet floats what works on it, above everything and never
 * moving it (ADR 0079): the dock (`EditorDock`), the Player's transport in shape and place, and the
 * palette, a card that hugs its keys, at the foot on a phone held upright and a tablet, beside the
 * sheet at its right on a laptop and a phone on its side (ADR 0094); folded, its row of tabs alone,
 * where the card was.
 * Floating, they take no room of the sheet's: it only has room to scroll its last line above the
 * dock (ADR 0081). What floats at the foot steps aside while the music is read (dragged,
 * scrolled, pinched) and comes back at a tap on the sheet. While a take records, its strip stands
 * where the dock was.
 */
export function ScoreEditor({ target, bar }: { target: EditorTarget; bar?: number | undefined }) {
  const editor = useScoreEditor(target, bar)
  useEditorShortcutList()
  const onSide = useMediaQuery(LANDSCAPE_PHONE)
  const beside = usePaletteBeside()
  const idle = editor.takes.stage === 'idle'
  const dock = useSettings((state) => selectKeyboard(state).dock)
  const settings = useSettingsStoreApi()
  // Open by default beside the sheet, where it covers no music; folded at the foot (ADR 0089).
  const place = beside ? 'beside' : 'foot'
  const palette = !useSettings(selectPaletteFolded(place))
  const setPalette = (open: boolean) => setPaletteFolded(settings, place, !open)
  // What floats over the sheet's foot, measured: the sheet has room to scroll its last line above it.
  const sheet = useRef<HTMLDivElement>(null)
  const foot = useRef<HTMLDivElement>(null)
  const { height } = useElementSize(sheet)
  const { height: below } = useElementSize(foot)
  // The sheet never leaves the caret under what floats at its foot: as the palette opens (the foot
  // grows), the caret's staff scrolls into the room above it (spec 2026-10-23).
  useEffect(() => {
    const box = sheet.current
    const caret = box?.querySelector('[data-slot="caret"]')
    if (!box || !caret || below === 0) return
    const mark = caret.getBoundingClientRect()
    const view = box.getBoundingClientRect()
    const foot = view.bottom - below - GAP
    if (mark.bottom > foot) box.scrollTop += Math.min(mark.bottom - foot + GAP, mark.top - view.top)
  }, [below])
  // What floats at the foot steps aside while the music is read; a tap on the sheet brings it back.
  const floating = useHiddenWhileReading()
  // A take's strip, with its Stop, never steps aside.
  const footShown = floating.shown || !idle
  const tools = (
    <EditorTools side={beside} folded={!palette} onFold={(folded) => setPalette(!folded)} />
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
            style={{ scrollPaddingBottom: below + GAP }}
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
          {beside ? (
            // Beside the sheet, over its right edge (ADR 0094): folded, its row of tabs stays where
            // the card's was.
            <div className="pointer-events-auto absolute top-0 right-0 flex max-h-full w-84 flex-col landscape-phone:w-80 xl:w-96">
              {tools}
            </div>
          ) : null}
          <div
            ref={foot}
            data-hidden={footShown ? undefined : true}
            inert={!footShown}
            className={cn(
              'absolute inset-x-0 bottom-0 flex max-h-full flex-col items-center gap-2 px-1 transition-[opacity,translate] duration-200 ease-out data-hidden:translate-y-2 data-hidden:opacity-0 motion-reduce:transition-none',
              // The dock centred in the room the palette beside the sheet leaves, never under it.
              beside && 'pr-84 landscape-phone:pr-80 xl:pr-96',
            )}
          >
            <div className="pointer-events-auto shrink-0">
              {idle ? <EditorDock /> : <RecordingStrip />}
            </div>
            {beside ? null : (
              <div className="pointer-events-auto flex min-h-0 w-full max-w-xl flex-col">
                {tools}
              </div>
            )}
          </div>
        </div>
        <EditorKeyboard />
      </div>
    </ScoreEditorContext>
  )
}
