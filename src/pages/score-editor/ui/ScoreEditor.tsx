import { PanelLeftOpen } from 'lucide-react'
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import {
  selectKeyboard,
  selectPaletteFolded,
  useSettings,
  useSettingsStoreApi,
} from '@/entities/settings'
import { useFoldKeys } from '@/features/live-keyboard'
import { setPaletteFolded } from '@/features/set-preference'
import {
  cn,
  LANDSCAPE_PHONE,
  useElementSize,
  useHiddenWhileReading,
  useKeyboardHeight,
  useMediaQuery,
} from '@/shared/lib'
import { Button } from '@/shared/ui/primitives/button'
import { PlayerArea, SCORE_SCREEN, ScoreBar } from '@/widgets/practice-player'
import { ScoreEditorContext } from '../model/editor-context'
import type { EditorTarget } from '../model/editor-target'
import { useEditorShortcutList } from '../model/use-editor-shortcut-list'
import { usePalettePanel } from '../model/use-palette-panel'
import { useScoreEditor } from '../model/use-score-editor'
import { CaretLine } from './CaretLine'
import { EditorDock } from './EditorDock'
import { SelectionActions } from './SelectionActions'
import { EditorActions, EditorLead } from './EditorHeader'
import { EditorToolsRow } from './EditorToolsRow'
import { EditorKeyboard } from './EditorKeyboard'
import { KeysToggle, NoteToolbar, PalettePanel, PaletteSheet } from './EditorPalette'
import { EditorSheet } from './EditorSheet'
import { FieldDocked } from './field-docked'
import { OpenField } from './OpenField'
import { RecordingStrip } from './RecordingStrip'
import { TakesSheet } from './TakesSheet'
import { UnsavedNotice } from './UnsavedNotice'

/** What the sheet keeps between its music and what floats over it, in CSS px. */
const GAP = 8
/** How far the slim bar stands over the phone's keyboard (`SheetField`'s docked offset). */
const DOCKED_GAP = 6

/** The panel reaches the screen's left edge and the bar's hairline, past the screen's gutter and gap. */
const PANEL_EDGE =
  '-mt-3 ml-[calc(-1*max(var(--gutter),env(safe-area-inset-left)))] landscape-phone:-mt-2'
/** The sheet at the foot reaches the screen's side edges. */
const SHEET_EDGES = 'mx-[calc(-1*max(var(--gutter),env(safe-area-inset-left)))]'

/**
 * The score editor (ADR 0096, 0114), laid out as Flat's, one screen that never scrolls as a whole:
 * the bar, saying where the caret is; then the work. On a laptop, a tablet and a phone on its side
 * (`usePalettePanel`), the palette is a panel docked at the left, hidden whole by its « and brought
 * back from the note-entry toolbar, which stands over the sheet with the everyday tools and the
 * Keys; the sheet takes the rest, nothing over its music. On a phone held upright the palette is a
 * sheet docked at the foot, compact or expanded, shrinking the sheet rather than covering it; a field
 * typed in (a chord symbol, the lyrics, the fingering) takes its place, slim, over the phone's own
 * keyboard. The keys dock under all of it, or under the bar, as the keyboard settings say. The
 * transport floats over the sheet's foot, the Player's in shape and place (ADR 0115), stepping aside
 * while the music is read; the sheet has room to scroll its last line above it. While a take records,
 * its strip stands where the transport was. What the music's owner says of it (an editor's draft of
 * a song's original, its strip) stands over the sheet, in the column's head (`head`).
 */
