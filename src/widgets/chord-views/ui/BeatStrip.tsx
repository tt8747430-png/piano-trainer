import { useLayoutEffect, useMemo, useRef } from 'react'
import type { BarRange, CellBar, PlayedBeat } from '@/features/practice'
import { cn, useElementSize } from '@/shared/lib'
import type { Performance } from '@/shared/lib/arrangement'
import type { Tick } from '@/shared/lib/music'
import { CellChords } from '@/widgets/chord-chart'
import { stripNames } from '../model/strip-names'

/** Where the beat sounding stands along the strip: a third of the way in. */
const STANDS = 1 / 3
/** A quarter rest in the music font: where the music turns to no chord. */
const REST = '\u{1D13D}'

/** Each bar's first beat, counted along the strip from 0. */
function firstBeats(bars: readonly CellBar[]): number[] {
  const firsts: number[] = []
  let counted = 0
  for (const { cells } of bars) {
    firsts.push(counted)
    counted += cells.length
  }
  return firsts
}

/**
 * The beat strip (ADR 0099, 0101, Chordify's): every beat of the music as played in one row, the
 * repeats taken, a barline before each bar, a chord named only in the beat where it changes and a
 * rest where the music turns to none (`stripNames`), the beat sounding filled with the ink, the
 * loop's beats on its band. It slides as the music goes, the beat sounding a third of the way in (at
 * once under reduced motion); a beat tapped takes the cursor there (`onBeat`, the tick it is played
 * at). It is a picture of where the music is, hidden from a screen reader, its beats out of the tab
 * order: the transport and the other views' bars are the way through.
 */
export function BeatStrip({
  performance,
  bars,
  beat,
  loop,
  onBeat,
  className,
}: {
  performance: Performance
  /** Every bar as played, in beats (`playedBeatCells`). */
  bars: readonly CellBar[]
  beat: PlayedBeat
  loop: BarRange | null
  onBeat: (at: Tick) => void
  className?: string
}) {
  const frame = useRef<HTMLDivElement>(null)
  const row = useRef<HTMLDivElement>(null)
  const { width } = useElementSize(frame)
  const firsts = useMemo(() => firstBeats(bars), [bars])
  const names = useMemo(() => stripNames(performance, bars), [performance, bars])
  const sounding = (firsts[beat.bar] ?? 0) + beat.beat
  // The strip moved under its frame, the beat sounding a third of the way in: measured, so it holds
  // at the reader's text size.
  useLayoutEffect(() => {
    const strip = row.current
    const cell = strip?.querySelector<HTMLElement>(`[data-cell="${sounding}"]`)
    if (!strip || !cell) return
    const room = frame.current?.clientWidth ?? width
    const x = room * STANDS - (cell.offsetLeft + cell.offsetWidth / 2)
    strip.style.transform = `translateX(${x}px)`
  }, [sounding, width])
  return (
    <div
      ref={frame}
      aria-hidden
      data-slot="beat-strip"
      className={cn('overflow-hidden', className)}
    >
      <div
        ref={row}
        className="relative flex w-max transition-transform duration-200 ease-out motion-reduce:transition-none"
      >
        {bars.map(({ played, cells }, index) => {
          const start = performance.bars[played]?.startTick ?? 0
          const looped = loop !== null && played >= loop.first && played <= loop.last
          return (
            <div
              key={played}
              className="flex border-y border-l-2 border-y-border border-l-foreground bg-card last:border-r-2 last:border-r-foreground"
            >
              {cells.map(({ from }, at) => {
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
                    onClick={() => onBeat(start + from)}
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
            </div>
          )
        })}
      </div>
    </div>
  )
}
