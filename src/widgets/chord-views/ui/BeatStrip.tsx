import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import type { BarRange, CellBar, PlayedBeat } from '@/features/practice'
import { barUnder, cn, useElementSize } from '@/shared/lib'
import type { Performance } from '@/shared/lib/arrangement'
import type { Tick } from '@/shared/lib/music'
import { LoopGrip } from '@/shared/ui'
import { CellChords } from '@/widgets/chord-chart'
import { firstBeats } from '../model/strip-place'
import { stripNames } from '../model/strip-names'
import { pageOf, stripPages } from '../model/strip-pages'

/** A quarter rest in the music font: where the music turns to no chord. */
const REST = '\u{1D13D}'

/**
 * The beat strip (ADR 0108, R29: Chordify's): the music's beats as played, a page at a time, the
 * repeats taken, a barline before each bar, a chord named only in the beat where it changes and a
 * rest where the music turns to none (`stripNames`), the beat sounding a black box, the loop's beats
 * on its band, a grip at each of its ends dragging it bar by bar (`onLoop`). The strip stands still: the box moves beat by beat, and when it leaves the page the
 * strip turns to the next (`stripPages`: each line of the chart a page, split where the room is
 * short). A loop inside a page never turns it. A beat tapped takes the cursor there (`onBeat`, the
 * tick it is played at). It is a picture of where the music is, hidden from a screen reader, its
 * beats out of the tab order: the transport and the other views' bars are the way through.
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
  // How many beats the room holds: its width over a beat's, once both are laid out.
  const frame = useRef<HTMLDivElement>(null)
  const { width } = useElementSize(frame)
  const [beatWidth, setBeatWidth] = useState(0)
  useLayoutEffect(() => {
    setBeatWidth(frame.current?.querySelector<HTMLElement>('[data-cell]')?.offsetWidth ?? 0)
  }, [width])
  const room = width > 0 && beatWidth > 0 ? Math.max(1, Math.floor(width / beatWidth)) : Infinity
  const pages = useMemo(() => stripPages(bars, room), [bars, room])
  const page = pages[pageOf(pages, beat.bar)] ?? []
  return (
    <div
      ref={frame}
      aria-hidden
      data-slot="beat-strip"
      data-page={pageOf(pages, beat.bar)}
      className={cn('overflow-hidden select-none', className)}
    >
      <div className="flex w-max">
        {page.map((index) => {
          const bar = bars[index]
          if (!bar) return null
          const { played, cells } = bar
          const looped = loop !== null && played >= loop.first && played <= loop.last
          return (
            <div
              key={played}
              data-bar={played}
              className="relative flex border-y border-l-2 border-y-border border-l-foreground bg-card last:border-r-2 last:border-r-foreground"
            >
              {cells.map((_, at) => {
                const cell = (firsts[index] ?? 0) + at
                const named = names[index]?.[at]
                return (
                  <button
                    key={at}
                    type="button"
                    tabIndex={-1}
                    data-cell={cell}
                    data-sounding={cell === sounding ? '' : undefined}
                    data-looped={looped ? '' : undefined}
                    onClick={() => onBeat(ticks[cell] ?? 0)}
                    className={cn(
                      '@container flex size-14 items-end border-l border-hairline px-1 pb-1.5 first:border-l-0 sm:size-16 landscape-phone:size-10',
                      cell === sounding
                        ? 'bg-foreground text-background'
                        : looped
                          ? 'bg-ring/15'
                          : undefined,
                    )}
                  >
                    {named?.rest ? (
                      <span data-rest="" className="font-music text-3xl leading-none">
                        {REST}
                      </span>
                    ) : (
                      <CellChords symbols={named?.symbols ?? []} />
                    )}
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
