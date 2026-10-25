import { useRef, type MouseEvent, type PointerEvent, type RefObject } from 'react'
import { useTranslation } from 'react-i18next'
import type { Layer } from '@/features/score-editor'
import { useBarName } from '@/shared/i18n'
import { chordSymbol, keySignature, type Midi, type Tick } from '@/shared/lib/music'
import { staffClefAt, type TimedMusic } from '@/shared/lib/notation'
import {
  MARK,
  pickAt,
  Playhead,
  ScoreMark,
  spaceOf,
  useSheetChoice,
  xAtTick,
  type ScoreLayout,
  type SheetPoint,
} from '@/shared/ui/score'
import { LAYER_OF_STAFF, layerAt, staffOfLayer, type SheetLineBars } from '../model/line-music'
import { chordRow, chosenBand } from '../model/chosen-band'
import { nearestPlace, roomAt } from '../model/nearest'
import { noteAtStaffY, stepsDragged } from '../model/staff-pitch'
import type { EditPrinted } from '../model/printed'
import { EditorCaret } from './EditorCaret'
import { LineLabels } from './LineLabels'
import { PrintedSigns } from './PrintedSigns'
import { StaffNames } from './StaffNames'

/** How far round the caret's onset a press takes hold of its notes to drag them. */
const GRIP = { before: 14, after: 22, over: 16 } as const
/**
 * How much larger the sheet is drawn than laid out: a page canvas's zoom (ADR 0075), 1 elsewhere. A
 * point's place on the screen, divided by it, is its place on the line's layout.
 */
function zoomOf(element: HTMLElement, box: DOMRect): number {
  const laid = element.offsetWidth
  return laid > 0 && box.width > 0 ? box.width / laid : 1
}

/**
 * Over a line's staff: its labels, the bars chosen, the caret, the playhead while Play plays here (ADR
 * 0096), and each bar as a button that puts the caret where it is clicked; a double click there
 * writes the note on the line or space clicked (ADR 0064). The notes at the caret are a grip: dragged up or down, they move by notes of the key. The
 * tempo mark, a section's name (ADR 0095), each clef, key and time signature and the staves' names are
 * buttons too, each opening what changes it there (`edit`, ADR 0094).
 */
