import { memo, useEffect, useRef } from 'react'
import type { BarRange, Layer } from '@/features/score-editor'
import type { Tick } from '@/shared/lib/music'
import { LazyScoreView } from '@/shared/ui'
import type { LineSheet } from '../model/line-sheets'
import { LineOverlay } from './LineOverlay'

/**
 * One line of the chart as a line of grand staff, scrolling sideways where it is wider than the screen,
 * the notes at the caret marked; a row of a busy sheet, drawn again only when its props change.
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
}: {
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
  const holdsCaret = caret !== null
  // The notes at the caret on its staff are the ones chosen, marked as a notation app marks them.
  const selected =
    caret === null || layer === 'chords'
      ? undefined
      : { staff: layer === 'lh' ? ('bass' as const) : ('treble' as const), tick: caret }
  // The caret's line comes into view when the caret moves onto it.
  useEffect(() => {
    if (holdsCaret) ref.current?.scrollIntoView({ block: 'nearest' })
  }, [holdsCaret])
  return (
    <div ref={ref} className="relative overflow-x-auto overscroll-x-contain pt-11 scrollbar-none">
      <LazyScoreView score={sheet.score} timeBefore={sheet.timeBefore} selected={selected}>
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
          />
        )}
      </LazyScoreView>
    </div>
  )
})
