import { memo, useEffect, useRef } from 'react'
import type { BarRange, Layer } from '@/features/score-editor'
import type { Midi, Tick } from '@/shared/lib/music'
import { cn, useElementSize } from '@/shared/lib'
import { LazyScoreView } from '@/shared/ui'
import { staffOfHand } from '../model/line-music'
import type { LineSheet } from '../model/line-sheets'
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
  caretTicks,
  selection,
  onPlace,
  placesOf,
  chordNames,
  onSignature,
  scale = 1,
  justify = true,
  onWrite,
  onDrag,
}: {
  onWrite?: ((tick: Tick, layer: Layer, key: Midi) => void) | undefined
  onDrag?: ((steps: number, joins: boolean) => void) | undefined
  /** The engraving's size: a page's lines smaller on a narrow screen, as its paper is. */
  scale?: number
  /** Spread to the sheet's width, as a printed system is; a panorama's one line is left natural. */
  justify?: boolean
  sheet: LineSheet
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
  const ref = useRef<HTMLDivElement>(null)
  // A line of a few bars runs the sheet's width, as a printed page's does.
  const { width } = useElementSize(ref)
  const holdsCaret = caret !== null
  // The notes at the caret on its staff are the ones chosen, marked as a notation app marks them.
  const selected =
    caret === null || layer === 'chords'
      ? undefined
      : { staff: staffOfHand(layer, sheet.music.melodyStaff ?? false), tick: caret }
  // The caret's line comes into view when the caret moves onto it; the sheet opens where it is
  // while the line is already in sight, its section's heading over it kept in view.
  const held = useRef<boolean | null>(null)
  useEffect(() => {
    const line = ref.current
    const before = held.current
    held.current = holdsCaret
    // The effect run again with nothing changed (a strict mode's second run) moves nothing.
    if (!holdsCaret || !line || before === true) return
    if (before === null && topInSight(line)) return
    line.scrollIntoView({ block: 'nearest' })
  }, [holdsCaret])
  return (
    <div
      ref={ref}
      data-slot="sheet-line"
      className={cn(
        'relative pt-11',
        !justify && 'overflow-x-auto overscroll-x-contain scrollbar-none',
      )}
    >
      <LazyScoreView
        scale={scale}
        score={sheet.score}
        timeBefore={sheet.timeBefore}
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
            caretTicks={caretTicks}
            selection={selection}
            onPlace={onPlace}
            placesOf={placesOf}
            chordNames={chordNames}
            onSignature={onSignature}
            onWrite={onWrite}
            onDrag={onDrag}
          />
        )}
      </LazyScoreView>
    </div>
  )
})
