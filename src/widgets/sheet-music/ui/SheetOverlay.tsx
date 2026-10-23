import { useRef, type RefObject } from 'react'
import type { BarRange } from '@/features/practice'
import type { Performance } from '@/shared/lib/arrangement'
import { StaffNames, xAtTick, type Picked, type ScoreLayout } from '@/shared/ui/score'
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
  cursorShown = true,
  picked,
  onJump,
  onPick,
  onLoopChange,
  onChoose,
  chordNames = true,
  tempos = [],
  firstBar = 0,
}: {
  chordNames?: boolean
  /** Each bar of the piece's tempo mark, said in the labels' row. */
  tempos?: readonly (number | undefined)[]
  /** The piece's bar the layout's first measure is: a line of a score laid out in lines. */
  firstBar?: number
  layout: ScoreLayout
  scroller: RefObject<HTMLElement | null>
  performance: Performance
  headings: readonly string[]
  positions: boolean
  current: number
  loop: BarRange | null
  /** Whether the cursor is marked: not while the loop stands chosen and nothing moves (ADR 0086). */
  cursorShown?: boolean
  /** What a click chose at the cursor: one head, or a chord on one staff. */
  picked?: Picked | null
  onJump: (beatGroup: number) => void
  /** A note or a chord clicked: the cursor goes to it. */
  onPick: (picked: Picked) => void
  onLoopChange: (loop: BarRange) => void
  /** Bars chosen by Shift or a held finger: the piece's bar, extending what is chosen. */
  onChoose: (bar: number, extend: boolean) => void
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
        tempos={tempos}
        firstBar={firstBar}
      />
      <StaffNames layout={layout} />
      {loop ? (
        <LoopBand layout={layout} loop={loop} onChange={onLoopChange} firstBar={firstBar} />
      ) : null}
      {group && here && cursorShown ? (
        <SheetCursor ref={cursor} tick={group.tick} picked={picked} layout={layout} />
      ) : null}
      <BarTargets
        layout={layout}
        performance={performance}
        positions={positions}
        current={group?.bar}
        onJump={onJump}
        onPick={onPick}
        onChoose={onChoose}
        firstBar={firstBar}
      />
    </>
  )
}
