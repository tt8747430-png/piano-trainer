import { useLayoutEffect, useMemo, useRef } from 'react'
import type { BarRange, CellBar, PlayedBeat } from '@/features/practice'
import { cn, useElementSize, useMediaQuery } from '@/shared/lib'
import type { Performance } from '@/shared/lib/arrangement'
import type { Tick } from '@/shared/lib/music'
import { CellChords } from '@/widgets/chord-chart'
import { beatThrough, firstBeats, stripShift } from '../model/strip-place'
import { stripNames } from '../model/strip-names'
import { useEveryFrame } from '../model/use-every-frame'

/** A quarter rest in the music font: where the music turns to no chord. */
const REST = '\u{1D13D}'
/** How the strip slides to a beat it is taken to, not played to: a tap's, a step's. */
const SLIDE = 'transform 300ms ease-out'

/**
 * The beat strip (ADR 0099, 0101, 0108, Chordify's): every beat of the music as played in one row,
 * the repeats taken, a barline before each bar, a chord named only in the beat where it changes and a
 * rest where the music turns to none (`stripNames`), the beat sounding filled with the ink, the
 * loop's beats on its band. While Listen plays it slides with its clock frame by frame
 * (`stripShift`), the beat sounding's middle a third of the way in as it starts; taken to a beat (a
 * tap, a step) it slides there; under reduced motion it stands still at each beat. Its frame fades
 * at both edges, so a name running past one is never cut hard, and it scrolls nothing: it is moved.
 * A beat tapped takes the cursor there (`onBeat`, the tick it is played at). It is a picture of where
 * the music is, hidden from a screen reader, its beats out of the tab order: the transport and the
 * other views' bars are the way through.
 */
export function BeatStrip({
  performance,
  bars,
  beat,
  loop,
  clock,
  onBeat,
  className,
}: {
  performance: Performance
  /** Every bar as played, in beats (`playedBeatCells`). */
  bars: readonly CellBar[]
  beat: PlayedBeat
  loop: BarRange | null
  /** Listen's clock while it plays: where the music is between its beat groups. */
  clock: (() => Tick | null) | null
  onBeat: (at: Tick) => void
  className?: string
}) {
  const frame = useRef<HTMLDivElement>(null)
  const row = useRef<HTMLDivElement>(null)
  const { width } = useElementSize(frame)
  const still = useMediaQuery('(prefers-reduced-motion: reduce)')
  const firsts = useMemo(() => firstBeats(bars), [bars])
  const names = useMemo(() => stripNames(performance, bars), [performance, bars])
  const sounding = (firsts[beat.bar] ?? 0) + beat.beat
  // Each beat's place along the strip as drawn: measured, so it holds at the reader's text size.
  const places = useRef<{ lefts: number[]; widths: number[] }>({ lefts: [], widths: [] })
  const moving = clock !== null && !still
  // Placed once: the strip opens where the music is, sliding only once it is there.
  const placed = useRef(false)
  const place = (cell: number, through: number, slide: boolean) => {
    const strip = row.current
    if (!strip) return
    const room = frame.current?.clientWidth ?? width
    const x = stripShift({ room, ...places.current, cell, through })
    strip.style.transition = slide && placed.current && !still ? SLIDE : 'none'
    placed.current = true
    strip.style.transform = `translateX(${x}px)`
  }
  useLayoutEffect(() => {
    const cells = [...(row.current?.querySelectorAll<HTMLElement>('[data-cell]') ?? [])]
    places.current = {
      // The row is each beat's offset parent.
      lefts: cells.map((cell) => cell.offsetLeft),
      widths: cells.map((cell) => cell.offsetWidth),
    }
  }, [bars, width])
  // Where nothing moves it, it stands at the beat sounding, sliding there as a tap or a step takes it.
  useLayoutEffect(() => {
    if (!moving) place(sounding, 0, true)
  })
  useEveryFrame(() => {
    const tick = clock?.()
    if (tick === null || tick === undefined) return
    const { cell, through } = beatThrough(performance, bars, tick)
    place(cell, through, false)
  }, moving)
  return (
    <div
      ref={frame}
      aria-hidden
      data-slot="beat-strip"
      className={cn(
        'overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_1.5rem,#000_calc(100%-1.5rem),transparent)]',
        className,
      )}
    >
      <div ref={row} className="relative flex w-max will-change-transform">
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
