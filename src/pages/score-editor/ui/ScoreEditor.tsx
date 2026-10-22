import { Music } from 'lucide-react'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import {
  selectKeyboard,
  selectPaletteFolded,
  selectPaletteSide,
  useSettings,
  useSettingsStoreApi,
} from '@/entities/settings'
import { setPaletteFolded } from '@/features/set-preference'
import { cn, LANDSCAPE_PHONE, useElementSize, useMediaQuery } from '@/shared/lib'
import { FabPill } from '@/shared/ui'
import { ScoreEditorContext } from '../model/editor-context'
import type { EditorTarget } from '../model/editor-target'
import { useEditorShortcutList } from '../model/use-editor-shortcut-list'
import { useScoreEditor } from '../model/use-score-editor'
import { CaretLine } from './CaretLine'
import { CaretMoves } from './CaretMoves'
import { EditorHeader } from './EditorHeader'
import { EditorKeyboard, KeysButton } from './EditorKeyboard'
import { EditorSheet } from './EditorSheet'
import { EditorTools } from './EditorTools'
import { RecordingStrip } from './RecordingStrip'

/** A laptop's width: the palette a column beside the sheet. */
const LAPTOP = '(min-width: 64rem)'
/** A screen wide enough for the caret's line under the title; narrower, it rides in the moves' pill. */
const WIDE = '(min-width: 40rem)'
/** What the sheet keeps between its music and what floats over it, in CSS px. */
const GAP = 8

/**
 * The score editor (spec §6, ADR 0064, 0065), laid out as a notation app, one screen that never
 * scrolls as a whole: the bar, saying where the caret is; the sheet, its one scroller; the keys at
 * the foot or under the bar. Over the sheet floats what works on it, above everything and never
 * moving it (ADR 0079): the caret's moves in one pill (the Player's transport's), the keys' and the
 * palette's buttons beside it while they are folded, and the palette, a card that hugs its keys, at
 * the foot on a phone held upright and a tablet, beside the sheet on a laptop and a phone on its
 * side. The sheet keeps clear of them: it scrolls its last line above them, and its lines end short
 * of the palette beside it. While a take records, its strip stands where the moves were.
 */
export function ScoreEditor({ target }: { target: EditorTarget }) {
  const { t } = useTranslation('editor')
  const editor = useScoreEditor(target)
  useEditorShortcutList()
  const onSide = useMediaQuery(LANDSCAPE_PHONE)
  const side = useMediaQuery(LAPTOP) || onSide
  const wide = useMediaQuery(WIDE) || onSide
  const idle = editor.takes.stage === 'idle'
  const dock = useSettings((state) => selectKeyboard(state).dock)
  const paletteSide = useSettings(selectPaletteSide)
  const settings = useSettingsStoreApi()
  const palette = !useSettings(selectPaletteFolded)
  const setPalette = (open: boolean) => setPaletteFolded(settings, !open)
  // What floats over the sheet, measured: the sheet keeps its music clear of it.
  const sheet = useRef<HTMLDivElement>(null)
  const foot = useRef<HTMLDivElement>(null)
  const beside = useRef<HTMLDivElement>(null)
  const { height } = useElementSize(sheet)
  const { height: below } = useElementSize(foot)
  const { width: across } = useElementSize(beside)
  const besides = palette && side ? across + GAP : 0
  const left = paletteSide === 'left'
  const clear = {
    paddingInlineStart: left ? besides : 0,
    paddingInlineEnd: left ? 0 : besides,
  }
  const tools = palette ? <EditorTools side={side} onFold={() => setPalette(false)} /> : null
  return (
    <ScoreEditorContext value={editor}>
      <div
        data-keys={dock}
        className="editor-screen min-h-0 flex-1 gap-2 py-2 landscape-phone:gap-1.5 landscape-phone:py-1"
      >
        <div data-area="bar">
          <EditorHeader status={idle && wide ? <CaretLine /> : undefined} />
        </div>
        {editor.view.layout === 'pages' ? (
          // Pages on their canvas (ADR 0075): it moves and zooms them itself, the area never scrolls.
          <div
            ref={sheet}
            data-area="sheet"
            className="min-h-0 overflow-clip"
            style={{ ...clear, paddingBottom: below }}
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
            style={clear}
          >
            <EditorSheet room={onSide ? Math.max(0, height - below) : undefined} />
            {/* Room past the last line, so it scrolls clear of what floats over the sheet's foot. */}
            <div aria-hidden style={{ height: below + GAP }} />
          </div>
        )}
        <div data-area="float">
          {side && tools ? (
            <div
              ref={beside}
              className={cn(
                'pointer-events-auto absolute top-0 flex max-h-full w-84 flex-col landscape-phone:w-70 xl:w-96',
                left ? 'left-0' : 'right-0',
              )}
            >
              {tools}
            </div>
          ) : null}
          <div ref={foot} className="absolute inset-x-0 bottom-0 flex flex-col gap-2" style={clear}>
            <div className="flex items-end gap-2 px-1">
              <div className="pointer-events-auto flex flex-1 justify-start">
                <KeysButton />
              </div>
              <div className="pointer-events-auto flex justify-center">
                {idle ? (
                  <CaretMoves caption={wide ? undefined : <CaretLine />} />
                ) : (
                  <RecordingStrip />
                )}
              </div>
              <div className="pointer-events-auto flex flex-1 justify-end">
                {palette ? null : (
                  <FabPill
                    label={t('palette.open')}
                    icon={Music}
                    onClick={() => setPalette(true)}
                  />
                )}
              </div>
            </div>
            {!side && tools ? (
              <div className="pointer-events-auto mx-auto w-full max-w-xl">{tools}</div>
            ) : null}
          </div>
        </div>
        <EditorKeyboard />
      </div>
    </ScoreEditorContext>
  )
}
