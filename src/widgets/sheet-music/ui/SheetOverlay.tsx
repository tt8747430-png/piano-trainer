import { useRef, type RefObject } from 'react'
import type { BarRange } from '@/features/practice'
import type { Performance } from '@/shared/lib/arrangement'
import { xAtTick, type ScoreLayout } from '@/shared/ui/score'
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
  current,
  loop,
  onJump,
  onLoopChange,
}: {
  layout: ScoreLayout
  scroller: RefObject<HTMLElement | null>
  performance: Performance
  headings: readonly string[]
  current: number
  loop: BarRange | null
  onJump: (beatGroup: number) => void
  onLoopChange: (loop: BarRange) => void
}) {
  const cursor = useRef<HTMLDivElement>(null)
  const group = performance.beatGroups[current]
  const x = group ? xAtTick(layout, group.tick) : null
  useFollow(scroller, cursor, x)
  return (
    <>
      <SheetLabels layout={layout} performance={performance} headings={headings} />
      {loop ? <LoopBand layout={layout} loop={loop} onChange={onLoopChange} /> : null}
      {x === null ? null : <SheetCursor ref={cursor} x={x} layout={layout} />}
      <BarTargets layout={layout} performance={performance} current={group?.bar} onJump={onJump} />
    </>
  )
}