export function ScoreEditor({
  target,
  bar,
  head,
}: {
  target: EditorTarget
  bar?: number | undefined
  head?: ReactNode
}) {
  const { t } = useTranslation('editor')
  const editor = useScoreEditor(target, bar)
  useEditorShortcutList()
  const onSide = useMediaQuery(LANDSCAPE_PHONE)
  const panel = usePalettePanel()
  const idle = editor.takes.stage === 'idle'
  const dock = useSettings((state) => selectKeyboard(state).dock)
  const keysFolded = useFoldKeys().folded
  const settings = useSettingsStoreApi()
  // The panel shown, the sheet compact, until the learner chooses (ADR 0114).
  const place = panel ? 'panel' : 'sheet'
  const folded = useSettings(selectPaletteFolded(place))
  const fold = (next: boolean) => setPaletteFolded(settings, place, next)
  // The transport floating over the sheet's foot, measured: the sheet has room to scroll past it.
  const sheet = useRef<HTMLDivElement>(null)
  const foot = useRef<HTMLDivElement>(null)
  const { height } = useElementSize(sheet)
  const { height: transport } = useElementSize(foot)
  // Where the field open over the sheet stands: the place the caret's line draws for it (ADR 0096);
  // on a phone, the slim bar over its own keyboard, in the palette sheet's place.
  const [anchor, setAnchor] = useState<HTMLDivElement | null>(null)
  const [docked, setDocked] = useState<HTMLDivElement | null>(null)
  const typing = !panel && editor.view.field !== null
  // While a field types over the phone's keyboard, the sheet's foot is covered by the keyboard and
  // the slim bar standing on it: measured, so the caret's line scrolls clear of both (ADR 0061).
  const keyboard = useKeyboardHeight()
  const [typedOver, setTypedOver] = useState(0)
  useLayoutEffect(() => {
    const box = sheet.current
    if (!typing || keyboard === 0 || !box || !docked) return setTypedOver(0)
    const bar = document.querySelector('[data-docked-field]')?.getBoundingClientRect().height ?? 0
    const barTop = docked.getBoundingClientRect().top - bar - DOCKED_GAP
    setTypedOver(Math.max(0, Math.round(box.getBoundingClientRect().bottom - barTop)))
  }, [typing, keyboard, docked])
  const below = Math.max(transport, typedOver)
  // The sheet never leaves the caret under the transport (or the phone's keyboard): its staff
  // scrolls into the room above it.
  useEffect(() => {
    const box = sheet.current
    const caret = box?.querySelector('[data-slot="caret"]')
    if (!box || !caret || below === 0) return
    const mark = caret.getBoundingClientRect()
    const view = box.getBoundingClientRect()
    const foot = view.bottom - below - GAP
    if (mark.bottom > foot) box.scrollTop += Math.min(mark.bottom - foot + GAP, mark.top - view.top)
  }, [below])
  // The transport steps aside while the music is read; a tap on the sheet brings it back.
  const floating = useHiddenWhileReading()
  // The phone's sheet expanded is the editing's: the transport steps aside for the music it leaves.
  const expanded = !panel && !folded && keysFolded
  // A take's strip, with its Stop, never steps aside.
  const footShown = (floating.shown && !expanded) || !idle
  const music =
    editor.view.layout === 'page' ? (
      // Pages on their canvas (ADR 0096): it moves and zooms them itself, the area never scrolls.
      <div
        ref={sheet}
        data-area="sheet"
        className="h-full min-h-0 overflow-clip"
        {...floating.reading}
        onClickCapture={floating.show}
      >
        <div className="h-full overflow-clip rounded-2xl">
          <EditorSheet onAnchor={setAnchor} covered={{ bottom: below + GAP }} />
        </div>
      </div>
    ) : (
      <div
        ref={sheet}
        data-area="sheet"
        style={{ scrollPaddingBottom: below + GAP }}
        className="h-full min-h-0 scroll-pt-(--tools-room) overflow-y-auto overscroll-contain pt-(--tools-room)"
        {...floating.reading}
        onClickCapture={floating.show}
      >
        <EditorSheet room={onSide ? height : undefined} onAnchor={setAnchor} />
        {/* Room past the last line, so it scrolls clear of the transport over the sheet's foot. */}
        <div aria-hidden style={{ height: below + GAP }} />
      </div>
    )
  return (
    <ScoreEditorContext value={editor}>
      {/* The Player's frame (ADR 0115): its bar's two groups, its tools row, the work and the keys
          in the Player's places, so the bar and the keys stand still as Practise · Edit switches. */}
      <div data-keys={dock} className={SCORE_SCREEN}>
        <ScoreBar lead={<EditorLead />} actions={<EditorActions />} tools={<EditorToolsRow />} />
        {/* Where the caret is, a screen reader's alone, in the Player's status line's place. */}
        <PlayerArea area="status">{idle ? <CaretLine /> : null}</PlayerArea>
        <div
          data-area="work"
          className={
            panel
              ? cn(
                  'grid min-h-0 grid-rows-[auto_minmax(0,1fr)] gap-x-3 gap-y-2',
                  folded
                    ? 'grid-cols-[minmax(0,1fr)]'
                    : 'grid-cols-[18rem_minmax(0,1fr)] landscape-phone:grid-cols-[15rem_minmax(0,1fr)] xl:grid-cols-[20rem_minmax(0,1fr)]',
                )
              : 'flex min-h-0 flex-col'
          }
        >
          {panel && !folded ? (
            <aside
              className={cn(
                'row-span-2 flex min-h-0 flex-col border-r border-hairline bg-card',
                PANEL_EDGE,
              )}
            >
              <PalettePanel onHide={() => fold(true)} />
            </aside>
          ) : null}
          {panel ? (
            <NoteToolbar
              pill
              start={
                folded ? (
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={t('palette.show')}
                    title={t('palette.show')}
                    className="size-10 shrink-0 rounded-lg text-muted-foreground hover:text-foreground"
                    onClick={() => fold(false)}
                  >
                    <PanelLeftOpen aria-hidden />
                  </Button>
                ) : null
              }
              end={<KeysToggle />}
            />
          ) : null}
          <div className="relative flex min-h-0 flex-1 flex-col">
            {/* What the music's owner says over it, in the column's head: the music under it, never
                covered. */}
            {head ? <div className="flex shrink-0 justify-center px-2 pb-2">{head}</div> : null}
            <div className="min-h-0 flex-1">{music}</div>
            {/* What floats over the music (ADR 0115): above it, only its own controls taking a touch. */}
            <div className="pointer-events-none absolute inset-0 z-30">
              {/* A change that could not be saved, said at the sheet's head. */}
              <div className="absolute inset-x-0 top-2 flex justify-center px-2">
                <div className="pointer-events-auto w-full max-w-md">
                  <UnsavedNotice />
                </div>
              </div>
              <div
                ref={foot}
                data-hidden={footShown ? undefined : true}
                inert={!footShown}
                // The transport at the sheet's foot where the Player's stands (ADR 0115).
                className="absolute inset-x-0 bottom-0 flex justify-center px-1 pb-2 transition-[opacity,translate] duration-200 ease-out data-hidden:translate-y-2 data-hidden:opacity-0 motion-reduce:transition-none landscape-phone:pb-1"
              >
                <div className="flex shrink-0 flex-col items-center gap-2">
                  <SelectionActions />
                  <div className="pointer-events-auto">
                    {idle ? <EditorDock /> : <RecordingStrip />}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {panel ? null : typing ? (
            // The field's slim bar stands over the phone's own keyboard, where the sheet was.
            <div
              ref={setDocked}
              aria-hidden
              className="pointer-events-none fixed inset-x-0 bottom-[var(--kb-inset,0px)] h-0"
            />
          ) : (
            <div
              className={cn(
                'shrink-0',
                SHEET_EDGES,
                // Down to the keys under it, or to the screen's foot.
                dock === 'bottom' && !keysFolded ? '-mb-3' : '-mb-2',
              )}
            >
              <PaletteSheet folded={folded} onFold={fold} />
            </div>
          )}
        </div>
        <EditorKeyboard />
      </div>
      <FieldDocked value={typing}>
        <OpenField anchor={typing ? docked : anchor} />
      </FieldDocked>
      <TakesSheet />
    </ScoreEditorContext>
  )
}
