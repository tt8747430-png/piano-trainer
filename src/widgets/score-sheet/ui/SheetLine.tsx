import { memo, useEffect, useRef } from 'react'
import type { Layer } from '@/features/score-editor'
import type { Midi, Tick } from '@/shared/lib/music'
import { cn, useElementSize } from '@/shared/lib'
import { LazyScoreView, useCanvasReveal } from '@/shared/ui'
import { staffOfHand } from '../model/line-music'
import type { LineSheet } from '../model/line-sheets'
import type { EditPrinted } from '../model/printed'
import { labelRow, labelScale } from '../model/label-row'
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
  chordNote,
  selection,
  onPlace,
  onReach,
  onDeselect,
  placesOf,
  tapsOf,
  chordNames,
  edit,
  scale = 1,
  print = false,
  justify = true,
  onWrite,
  onDrag,
}: {
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
  /** What edits a thing printed (ADR 0094). */
  edit: EditPrinted
}) {
  const ref = useRef<HTMLDivElement>(null)
  // A line of a few bars runs the sheet's width, as a printed page's does.
  const { width } = useElementSize(ref)
  const holdsCaret = caret !== null
  // The labels' row over the staff: as tall as what it holds, at the line's size.
  const row = labelRow(chordNames, scale, print)
  // The notes chosen, marked as a notation app marks them: those chosen on this line in the caret's
  // row, else the ones at the caret (one of a chord's, chosen alone).
  const staff = layer === 'chords' ? null : staffOfHand(layer, sheet.music.melodyStaff ?? false)
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
  // while the line is already in sight, its section's heading over it kept in view.
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
        score={sheet.score}
        timeBefore={sheet.timeBefore}
        next={sheet.next}
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
            tapsOf={tapsOf}
            selection={selection}
            onPlace={onPlace}
            onReach={onReach}
            onDeselect={onDeselect}
            placesOf={placesOf}
            chordNames={chordNames}
            row={row}
            labels={labelScale(scale, print)}
            edit={edit}
            onWrite={onWrite}
            onDrag={onDrag}
          />
        )}
      </LazyScoreView>
    </div>
  )
})
