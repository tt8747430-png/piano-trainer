import { memo } from 'react'
import type { BarRange } from '@/features/practice'
import type { Performance } from '@/shared/lib/arrangement'
import type { Midi, Tick } from '@/shared/lib/music'
import type { StaffId, StaffLabels } from '@/shared/lib/notation'
import type { VerdictMark } from '@/shared/ui'
import { ScoreView, type Picked } from '@/shared/ui/score'
import type { ScoreLine } from '../model/score-lines'
import { SheetOverlay } from './SheetOverlay'

/** No beat group on this line: its playhead and its bar's mark are another line's. */
export const ELSEWHERE = -1

interface SheetLineProps {
  readonly line: ScoreLine
  /** The labels' row over the line, in pixels. */
  readonly labels: number
  /** The line's height as engraved, in pixels: its room while it is out of sight and not drawn. */
  readonly height: number
  readonly scale: number
  readonly fingers: boolean
  readonly names: boolean
  readonly muted: StaffId | undefined
  readonly staves: readonly StaffId[]
  /** The staves' names, printed at the first line's head alone. */
  readonly staffNames: StaffLabels | undefined
  readonly fill: number | undefined
  readonly selected:
    | {
        readonly staff?: StaffId
        readonly from: Tick
        readonly to: Tick
        readonly midi?: Midi | undefined
      }
    | undefined
  readonly performance: Performance
  readonly headings: readonly string[]
  readonly positions: boolean
  readonly chordNames: boolean
  readonly tempos: readonly (number | undefined)[]
  /** The beat group playing where it is on this line, else `ELSEWHERE`. */
  readonly current: number
  /** Listen's clock, on the line playing alone. */
  readonly clock: (() => Tick | null) | null | undefined
  readonly loop: BarRange | null
  readonly playheadShown: boolean
  /** A take's verdicts, by each judged head's engraved id. */
  readonly verdicts?: ReadonlyMap<string, VerdictMark> | undefined
  readonly onJump: (beatGroup: number) => void
  readonly onPick: (picked: Picked) => void
  readonly onLoopChange: (loop: BarRange) => void
  readonly onChoose: (bar: number, extend: boolean) => void
}

/**
 * One line of the sheet in lines or on pages, engraved with what lies over it. Memoised, its
 * handlers held for good by the sheet: as the music moves on, only the line it leaves and the line
 * it reaches render again (R32), never the whole score; out of sight, the browser skips drawing it.
 */
function SheetLineView({
  line,
  labels,
  height,
  scale,
  fingers,
  names,
  muted,
  staves,
  staffNames,
  fill,
  selected,
  ...overlay
}: SheetLineProps) {
  return (
    <div
      data-slot="sheet-line"
      className="relative scroll-my-4 drawn-in-sight"
      style={{ paddingTop: labels, containIntrinsicSize: `auto ${labels + height}px` }}
    >
      <ScoreView
        score={line.score}
        scale={scale}
        fingers={fingers}
        names={names}
        muted={muted}
        staves={staves}
        timeBefore={line.timeBefore}
        next={line.next}
        labels={staffNames}
        fill={fill}
        selected={selected}
      >
        {(layout) => <SheetOverlay layout={layout} firstBar={line.first} {...overlay} />}
      </ScoreView>
    </div>
  )
}

export const SheetLine = memo(SheetLineView)
