import { useEffect, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import type { BarRange } from '@/features/practice'
import type { Performance } from '@/shared/lib/arrangement'
import { PAGE, paginate, PRINT_SCALE, useElementSize, useScrollMotion } from '@/shared/lib'
import { PageCanvas, useCanvasReveal } from '@/shared/ui'
import { lineLead, measureWidths, type Score, type StaffId } from '@/shared/lib/notation'
import { ScoreView, staffHeight } from '@/shared/ui/score'
import { scoreLines, type ScoreLine } from '../model/score-lines'
import { SheetOverlay } from './SheetOverlay'

/** The labels' row over each line: the chord names' and the bars' numbers, or the numbers alone. */
const LABELS = { chords: 44, numbers: 20 } as const
const LINE_GAP = 16
/** A line's engraving on a screen this wide is at its own size; narrower, smaller, down to the least. */
const FULL_WIDTH = 760
const LEAST_SCALE = 0.62

/**
 * The score in the chart's lines (ADR 0064): down the screen, or dealt onto A4 pages as it will print,
 * its title on the first, each chart line cut by width where it is wider than the screen holds. Each
 * line is justified to the width and carries its labels, the loop's part
 * and its bars to jump to; the cursor stands on the line playing, which comes into sight as it starts.
 */
export function SheetLines({
  score,
  performance,
  staves,
  pages,
  title,
  headings,
  current,
  loop,
  fingers,
  names,
  positions,
  chordNames,
  tempos,
  muted,
  onJump,
  onLoopChange,
}: {
  score: Score
  performance: Performance
  staves: readonly StaffId[]
  /** On A4 pages; else lines down the screen. */
  pages: boolean
  title?: string | undefined
  headings: readonly string[]
  current: number
  loop: BarRange | null
  fingers: boolean
  names: boolean
  positions: boolean
  chordNames: boolean
  /** Each bar's tempo mark, said in the labels' row. */
  tempos: readonly (number | undefined)[]
  muted: StaffId | undefined
  onJump: (beatGroup: number) => void
  onLoopChange: (loop: BarRange) => void
}) {
  const { t } = useTranslation('music')
  const box = useRef<HTMLElement>(null)
  const { width } = useElementSize(box)
  const labels = chordNames ? LABELS.chords : LABELS.numbers
  // Pages as they print, on a canvas that zooms them to the screen (ADR 0075).
  const scale = pages ? PRINT_SCALE : Math.min(1, Math.max(LEAST_SCALE, width / FULL_WIDTH))
  const margin = pages ? PAGE.margin : 0
  const inner = pages ? PAGE.width - 2 * margin : width
  // Each chart line cut by width to the room a line has, less its clef and key (ADR 0074).
  const widths = useMemo(() => measureWidths(score, scale, chordNames), [score, scale, chordNames])
  const room = inner > 0 ? inner / scale - lineLead(score) : Infinity
  const lines = useMemo(
    () => scoreLines(score, performance, { room, widths }),
    [score, performance, room, widths],
  )
  // The line the cursor is on comes into sight as it starts.
  const shown = useRef(new Map<number, HTMLDivElement>())
  const motion = useScrollMotion()
  const bar = performance.beatGroups[current]?.bar
  const playing = bar === undefined ? -1 : lines.findLastIndex((line) => line.first <= bar)
  useEffect(() => {
    if (!pages) shown.current.get(playing)?.scrollIntoView({ block: 'nearest', behavior: motion })
  }, [pages, playing, motion])
  // No sideways scroller: each line fits the width, and a cursor's follow stays put.
  const noScroller = useRef<HTMLElement>(null)

  const line = (each: ScoreLine, index: number) => (
    <div
      key={each.first}
      ref={(element) => {
        if (element) shown.current.set(index, element)
        else shown.current.delete(index)
      }}
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
        fill={inner > 0 ? inner : undefined}
      >
        {(layout) => (
          <SheetOverlay
            layout={layout}
            scroller={noScroller}
            performance={performance}
            headings={headings}
            positions={positions}
            chordNames={chordNames}
            tempos={tempos}
            current={current}
            loop={loop}
            onJump={onJump}
            onLoopChange={onLoopChange}
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
        // Room to scroll the last line clear of what floats over the sheet's foot (`--float-room`).
        className="flex h-full scroll-pb-(--float-room) flex-col overflow-y-auto overscroll-contain pb-(--float-room)"
        style={{ gap: LINE_GAP }}
      >
        {lines.map(line)}
      </section>
    )

  const lineHeight = labels + staffHeight(undefined, staves.length) * scale + LINE_GAP
  const dealt = paginate(
    lines.map((each, index) => ({ each, index })),
    () => lineHeight,
    PAGE.height - 2 * margin - (title ? LABELS.chords : 0),
  )
  return (
    <PageCanvas column={PAGE.width}>
      <PlayingInSight line={() => shown.current.get(playing)} playing={playing} />
      <section aria-label={t('sheet.label')} className="flex flex-col items-center gap-8 p-6">
        {dealt.map((page, number) => (
          <article
            key={number}
            data-slot="sheet-page"
            className="relative flex flex-col bg-card text-card-foreground shadow-lg shadow-foreground/10 ring-1 ring-hairline"
            style={{
              width: PAGE.width,
              minHeight: PAGE.height,
              padding: margin,
              gap: LINE_GAP,
            }}
          >
            {number === 0 && title ? (
              <h2 className="text-center font-display text-3xl">{title}</h2>
            ) : null}
            {page.map(({ each, index }) => line(each, index))}
            <span
              aria-hidden
              className="absolute inset-x-0 text-center text-xs text-muted-foreground"
              style={{ bottom: margin / 2 }}
            >
              {number + 1}
            </span>
          </article>
        ))}
      </section>
    </PageCanvas>
  )
}

/** The line playing brought into sight on the page canvas as it starts (ADR 0075). */
function PlayingInSight({
  line,
  playing,
}: {
  line: () => HTMLDivElement | undefined
  playing: number
}) {
  const reveal = useCanvasReveal()
  useEffect(() => {
    const element = line()
    if (element && reveal && playing >= 0) reveal(element)
    // Only as the playing line changes, not as the function reading it is made again.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, reveal])
  return null
}
