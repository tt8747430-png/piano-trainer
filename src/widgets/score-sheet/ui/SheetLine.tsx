import { useEffect, useRef } from 'react'
import type { BarRange, Draft, Layer } from '@/features/score-editor'
import type { Tick, TimeSignature } from '@/shared/lib/music'
import type { Score, TimedMusic } from '@/shared/lib/notation'
import { LazyScoreView } from '@/shared/ui'
import type { SheetLineBars } from '../model/line-music'
import { LineOverlay } from './LineOverlay'

/** One line of the chart as a line of grand staff, scrolling sideways where it is wider than the screen. */
export function SheetLine({
  draft,
  line,
  music,
  score,
  timeBefore,
  layer,
  caret,
  caretTicks,
  selection,
  onPlace,
}: {
  draft: Draft
  line: SheetLineBars
  music: TimedMusic
  score: Score
  timeBefore: TimeSignature | undefined
  layer: Layer
  /** From the line's start, when the caret is on this line. */
  caret: Tick | null
  caretTicks: Tick
  selection: BarRange | null
  onPlace: (tick: Tick, layer: Layer, extend: boolean) => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const holdsCaret = caret !== null
  // The caret's line comes into view when the caret moves onto it.
  useEffect(() => {
    if (holdsCaret) ref.current?.scrollIntoView({ block: 'nearest' })
  }, [holdsCaret])
  return (
    <div ref={ref} className="relative overflow-x-auto overscroll-x-contain pt-11 scrollbar-none">
      <LazyScoreView score={score} timeBefore={timeBefore}>
        {(layout) => (
          <LineOverlay
            layout={layout}
            music={music}
            line={line}
            draft={draft}
            layer={layer}
            caret={caret}
            caretTicks={caretTicks}
            selection={selection}
            onPlace={onPlace}
          />
        )}
      </LazyScoreView>
    </div>
  )
}
