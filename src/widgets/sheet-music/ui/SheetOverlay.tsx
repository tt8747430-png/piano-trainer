import type { RefObject } from 'react'
import type { BarRange } from '@/features/practice'
import type { Performance } from '@/shared/lib/arrangement'
import type { Tick } from '@/shared/lib/music'
import { Playhead, type Picked, type ScoreLayout } from '@/shared/ui/score'
import { BarTargets } from './BarTargets'
import { LoopBand } from './LoopBand'
import { SheetLabels } from './SheetLabels'

/** What lies over the engraving, placed by its layout: labels, the loop, the playhead, the bars. */
export function SheetOverlay({
  layout,
  scroller,
  performance,
  headings,
  positions,
  current,
  clock,
  loop,
  playheadShown = true,
  onJump,
  onPick,
  onLoopChange,
  onChoose,
  chordNames = true,
  tempos = [],
  firstBar = 0,
  labelSize = 1,
}: {
  /** The size its labels are drawn at: the line's, smaller with a staff drawn smaller. */
  labelSize?: number
  chordNames?: boolean
  /** Each bar of the piece's tempo mark, said in the labels' row. */
  tempos?: readonly (number | undefined)[]
  /** The piece's bar the layout's first measure is: a line of a score laid out in lines. */
  firstBar?: number
  layout: ScoreLayout
  /** The line's sideways scroller, which keeps the playhead in sight: none for lines that fit. */
  scroller?: RefObject<HTMLElement | null> | undefined
  performance: Performance
  headings: readonly string[]
  positions: boolean
  current: number
  /** Where Listen's music is while it plays: the playhead moves with it (ADR 0096). */
  clock?: (() => Tick | null) | null | undefined
  loop: BarRange | null
  /** Whether the playhead is in sight: not while the loop stands chosen and nothing moves (ADR 0096). */
  playheadShown?: boolean
  onJump: (beatGroup: number) => void
  /** A note or a chord clicked: the cursor goes to it. */
  onPick: (picked: Picked) => void
  onLoopChange: (loop: BarRange) => void
  /** Bars chosen by Shift or a held finger: the piece's bar, extending what is chosen. */
  onChoose: (bar: number, extend: boolean) => void
}) {
  const group = performance.beatGroups[current]
  // On a line, the playhead only where the beat group is.
  const here =
    group !== undefined && group.bar >= firstBar && group.bar < firstBar + layout.measures.length
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
        size={labelSize}
      />
      {loop ? (
        <LoopBand layout={layout} loop={loop} onChange={onLoopChange} firstBar={firstBar} />
      ) : null}
      {group && here ? (
        <Playhead
          layout={layout}
          tick={group.tick}
          clock={clock}
          scroller={scroller}
          hidden={!playheadShown}
        />
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
