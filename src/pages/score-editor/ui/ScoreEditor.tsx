import { useEffect, useLayoutEffect, useRef, useState, type ReactNode, type Ref } from 'react'
import {
  selectEditing,
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
  useKeyboardHeight,
  useKeyboardTop,
  useMediaQuery,
} from '@/shared/lib'
import { SheetPill, SheetToolsContext } from '@/shared/ui'
import { PlayerArea, SCORE_SCREEN, ScoreBar } from '@/widgets/practice-player'
import { SheetLayoutTools } from '@/widgets/score-view-menu'
import { ScoreEditorContext, useScoreEditorContext } from '../model/editor-context'
import type { EditorTarget } from '../model/editor-target'
import { useEditorShortcutList } from '../model/use-editor-shortcut-list'
import { usePalettePanel } from '../model/use-palette-panel'
import { useScoreEditor } from '../model/use-score-editor'
import { useAnswerRecord } from '../model/use-record-take'
import { CaretLine } from './CaretLine'
import { EditorGear, type EditorDraft } from './EditorGear'
import { SelectionActions } from './SelectionActions'
import { EditorActions, EditorLead } from './EditorHeader'
import { EditorKeyboard } from './EditorKeyboard'
import { EditorPanel, PaletteSheet } from './EditorPalette'
import { EditorSheet } from './EditorSheet'
import { FieldDocked } from './field-docked'
import { OpenField } from './OpenField'
import { RecordingBar } from './RecordingBar'
import { TakesSheet } from './TakesSheet'
import { UnsavedNotice } from './UnsavedNotice'

/** What the sheet keeps between its music and what floats over it, in CSS px. */
const GAP = 8
/** How far the slim bar stands over the phone's keyboard (`SheetField`'s docked offset). */
const DOCKED_GAP = 6

/** The panel reaches the screen's left edge and the bar's hairline, past the screen's gutter and gap. */
const PANEL_EDGE =
  '-mt-3 ml-[calc(-1*max(var(--gutter),env(safe-area-inset-left)))] landscape-phone:-mt-2'
/** Docked at the right (Note input's Palette side): the screen's right edge, the sheet in the first column. */
const PANEL_EDGE_RIGHT =
  'col-start-2 row-start-1 -mt-3 mr-[calc(-1*max(var(--gutter),env(safe-area-inset-right)))] landscape-phone:-mt-2'

/**
 * The score editor (ADR 0096, 0114, R31-E), laid out as Flat's, one screen that never scrolls as a
 * whole: the bar (Close, Done, Play, Undo, Redo and the gear), then the work. From 48rem across (a
 * laptop, a tablet, a phone on its side) the palette is a panel at the sheet's side; on a phone held
 * upright it floats as a rounded card over the sheet's foot, the sheet keeping room to scroll its
 * last line above it; a field typed in (a chord symbol, the lyrics, the fingering) takes its place,
 * slim, over the phone's own keyboard. The keys dock under all of it, or under the bar, as the
 * keyboard settings say. What is done to the notes chosen floats over the sheet's foot, stepping
 * aside while the music is read; while a take records, its strip stands there.
 */
export function ScoreEditor({
  target,
  bar,
  draft,
  done,
}: {
  target: EditorTarget
  bar?: number | undefined
  /** An editor's draft of a song's original (ADR 0116): its state and acts, in the gear. */
  draft?: EditorDraft
  /** Done in its own place (a lesson's example's, back to its lesson). */
  done?: ReactNode
}) {
  const editor = useScoreEditor(target, bar)
  return (
    <ScoreEditorContext value={editor}>
      <EditorScreen draft={draft} done={done} />
    </ScoreEditorContext>
  )
}

