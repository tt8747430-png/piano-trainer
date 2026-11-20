import { useEffect, useMemo, useRef } from 'react'
import type { BarRange, CellBar, PlayedBeat } from '@/features/practice'
import { barUnder, cn, REDUCED_MOTION, useElementSize, useMediaQuery } from '@/shared/lib'
import type { Performance } from '@/shared/lib/arrangement'
import { printedSymbol, type Tick } from '@/shared/lib/music'
import { LeadSymbol, LoopGrip } from '@/shared/ui'
import { firstBeats } from '../model/strip-place'
import { stripNames } from '../model/strip-names'

/** A quarter rest in the music font: where the music turns to no chord. */
const REST = '\u{1D13D}'

/**
 * The beat strip (ADR 0108; loop round 61, the Player's Diagrams board): every beat as played in
 * one row, the repeats taken, each a small white cell 3px apart, a bar's first beat after an ink
 * line; a chord named in the beat where it changes and a rest where the music turns to none
 * (`stripNames`); the beat sounding filled in ink; the loop's beats on its wash, a grip at each of
 * its ends dragging it bar by bar (`onLoop`). The row follows the music, the beat sounding a third
 * of the way in; it scrolls by hand too. A beat tapped takes the cursor there (`onBeat`). It is a
 * picture of where the music is, hidden from a screen reader, its beats out of the tab order: the
 * transport and the chords' row are the way through.
 */
export function BeatStrip({
  performance,
  bars,
  beat,
  loop,
  onBeat,
  onLoop,
  className,
}: {
  performance: Performance
  /** Every bar as played, in beats (`playedBeatCells`). */
  bars: readonly CellBar[]
  beat: PlayedBeat
  loop: BarRange | null
  onBeat: (at: Tick) => void
  /** The loop dragged by a grip to other bars. */
  onLoop?: (loop: BarRange) => void
  className?: string
}) {
  const firsts = useMemo(() => firstBeats(bars), [bars])
  const names = useMemo(() => stripNames(performance, bars), [performance, bars])
  const ticks = useMemo(
    () =>
      bars.flatMap(({ played, cells }) =>
        cells.map(({ from }) => (performance.bars[played]?.startTick ?? 0) + from),
      ),
    [performance, bars],
  )
  const sounding = (firsts[beat.bar] ?? 0) + beat.beat
  const still = useMediaQuery(REDUCED_MOTION)
  const strip = useRef<HTMLDivElement>(null)
  const { width } = useElementSize(strip)
  const placed = useRef(false)
  useEffect(() => {
    const el = strip.current
    const cell = el?.querySelector<HTMLElement>(`[data-cell="${sounding}"]`)
    if (!el || !cell) return
    const left = cell.getBoundingClientRect().left - el.getBoundingClientRect().left + el.scrollLeft
    el.scrollTo({
      left: Math.max(0, left - el.clientWidth / 3),
      behavior: still || !placed.current ? 'auto' : 'smooth',
    })
    placed.current = true
  }, [sounding, still, width])
  return (
    <div
      ref={strip}
      aria-hidden
      data-slot="beat-strip"
      className={cn(
        'overflow-x-auto overflow-y-hidden overscroll-x-contain px-gutter select-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
        className,
      )}
    >
      <div className="flex w-max gap-[3px]">
        {bars.map(({ played, cells }, index) => {
          const looped = loop !== null && played >= loop.first && played <= loop.last
          return (
            <div key={`${index}-${played}`} data-bar={played} className="relative flex gap-[3px]">
              {cells.map((_, at) => {
                const cell = (firsts[index] ?? 0) + at
                const named = names[index]?.[at]
                const now = cell === sounding
                return (
                  <button
                    key={at}
                    type="button"
                    tabIndex={-1}
                    data-cell={cell}
                    data-sounding={now ? '' : undefined}
                    data-looped={looped ? '' : undefined}
                    onClick={() => onBeat(ticks[cell] ?? 0)}
                    className={cn(
                      'relative size-11 shrink-0 rounded-[3px] lg:size-13',
                      at === 0 && 'border-l-3 border-foreground',
                      now
                        ? 'bg-foreground text-background'
                        : looped
                          ? 'bg-paint-yellow text-foreground'
                          : 'bg-card text-foreground',
                    )}
                  >
                    {named?.rest ? (
                      <span
                        data-rest=""
                        className="absolute top-1/2 left-1.5 -translate-y-1/2 font-music text-2xl leading-none lg:left-2.5"
                      >
                        {REST}
                      </span>
                    ) : named && named.symbols.length > 0 ? (
                      <span
                        data-chords=""
                        className="absolute top-1/2 left-1.5 z-1 -translate-y-1/2 text-lg leading-none font-medium whitespace-nowrap lg:left-2.5 lg:text-[1.375rem]"
                      >
                        {named.symbols.map((symbol, i) => (
                          <span key={i}>
                            {i > 0 ? ' ' : ''}
                            <LeadSymbol text={printedSymbol(symbol)} />
                          </span>
                        ))}
                      </span>
                    ) : null}
                  </button>
                )
              })}
              {loop && onLoop && played === loop.first ? (
                <LoopGrip
                  pointerOnly
                  end="start"
                  bar={loop.first}
                  min={0}
                  max={loop.last}
                  barAt={barUnder}
                  style={{ left: 0, top: 0, height: '100%' }}
                  onMove={(first) => onLoop({ first, last: loop.last })}
                />
              ) : null}
              {loop && onLoop && played === loop.last ? (
                <LoopGrip
                  pointerOnly
                  end="end"
                  bar={loop.last}
                  min={loop.first}
                  max={performance.bars.length - 1}
                  barAt={barUnder}
                  style={{ left: '100%', top: 0, height: '100%' }}
                  onMove={(last) => onLoop({ first: loop.first, last })}
                />
              ) : null}
            </div>
          )
        })}
      </div>
    </div>
  )
}
