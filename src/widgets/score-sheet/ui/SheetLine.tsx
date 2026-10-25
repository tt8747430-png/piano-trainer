import { memo, useEffect, useRef, type Ref } from 'react'
import { layerStaff, type Layer } from '@/features/score-editor'
import type { Midi, Tick } from '@/shared/lib/music'
import type { StaffId, StaffLabels } from '@/shared/lib/notation'
import { cn, useElementSize } from '@/shared/lib'
import { LazyScoreView, useCanvasReveal } from '@/shared/ui'
import type { LineSheet } from '../model/line-sheets'
import { labelRow, labelScale } from '@/shared/ui/score'
import type { SheetField } from '../model/field-place'
import type { EditPrinted } from '../model/printed'
import { LineOverlay } from './LineOverlay'

/** Whether an element's top is on the screen. */
function topInSight(element: Element): boolean {
  const { top } = element.getBoundingClientRect()
  return top >= 0 && top < window.innerHeight
}

/**
 * One line of the chart as a line of grand staff, the notes at the caret marked: justified to the
 * sheet's width, drawn smaller where it is wider than that, so it never scrolls sideways (a
 * panorama's one line, left natural, does); a row of a busy sheet, drawn again only when its props change.
 */
export const SheetLine = memo(function SheetLine({
  sheet,
  layer,
  caret,
  playhead,
  chordNote,
  selection,
  onPlace,
  onReach,
  onDeselect,
  placesOf,
  tapsOf,
  chordNames,
  fingers,
  headings,
  edit,
  labels,
  staves,
  scale = 1,
  print = false,
  justify = true,
  onWrite,
  onDrag,
  field = null,
  fieldAnchor,
  onField,
}: {
  /** The field open at the caret, where this line holds it (ADR 0096). */
  field?: SheetField | null
  /** The element marking the open field's place. */
  fieldAnchor?: Ref<HTMLDivElement> | undefined
  /** A tap on what a field types where it is printed (ADR 0096). */
  onField?: ((field: SheetField, tick: Tick, layer: Layer) => void) | undefined
  onWrite?: ((tick: Tick, layer: Layer, key: Midi) => void) | undefined
  onDrag?: ((steps: number, joins: boolean) => void) | undefined
  /** The engraving's size: smaller on a phone, as it prints on a page. */
  scale?: number
  /** On a page, its labels as they print (ADR 0075). */
  print?: boolean
  /** Spread to the sheet's width, as a printed system is; a panorama's one line is left natural. */
  justify?: boolean
  sheet: LineSheet
  layer: Layer
  /** From the line's start, when the caret is on this line. */
  caret: Tick | null
  /** Where Play is, on the piece's ticks, while it plays on this line (ADR 0096). */
  playhead: { readonly tick: Tick; readonly clock: () => Tick | null } | null
  /** One note of the chord at the caret chosen alone (ADR 0088). */
  chordNote: Midi | null
  /** The notes chosen: their span on the piece. */
  selection: { readonly from: Tick; readonly to: Tick } | null
  onPlace: (tick: Tick, layer: Layer, extend: boolean, key?: Midi) => void
  onReach: (tick: Tick) => void
  onDeselect: () => void
  placesOf: (layer: Layer) => readonly Tick[]
  /** Where a click lands in a layer: on a note or a bar's start, never an empty step (ADR 0082). */
  tapsOf: (layer: Layer) => readonly Tick[]
  chordNames: boolean
  /** The fingers written on the notes, printed: the fingering field types them there (ADR 0096). */
  fingers: boolean
  /** Each section's name, by section: printed at its first bar (ADR 0095). */
  headings: readonly string[]
  /** What edits a thing printed (ADR 0094). */
  edit: EditPrinted
  /** The staves' names, printed at the line's head: the piece's first line (ADR 0094). */
  labels?: StaffLabels | undefined
  /** The staves drawn, of those the line writes: one of the piano's the View hides left out. */
  staves: readonly StaffId[]
}) {
  const ref = useRef<HTMLDivElement>(null)
  // A line of a few bars runs the sheet's width, as a printed page's does.
  const { width } = useElementSize(ref)
  const holdsCaret = caret !== null
  // The labels' row over the staff: as tall as what it holds, at the line's size.
  const row = labelRow(chordNames, scale, print)
  // The notes chosen, marked as a notation app marks them: those chosen on this line in the caret's
  // row, else the ones at the caret (one of a chord's, chosen alone).
  const staff = layer === 'chords' ? null : layerStaff(layer)
  const selected =
    staff === null
      ? undefined
      : selection
        ? {
            staff,
            from: selection.from - sheet.line.start,
            to: selection.to - sheet.line.start,
          }
        : caret === null
          ? undefined
          : { staff, from: caret, to: caret + 1, midi: chordNote ?? undefined }
  // The caret's line comes into view when the caret moves onto it; the sheet opens where it is
  // while the line is already in sight.
  const held = useRef<boolean | null>(null)
  // On a page canvas, the canvas moves to it (ADR 0075); elsewhere the sheet scrolls.
  const reveal = useCanvasReveal()
  useEffect(() => {
    const line = ref.current
    const before = held.current
    held.current = holdsCaret
    // The effect run again with nothing changed (a strict mode's second run) moves nothing.
    if (!holdsCaret || !line || before === true) return
    if (reveal) {
      reveal(line)
      return
    }
    if (before === null && topInSight(line)) return
    line.scrollIntoView({ block: 'nearest' })
  }, [holdsCaret, reveal])
  return (
    <div
      ref={ref}
      data-slot="sheet-line"
      className={cn('relative', !justify && 'overflow-x-auto overscroll-x-contain scrollbar-none')}
      style={{ paddingTop: row }}
    >
      <LazyScoreView
        scale={scale}
        fingers={fingers}
        score={sheet.score}
        timeBefore={sheet.timeBefore}
        next={sheet.next}
        labels={labels}
        staves={staves}
        selected={selected}
        fill={justify && width > 0 ? width : undefined}
      >
        {(layout) => (
          <LineOverlay
            layout={layout}
            music={sheet.music}
            line={sheet.line}
            layer={layer}
            caret={caret}
            chordNote={chordNote}
            playhead={playhead}
            scroller={justify ? undefined : ref}
            tapsOf={tapsOf}
            selection={selection}
            onPlace={onPlace}
            onReach={onReach}
            onDeselect={onDeselect}
            placesOf={placesOf}
            chordNames={chordNames}
            row={row}
            labels={labelScale(scale, print)}
            headings={headings}
            edit={edit}
            onWrite={onWrite}
            onDrag={onDrag}
            field={field}
            fieldAnchor={fieldAnchor}
            onField={onField}
          />
        )}
      </LazyScoreView>
    </div>
  )
})
