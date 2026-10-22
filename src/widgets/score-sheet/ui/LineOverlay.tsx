import { useRef, type MouseEvent, type PointerEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { isHandLayer, type BarRange, type Layer } from '@/features/score-editor'
import { chordSymbol, type Midi, type Tick } from '@/shared/lib/music'
import { staffClefAt, type TimedMusic } from '@/shared/lib/notation'
import { StaffNames, xAtTick, type ScoreLayout } from '@/shared/ui/score'
import { layerAt, staffOfLayer, type SheetLineBars } from '../model/line-music'
import { chosenBox } from '../model/chosen-box'
import { nearestPlace } from '../model/nearest'
import { noteAtStaffY, stepsDragged } from '../model/staff-pitch'
import { EditorCaret } from './EditorCaret'
import { LineLabels } from './LineLabels'
import { useHoldToChoose } from './use-hold-to-choose'

/** How far a bar's Pattern stands in from where its notes begin. */
const PATTERN_INSET = 6
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
 * Over a line's staff: its labels (with Pattern where a hand is not written, in that hand's layer),
 * the bars chosen, the caret, and each bar as a button that puts the caret where it is clicked; a
 * double click there writes the note on the line or space clicked (ADR 0064). The notes at the caret
 * are a grip: dragged up or down, they move by notes of the key.
 */
export function LineOverlay({
  layout,
  music,
  line,
  layer,
  caret,
  caretTicks,
  selection,
  onPlace,
  placesOf,
  chordNames,
  row,
  labels,
  onSignature,
  onWrite,
  onDrag,
}: {
  /** The labels' row over the staff, in CSS px. */
  row: number
  /** The labels' size. */
  labels: number
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
  caretTicks: Tick
  selection: BarRange | null
  onPlace: (tick: Tick, layer: Layer, extend: boolean) => void
  placesOf: (layer: Layer) => readonly Tick[]
  chordNames: boolean
  onSignature: () => void
}) {
  const { t } = useTranslation('editor')
  // A bar held by a finger chooses it, and the bars a drag then reaches (ADR 0076).
  const hold = useHoldToChoose((tick, extend) => onPlace(tick, layer, extend))
  const hand = isHandLayer(layer) ? layer : null
  const [first] = layout.measures
  const staff = hand ? layout.staves[hand === 'lh' ? 'bass' : 'treble'] : undefined
  // The bars chosen on this line, as one box over the staff of the row they are chosen in (the
  // chord row, choosing chords).
  const chosen = chosenBox(
    layout,
    line.bars.map((placed) => placed.index),
    selection,
    { chords: layer === 'chords', row, staff: staffOfLayer(layout.staves, layer) },
  )
  // In a hand's layer, the bars it leaves to the pattern.
  const patterned =
    hand && staff ? layout.measures.map((_, index) => !line.bars[index]?.bar[hand]) : []
  /** Where a point on bar `index` lands: its row, the nearest place there, and its height on the line. */
  const pointAt = (index: number, event: MouseEvent<HTMLButtonElement>) => {
    const placed = line.bars[index]
    const measure = layout.measures[index]
    if (!placed || !measure) return null
    const box = event.currentTarget.getBoundingClientRect()
    const zoom = zoomOf(event.currentTarget, box)
    const y = (event.clientY - box.top) / zoom - row
    const target = layerAt(y, layout, chordNames)
    const end = placed.start + placed.bar.ticks
    const places = placesOf(target).filter((tick) => tick >= placed.start && tick < end)
    const x = measure.x + (event.clientX - box.left) / zoom
    const tick = nearestPlace(places, x, (at) => xAtTick(layout, at - line.start))
    return { target, tick: tick ?? placed.start, y }
  }
  const place = (index: number) => (event: MouseEvent<HTMLButtonElement>) => {
    const placed = line.bars[index]
    if (!placed) return
    if (event.detail === 0) {
      onPlace(placed.start, layer, event.shiftKey)
      return
    }
    const point = pointAt(index, event)
    if (point) onPlace(point.tick, point.target, event.shiftKey)
  }
  const write = (index: number) => (event: MouseEvent<HTMLButtonElement>) => {
    const point = pointAt(index, event)
    if (!point || !onWrite || point.target === 'chords') return
    const lines = staffOfLayer(layout.staves, point.target)
    if (!lines) return
    const clef = staffClefAt(music, index, lines.staff)
    const { midi } = noteAtStaffY(clef, point.y, lines, music.key)
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
        // The bars chosen as one box on this line, from its staves' top to their foot, inset from
        // the barlines so the next line's or section's bars stay clear of it.
        <div
          aria-hidden
          data-slot="bars-chosen"
          className="absolute z-0 rounded-xl bg-secondary/80 shadow-md ring-1 shadow-ring/15 ring-ring/45"
          style={chosen}
        />
      ) : null}
      {/* The caret first, so the labels and the notes stand over it. */}
      {caret === null ? null : (
        <EditorCaret layout={layout} layer={layer} tick={caret} ticks={caretTicks} row={row} />
      )}
      <LineLabels
        layout={layout}
        music={music}
        firstBar={(line.bars[0]?.index ?? 0) + 1}
        chordNames={chordNames}
        row={row}
        size={labels}
      />
      {staff
        ? patterned.map((left, index) => {
            const measure = layout.measures[index]
            // A bar the hand leaves to the pattern says so inside its empty staff, not over the music.
            return left && measure ? (
              <span
                key={`pattern-${index}`}
                aria-hidden
                className="pointer-events-none absolute z-10 text-xs text-muted-foreground italic"
                style={{
                  left: Math.max(measure.notes, measure.x) + PATTERN_INSET,
                  top: (staff.top + staff.bottom) / 2,
                  transform: 'translateY(-50%)',
                }}
              >
                {t('sheet.pattern')}
              </span>
            ) : null
          })
        : null}
      <StaffNames layout={layout} />
      {first && first.notes > first.x ? (
        // The clef, key and time signature at the line's head: a click opens what changes them.
        <button
          type="button"
          tabIndex={-1}
          aria-label={t('sheet.signature')}
          title={t('sheet.signature')}
          onClick={onSignature}
          className="absolute bottom-0 z-30 cursor-pointer rounded-lg outline-none transition-colors duration-200 ease-out hover:bg-foreground/5"
          style={{ left: first.x, width: first.notes - first.x, top: 0 }}
        />
      ) : null}
      {layout.measures.map((measure, index) => {
        const placed = line.bars[index]
        const held = placed ? hold(placed.start) : {}
        const chords = (placed?.bar.chords ?? []).map((chord) => chordSymbol(chord.chord))
        return (
          <button
            key={index}
            type="button"
            tabIndex={-1}
            aria-label={t('sheet.bar', { n: (placed?.index ?? 0) + 1, chords: chords.join(' ') })}
            onClick={place(index)}
            onDoubleClick={write(index)}
            {...held}
            // A pointer's target only (the arrows move the caret): it takes no focus ring round the bar.
            className="absolute bottom-0 z-20 cursor-text rounded-lg outline-none transition-colors duration-200 ease-out hover:bg-foreground/5"
            style={{ left: measure.x, width: measure.width, top: -row }}
          />
        )
      })}
      {caret !== null &&
      caretStaff &&
      onDrag &&
      music.notes.some((n) => n.hand === layer && n.startTick === caret) ? (
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
