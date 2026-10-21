import { useEffect, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import type { BarRange } from '@/features/practice'
import type { Performance } from '@/shared/lib/arrangement'
import { PAGE, paginate, useElementSize, useScrollMotion } from '@/shared/lib'
import type { Score, StaffId } from '@/shared/lib/notation'
import { ScoreView, staffHeight } from '@/shared/ui/score'
import { scoreLines, type ScoreLine } from '../model/score-lines'
import { SheetOverlay } from './SheetOverlay'

/** The labels' row over each line, and the room between lines. */
const LABELS = 44
const LINE_GAP = 16
/** A line's engraving on a screen this wide is at its own size; narrower, smaller, down to the least. */
const FULL_WIDTH = 760
const LEAST_SCALE = 0.62

/**
 * The score in the chart's lines (ADR 0064): down the screen, or dealt onto A4 pages as it will print,
 * its title on the first. Each line is justified to its bars' share of the longest line's width (bars
 * line up down the page, as a chart's do) and carries its labels, the loop's part
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
  muted: StaffId | undefined
  onJump: (beatGroup: number) => void
  onLoopChange: (loop: BarRange) => void
}) {
  const { t } = useTranslation('music')
  const box = useRef<HTMLElement>(null)
  const { width } = useElementSize(box)
  const lines = useMemo(() => scoreLines(score, performance), [score, performance])
  // Each line runs to its bars' share of the longest, so bars line up down the page as a chart's do.
  const longest = Math.max(1, ...lines.map((each) => each.score.measures.length))
  const paper = Math.min(width, PAGE.width)
  const scale = pages ? paper / PAGE.width : Math.min(1, Math.max(LEAST_SCALE, width / FULL_WIDTH))
  const margin = pages ? PAGE.margin * scale : 0
  const inner = (pages ? paper : width) - 2 * margin
  // The line the cursor is on comes into sight as it starts.
  const shown = useRef(new Map<number, HTMLDivElement>())
  const motion = useScrollMotion()
  const bar = performance.beatGroups[current]?.bar
  const playing = bar === undefined ? -1 : lines.findLastIndex((line) => line.first <= bar)
  useEffect(() => {
    shown.current.get(playing)?.scrollIntoView({ block: 'nearest', behavior: motion })
  }, [playing, motion])
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
      style={{ paddingTop: LABELS }}
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
        share={each.score.measures.length / longest}
      >
        {(layout) => (
          <SheetOverlay
            layout={layout}
            scroller={noScroller}
            performance={performance}
            headings={headings}
            positions={positions}
            chordNames={chordNames}
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
        className="flex h-full flex-col overflow-y-auto overscroll-contain"
        style={{ gap: LINE_GAP }}
      >
        {lines.map(line)}
      </section>
    )

  const lineHeight = LABELS + staffHeight(undefined, staves.length) * scale + LINE_GAP
  const dealt = paginate(
    lines.map((each, index) => ({ each, index })),
    () => lineHeight,
    PAGE.height * scale - 2 * margin - (title ? LABELS : 0),
  )
  return (
    <section
      ref={box}
      aria-label={t('sheet.label')}
      className="flex h-full flex-col items-center gap-6 overflow-y-auto overscroll-contain pb-6"
    >
      {dealt.map((page, number) => (
        <article
          key={number}
          data-slot="sheet-page"
          className="relative flex w-full flex-col bg-card text-card-foreground shadow-lg shadow-foreground/10 ring-1 ring-hairline"
          style={{
            maxWidth: PAGE.width,
            minHeight: PAGE.height * scale,
            padding: margin,
            gap: LINE_GAP,
          }}
        >
          {number === 0 && title ? (
            <h2 className="text-center font-display text-2xl">{title}</h2>
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
  )
}
