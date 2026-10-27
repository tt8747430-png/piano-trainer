import { useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import type { BarRange } from '@/features/practice'
import type { Performance } from '@/shared/lib/arrangement'
import type { Midi, Tick } from '@/shared/lib/music'
import { LANDSCAPE_PHONE, PAGE, PRINT_SCALE, useElementSize, useMediaQuery } from '@/shared/lib'
import { PageCanvas, SheetTitle } from '@/shared/ui'
import {
  lineLead,
  measureWidths,
  type Score,
  type StaffId,
  type StaffLabels,
} from '@/shared/lib/notation'
import { labelRow, ScoreView, scoreHeight, type Picked } from '@/shared/ui/score'
import { FINGERS, systemFit } from '../model/fit-scale'
import { scoreLines, type ScoreLine } from '../model/score-lines'
import { SheetOverlay } from './SheetOverlay'
import { LINE_GAP, SheetPages } from './SheetPages'

/** A line's engraving on a screen this wide is at its own size; narrower, smaller, down to the least. */
const FULL_WIDTH = 760
const LEAST_SCALE = 0.62

/**
 * The score in the chart's lines (ADR 0096): down the screen, or dealt onto A4 pages as it will print,
 * its title at the head of the first line (ADR 0114), each chart line cut by width where it is wider
 * than the screen holds. Each line is justified to the width and carries its labels, the loop's part
 * and its bars to jump to; the playhead stands on the line playing, which comes into sight as it
 * starts (ADR 0096). On a phone on its side, a line down the screen is drawn small enough that its
 * whole system is in sight, as the editor's is.
 */
export function SheetLines({
  score,
  performance,
  staves,
  staffNames,
  pages,
  title,
  headings,
  current,
  clock,
  loop,
  fingers,
  names,
  positions,
  chordNames,
  tempos,
  muted,
  onJump,
  onPick,
  onLoopChange,
  onChoose,
  selected,
  playheadShown,
}: {
  score: Score
  performance: Performance
  staves: readonly StaffId[]
  /** The staves' names, printed at the first line's head (ADR 0114). */
  staffNames: StaffLabels
  /** On A4 pages; else lines down the screen. */
  pages: boolean
  /** Printed at the head of the first line, the page's heading. */
  title: string
  headings: readonly string[]
  current: number
  /** Where Listen's music is while it plays: the playhead moves with it. */
  clock?: (() => Tick | null) | null | undefined
  loop: BarRange | null
  fingers: boolean
  names: boolean
  positions: boolean
  chordNames: boolean
  /** Each bar's tempo mark, said in the labels' row. */
  tempos: readonly (number | undefined)[]
  muted: StaffId | undefined
  onJump: (beatGroup: number) => void
  onPick: (picked: Picked) => void
  onLoopChange: (loop: BarRange) => void
  onChoose: (bar: number, extend: boolean) => void
  /** The notes chosen: the loop's, else the one clicked, one head of a chord alone (ADR 0096). */
  selected:
    | {
        readonly staff?: StaffId
        readonly from: Tick
        readonly to: Tick
        readonly midi?: Midi | undefined
      }
    | undefined
  playheadShown: boolean
}) {
  const { t } = useTranslation('music')
  const box = useRef<HTMLElement>(null)
  const { width, height } = useElementSize(box)
  const onSide = useMediaQuery(LANDSCAPE_PHONE)
  // The labels' row over each line, the editor's height: the chord names' and the bars' labels, or the
  // labels alone.
  const labels = labelRow(chordNames)
  // Down the screen as large as the width allows; on a phone on its side, a whole system, its
  // fingers and the verses under its tune in the sheet's height. Pages as they print, on a canvas
  // that zooms them to the screen (ADR 0096).
  const across = Math.min(1, Math.max(LEAST_SCALE, width / FULL_WIDTH))
  const scale = pages
    ? PRINT_SCALE
    : onSide
      ? systemFit({
          room: height - (fingers ? FINGERS : 0),
          natural: scoreHeight(score, staves),
          labels,
          most: across,
        })
      : across
  const margin = pages ? PAGE.margin : 0
  const inner = pages ? PAGE.width - 2 * margin : width
  // Each chart line cut by width to the room a line has, less its clef and key (ADR 0087).
  const widths = useMemo(
    () => measureWidths(score, scale, chordNames, staffNames),
    [score, scale, chordNames, staffNames],
  )
  const room = inner > 0 ? inner / scale - lineLead(score) : Infinity
  const lines = useMemo(
    () => scoreLines(score, performance, { room, widths }),
    [score, performance, room, widths],
  )

  // A line the playhead comes onto comes into sight: the playhead brings its line (ADR 0096).
  const line = (each: ScoreLine) => (
    <div
      key={each.first}
      data-slot="sheet-line"
      className="relative scroll-my-4"
      style={{ paddingTop: labels }}
    >
      <ScoreView
        score={each.score}
        scale={scale}
        fingers={fingers}
        names={names}
        muted={muted}
        staves={staves}
        timeBefore={each.timeBefore}
        next={each.next}
        labels={each.first === 0 ? staffNames : undefined}
        fill={inner > 0 ? inner : undefined}
        selected={selected}
      >
        {(layout) => (
          <SheetOverlay
            layout={layout}
            performance={performance}
            headings={headings}
            positions={positions}
            chordNames={chordNames}
            tempos={tempos}
            current={current}
            clock={clock}
            loop={loop}
            playheadShown={playheadShown}
            onJump={onJump}
            onPick={onPick}
            onLoopChange={onLoopChange}
            onChoose={onChoose}
            firstBar={each.first}
          />
        )}
      </ScoreView>
    </div>
  )

  if (!pages)
    return (
      <section
        ref={box}
        aria-label={t('sheet.label')}
        className="flex h-full scroll-pb-(--float-room) flex-col overflow-y-auto overscroll-contain"
        style={{ gap: LINE_GAP }}
      >
        <SheetTitle title={title} place="lines" />
        {lines.map(line)}
        {/* Room to scroll the last line clear of what floats over the sheet's foot (`--float-room`),
            a part of the list, so the sheet's own height is all it shows. */}
        <div aria-hidden className="h-(--float-room) shrink-0" style={{ marginTop: -LINE_GAP }} />
      </section>
    )

  return (
    <PageCanvas column={PAGE.width}>
      <section aria-label={t('sheet.label')} className="flex flex-col items-center gap-8 p-6">
        <SheetPages
          lines={lines}
          // A line's height as engraved: its staves and the verses under its tune (ADR 0097).
          height={(each) => labels + scoreHeight(each.score, staves) * scale}
          title={title}
          line={line}
        />
      </section>
    </PageCanvas>
  )
}
