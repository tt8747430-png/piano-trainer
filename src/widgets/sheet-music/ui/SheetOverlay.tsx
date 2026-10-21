import { useRef, type RefObject } from 'react'
import type { BarRange } from '@/features/practice'
import type { Performance } from '@/shared/lib/arrangement'
import { StaffNames, xAtTick, type ScoreLayout } from '@/shared/ui/score'
import { BarTargets } from './BarTargets'
import { LoopBand } from './LoopBand'
import { SheetCursor } from './SheetCursor'
import { SheetLabels } from './SheetLabels'
import { useFollow } from './use-follow'

/** What lies over the engraving, placed by its layout: labels, the loop, the cursor, the bars. */
export function SheetOverlay({
  layout,
  scroller,
  performance,
  headings,
  positions,
  current,
  loop,
  onJump,
  onLoopChange,
  chordNames = true,
  firstBar = 0,
}: {
  chordNames?: boolean
  /** The piece's bar the layout's first measure is: a line of a score laid out in lines. */
  firstBar?: number
  layout: ScoreLayout
  scroller: RefObject<HTMLElement | null>
  performance: Performance
  headings: readonly string[]
  positions: boolean
  current: number
  loop: BarRange | null
  onJump: (beatGroup: number) => void
  onLoopChange: (loop: BarRange) => void
}) {
  const cursor = useRef<HTMLDivElement>(null)
  const group = performance.beatGroups[current]
  // On a line, the cursor only where the beat group is.
  const here =
    group !== undefined && group.bar >= firstBar && group.bar < firstBar + layout.measures.length
  const x = group && here ? xAtTick(layout, group.tick) : null
  useFollow(scroller, cursor, x)
  return (
    <>
      <SheetLabels
        layout={layout}
        performance={performance}
        headings={headings}
        positions={positions}
        chordNames={chordNames}
        firstBar={firstBar}
      />
      <StaffNames layout={layout} />
      {loop ? (
        <LoopBand layout={layout} loop={loop} onChange={onLoopChange} firstBar={firstBar} />
      ) : null}
      {x === null ? null : <SheetCursor ref={cursor} x={x} layout={layout} />}
      <BarTargets
        layout={layout}
        performance={performance}
        positions={positions}
        current={group?.bar}
        onJump={onJump}
        firstBar={firstBar}
      />
    </>
  )
}