export function LineOverlay({
  layout,
  music,
  line,
  layer,
  caret,
  playhead,
  scroller,
  selection,
  onPlace,
  onReach,
  onDeselect,
  placesOf,
  tapsOf,
  chordNames,
  row,
  labels,
  headings,
  edit,
  onWrite,
  onDrag,
}: {
  /** The labels' row over the staff, in CSS px. */
  row: number
  /** The labels' size. */
  labels: number
  /** Each section's name, by section: printed at its first bar (ADR 0095). */
  headings: readonly string[]
  /** A note written where a staff was double-clicked: its tick, row and key. */
  onWrite?: ((tick: Tick, layer: Layer, key: Midi) => void) | undefined
  /** The notes at the caret dragged by steps of the key, the first step of a drag not `joins`. */
  onDrag?: ((steps: number, joins: boolean) => void) | undefined
  layout: ScoreLayout
  music: TimedMusic
  line: SheetLineBars
  layer: Layer
  /** From the line's start, when the caret is on this line. */
  caret: Tick | null
  /** Where Play is, on the piece's ticks, while it plays on this line (ADR 0096). */
  playhead: { readonly tick: Tick; readonly clock: () => Tick | null } | null
  /** The line's own sideways scroller (a line across), which keeps the playhead in sight. */
  scroller?: RefObject<HTMLElement | null> | undefined
  /** The notes chosen, from the piece's start: their span. */
  selection: { readonly from: Tick; readonly to: Tick } | null
  /** A click on the sheet: the caret to a note (one of a chord's, `key`) or an empty place, Shift extending. */
  onPlace: (tick: Tick, layer: Layer, extend: boolean, key?: Midi) => void
  /** A held finger dragged onto the bar starting at `tick`: what is chosen reaches it. */
  onReach: (tick: Tick) => void
  /** A click on empty staff: what is chosen let go (ADR 0088). */
  onDeselect: () => void
  /** Where a note may be written in a layer: a double click writes at the nearest. */
  placesOf: (layer: Layer) => readonly Tick[]
  /** Where a click lands in a layer, on a note or a bar's start, never an empty step (ADR 0082). */
  tapsOf: (layer: Layer) => readonly Tick[]
  chordNames: boolean
  /** What edits a thing printed, opened from its button (ADR 0094). */
  edit: EditPrinted
}) {
  const { t } = useTranslation('editor')
  const barName = useBarName()
  // The notes chosen on this line as the one selection's band over the staff of the row they are
  // chosen in (the chord row, choosing chords), ADR 0096: the notes themselves coloured.
  const chosen = chosenBand(layout, line.start, selection, {
    row,
    staff: staffOfLayer(layout.staves, layer),
  })
  // Whether a note written in the caret's row starts at the caret: its notes are a grip.
  const caretOnNote =
    caret !== null &&
    layer !== 'chords' &&
    music.notes.some((n) => n.hand === layer && n.startTick === caret)
  /** A point on a bar's button in the line's layout px: a page canvas's zoom taken out. */
  const pointOf = (event: MouseEvent<HTMLButtonElement>, index: number): SheetPoint => {
    const measure = layout.measures[index]
    const box = event.currentTarget.getBoundingClientRect()
    const zoom = zoomOf(event.currentTarget, box)
    return {
      x: (measure?.x ?? 0) + (event.clientX - box.left) / zoom,
      y: (event.clientY - box.top) / zoom - row,
    }
  }
  /** Where a point on bar `index` writes: its row, the nearest place a note may be written, its height. */
  const writeAt = (index: number, { x, y }: SheetPoint) => {
    const placed = line.bars[index]
    if (!placed) return null
    const target = layerAt(y, layout, chordNames)
    const end = placed.start + placed.bar.ticks
    const places = placesOf(target).filter((tick) => tick >= placed.start && tick < end)
    const tick = nearestPlace(places, x, (at) => xAtTick(layout, at - line.start))
    return { target, tick: tick ?? placed.start, y }
  }
  /**
   * What a click (or a held finger) at a point of bar `index` chooses (ADR 0088), as the Player's
   * does: the head under it (one note of a chord), the chord whose stem or column it is on, or the
   * empty place it is in (a rest, the room after the last note, as a line); on empty staff between
   * notes, nothing, what is chosen let go. A chord in the chord row.
   */
  const chooseAt = (index: number, point: SheetPoint | null, extend: boolean) => {
    const placed = line.bars[index]
    const measure = layout.measures[index]
    if (!placed || !measure) return
    if (!point) {
      onPlace(placed.start, layer, extend)
      return
    }
    const target = layerAt(point.y, layout, chordNames)
    const end = placed.start + placed.bar.ticks
    const inBar = (tick: Tick) => tick >= placed.start && tick < end
    const xOf = (at: Tick) => xAtTick(layout, at - line.start)
    if (target === 'chords') {
      const tick = nearestPlace(tapsOf('chords').filter(inBar), point.x, xOf)
      onPlace(tick ?? placed.start, 'chords', extend)
      return
    }
    const picked = pickAt(layout, point.x, point.y)
    if (picked) {
      const key = picked.index === undefined ? undefined : picked.midi
      onPlace(line.start + picked.tick, LAYER_OF_STAFF[picked.staff], extend, key)
      return
    }
    const notes = music.notes.filter((n) => n.hand === target)
    const places = tapsOf(target)
      .filter(inBar)
      .map((tick) => ({ tick, empty: !notes.some((n) => n.startTick === tick - line.start) }))
    const room = roomAt(places, point.x, xOf, {
      start: measure.x,
      end: measure.x + measure.width,
      lead: MARK.lead * spaceOf(layout),
    })
    if (room !== undefined) onPlace(room, target, extend)
    else if (!extend) onDeselect()
  }
  const choice = useSheetChoice({
    at: (start, point, extend) =>
      chooseAt(
        line.bars.findIndex((placed) => placed.start === start),
        point,
        extend,
      ),
    reach: onReach,
  })
  const write = (index: number) => (event: MouseEvent<HTMLButtonElement>) => {
    const point = writeAt(index, pointOf(event, index))
    if (!point || !onWrite || point.target === 'chords') return
    const lines = staffOfLayer(layout.staves, point.target)
    if (!lines) return
    const clef = staffClefAt(music, index, lines.staff)
    // The bar's own key, where its section changes key (ADR 0089): its signature's sharps and flats.
    const { midi } = noteAtStaffY(clef, point.y, lines, music.bars[index]?.key ?? music.key)
    onWrite(point.tick, point.target, midi)
  }
  // The caret's notes as a grip: a drag up or down moves them a step of the key at a time.
  const caretStaff = staffOfLayer(layout.staves, layer)
  const drag = useRef<{ y: number; applied: number } | null>(null)
  const grip = {
    onPointerDown: (event: PointerEvent<HTMLDivElement>) => {
      event.currentTarget.setPointerCapture(event.pointerId)
      drag.current = { y: event.clientY, applied: 0 }
    },
    onPointerMove: (event: PointerEvent<HTMLDivElement>) => {
      const held = drag.current
      if (!held || !caretStaff || !onDrag) return
      const zoom = zoomOf(event.currentTarget, event.currentTarget.getBoundingClientRect())
      const steps = stepsDragged((event.clientY - held.y) / zoom, caretStaff)
      if (steps === held.applied) return
      onDrag(steps - held.applied, held.applied !== 0)
      drag.current = { ...held, applied: steps }
    },
    onPointerUp: () => {
      drag.current = null
    },
    onPointerCancel: () => {
      drag.current = null
    },
  }
  return (
    <>
      {chosen ? (
        // The notes chosen as the one selection's band on this line (ADR 0096).
        <ScoreMark slot="notes-chosen" kind="band" box={chosen} />
      ) : null}
      {/* The caret first, so the labels and the notes stand over it; none while notes are chosen,
          the range their mark (ADR 0088). */}
      {caret === null || selection ? null : (
        <EditorCaret layout={layout} layer={layer} tick={caret} chords={chordRow(layout, row)} />
      )}
      {playhead ? (
        // On the line's own ticks, from its start.
        <Playhead
          layout={layout}
          tick={playhead.tick - line.start}
          clock={() => {
            const at = playhead.clock()
            return at === null ? null : at - line.start
          }}
          scroller={scroller}
        />
      ) : null}
      <LineLabels
        layout={layout}
        music={music}
        labels={line.labels}
        headings={headings}
        chordNames={chordNames}
        row={row}
        size={labels}
        edit={edit}
      />
      <PrintedSigns
        layout={layout}
        bars={line.bars.map((placed) => placed.index)}
        keyless={keySignature(music.bars[0]?.key ?? music.key) === 0}
        edit={edit}
      />
      <StaffNames layout={layout} edit={edit} />
      {layout.measures.map((measure, index) => {
        const placed = line.bars[index]
        const chosenBy = placed ? choice(placed.start, { x: measure.x, y: -row }) : {}
        const chords = (placed?.bar.chords ?? []).map((chord) => chordSymbol(chord.chord))
        return (
          <button
            key={index}
            type="button"
            tabIndex={-1}
            aria-label={barName((placed?.index ?? 0) + 1, chords.join(' '))}
            onDoubleClick={write(index)}
            {...chosenBy}
            // A pointer's target only (the arrows move the caret): no focus ring and no hover wash
            // round the bar, which a touch screen leaves standing over empty staff (ADR 0082).
            className="absolute bottom-0 z-20 cursor-text outline-none"
            style={{ left: measure.x, width: measure.width, top: -row }}
          />
        )
      })}
      {caret !== null && caretStaff && onDrag && caretOnNote ? (
        <div
          aria-hidden
          data-slot="note-grip"
          data-grip
          title={t('sheet.drag')}
          className="absolute z-30 cursor-ns-resize touch-none rounded-md"
          style={{
            left: xAtTick(layout, caret) - GRIP.before,
            width: GRIP.before + GRIP.after,
            top: caretStaff.top - GRIP.over,
            height: caretStaff.bottom - caretStaff.top + 2 * GRIP.over,
          }}
          {...grip}
        />
      ) : null}
    </>
  )
}