/** The editor's screen over its context's draft (`ScoreEditor`). */
function EditorScreen({ draft, done }: { draft?: EditorDraft | undefined; done?: ReactNode }) {
  const editor = useScoreEditorContext()
  useEditorShortcutList()
  useAnswerRecord()
  const onSide = useMediaQuery(LANDSCAPE_PHONE)
  const panel = usePalettePanel()
  const right = useSettings((state) => selectEditing(state).paletteSide) === 'right'
  const idle = editor.takes.stage === 'idle'
  const dock = useSettings((state) => selectKeyboard(state).dock)
  const settings = useSettingsStoreApi()
  const folded = useSettings(selectPaletteFolded)
  const fold = (next: boolean) => setPaletteFolded(settings, next)
  // What floats over the sheet's foot (the palette on a phone, the selection's commands, a take's
  // strip), measured: the sheet has room to scroll past it.
  const sheet = useRef<HTMLDivElement>(null)
  const foot = useRef<HTMLDivElement>(null)
  const palette = useRef<HTMLElement>(null)
  const { height } = useElementSize(sheet)
  const { height: floated } = useElementSize(foot)
  const { height: paletteHeight } = useElementSize(palette)
  // Where the field open over the sheet stands: the place the caret's line draws for it (ADR 0096);
  // on a phone, the slim bar over its own keyboard, in the palette's place.
  const [anchor, setAnchor] = useState<HTMLDivElement | null>(null)
  const [docked, setDocked] = useState<HTMLDivElement | null>(null)
  const typing = !panel && editor.view.field !== null
  // The floating palette's room at the sheet's foot: none while a field takes its place.
  const paletteRoom = panel || typing || paletteHeight === 0 ? 0 : paletteHeight + GAP
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
  const below = Math.max(floated + paletteRoom, typedOver)
  // The sheet never leaves the caret under what floats at its foot (or the phone's keyboard): its
  // staff scrolls into the room above it.
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
        <div className="h-full overflow-clip rounded-control">
          <EditorSheet onAnchor={setAnchor} covered={{ bottom: below + GAP }} />
        </div>
      </div>
    ) : (
      <div
        ref={sheet}
        data-area="sheet"
        style={{ scrollPaddingBottom: below + GAP }}
        className="h-full min-h-0 overflow-y-auto overscroll-contain"
        {...floating.reading}
        onClickCapture={floating.show}
      >
        <EditorSheet room={onSide ? height : undefined} onAnchor={setAnchor} />
        {/* Room past the last line, so it scrolls clear of what floats over the sheet's foot. */}
        <div aria-hidden style={{ height: below + GAP }} />
      </div>
    )
  return (
    <>
      {/* The Player's frame (ADR 0115): its bar's two groups, the work and the keys in the Player's
          places, so the bar and the keys stand still as Practise · Edit switches. */}
      <div data-keys={dock} className={SCORE_SCREEN}>
        <ScoreBar lead={<EditorLead done={done} />} actions={<EditorActions />} />
        {/* Where the caret is, a screen reader's alone, in the Player's status line's place. */}
        <PlayerArea area="status">{idle ? <CaretLine /> : null}</PlayerArea>
        <div
          data-area="work"
          className={
            panel
              ? cn(
                  'grid min-h-0 gap-x-3',
                  right
                    ? 'grid-cols-[minmax(0,1fr)_20rem] landscape-phone:grid-cols-[minmax(0,1fr)_17rem] xl:grid-cols-[minmax(0,1fr)_22.5rem]'
                    : 'grid-cols-[20rem_minmax(0,1fr)] landscape-phone:grid-cols-[17rem_minmax(0,1fr)] xl:grid-cols-[22.5rem_minmax(0,1fr)]',
                )
              : 'flex min-h-0 flex-col'
          }
        >
          {panel ? (
            <aside
              data-side={right ? 'right' : 'left'}
              className={cn(
                'flex min-h-0 flex-col border-hairline bg-card',
                right ? cn('border-l', PANEL_EDGE_RIGHT) : cn('border-r', PANEL_EDGE),
              )}
            >
              <EditorPanel />
            </aside>
          ) : null}
          <div className="relative flex min-h-0 flex-1 flex-col">
            {/* The sheet's one pill at its foot, clear of what floats there (R34, Songscription's):
                the layout, and in Page view the canvas's zoom beside it. */}
            <SheetToolsContext value={<SheetLayoutTools />}>
              <div className="min-h-0 flex-1">{music}</div>
            </SheetToolsContext>
            {editor.view.layout === 'page' ? null : (
              <SheetPill covered={{ bottom: below + GAP }}>
                <SheetLayoutTools />
              </SheetPill>
            )}
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
                style={{ bottom: paletteRoom }}
                // The selection's commands, or a take's strip, at the sheet's foot (ADR 0115),
                // over the floating palette on a phone.
                className="absolute inset-x-0 flex justify-center px-1 pb-2 transition-[opacity,translate] duration-200 ease-out data-hidden:translate-y-2 data-hidden:opacity-0 motion-reduce:transition-none landscape-phone:pb-1"
              >
                <div className="flex shrink-0 flex-col items-center gap-2">
                  <SelectionActions />
                  {idle ? null : (
                    <div className="pointer-events-auto">
                      <RecordingBar />
                    </div>
                  )}
                </div>
              </div>
              {panel || typing ? null : (
                // The palette floating over the sheet's foot (R31-E, Flat's), clear of its edges.
                <div className="absolute inset-x-0 bottom-2 px-0.5">
                  <PaletteSheet ref={palette} folded={folded} onFold={fold} />
                </div>
              )}
            </div>
          </div>
          {typing ? (
            // The field's slim bar stands over the phone's own keyboard, where the palette was.
            <KeyboardAnchor ref={setDocked} />
          ) : null}
        </div>
        <EditorKeyboard />
      </div>
      <FieldDocked value={typing}>
        <OpenField anchor={typing ? docked : anchor} />
      </FieldDocked>
      <TakesSheet />
      <EditorGear draft={draft} />
    </>
  )
}

/**
 * Where the phone's keyboard begins (round 26): the slim bar of a field typed in stands on it,
 * followed as iOS pans the screen under it; at the screen's foot while no keyboard is up.
 */
function KeyboardAnchor({ ref }: { ref: Ref<HTMLDivElement> }) {
  const top = useKeyboardTop()
  return (
    <div
      ref={ref}
      aria-hidden
      style={top === null ? { bottom: 0 } : { top }}
      className="pointer-events-none fixed inset-x-0 h-0"
    />
  )
}
