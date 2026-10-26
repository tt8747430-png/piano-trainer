import { useMemo } from 'react'
import type { BarRange, CellBar, PlayedBeat } from '@/features/practice'
import { cn, useMediaQuery } from '@/shared/lib'
import type { Performance } from '@/shared/lib/arrangement'
import type { Tick } from '@/shared/lib/music'
import { CellChords } from '@/widgets/chord-chart'
import { firstBeats } from '../model/strip-place'
import { stripNames } from '../model/strip-names'
import { useStripMotion } from '../model/use-strip-motion'

/** A quarter rest in the music font: where the music turns to no chord. */
const REST = '\u{1D13D}'

/**
 * The beat strip (ADR 0099, 0101, 0108, Chordify's): every beat of the music as played in one row,
 * the repeats taken, a barline before each bar, a chord named only in the beat where it changes and a
 * rest where the music turns to none (`stripNames`), the beat sounding filled with the ink, the
 * loop's beats on its band. While Listen plays it slides with its clock frame by frame
 * (`stripShift`), the beat sounding's middle a third of the way in as it starts; taken to a beat (a
 * tap, a step) it slides there; under reduced motion it stands still at each beat. Its frame fades
 * at both edges, so a name running past one is never cut hard, and it scrolls nothing: it is moved.
 * Dragged sideways (a finger, a mouse, a trackpad), it scrubs through the music and glides on after
 * a flick, settling on a beat at its mark, where the cursor goes (`useStripMotion`); up and down is
 * the page's. A beat tapped takes the cursor there (`onBeat`, the tick it is played at). It is a picture of where
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
  const still = useMediaQuery('(prefers-reduced-motion: reduce)')
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
  const { frame, row, ...taps } = useStripMotion({
    performance,
    bars,
    sounding,
    ticks,
    clock,
    still,
    onBeat,
  })
  return (
    <div
      ref={frame}
      aria-hidden
      data-slot="beat-strip"
      {...taps}
      className={cn(
        'touch-pan-y overflow-hidden overscroll-x-none select-none [mask-image:linear-gradient(to_right,transparent,#000_1.5rem,#000_calc(100%-1.5rem),transparent)]',
        className,
      )}
    >
      <div ref={row} className="relative flex w-max will-change-transform">
        {bars.map(({ played, cells }, index) => {
          const looped = loop !== null && played >= loop.first && played <= loop.last
          return (
            <div
              key={played}
              className="flex border-y border-l-2 border-y-border border-l-foreground bg-card last:border-r-2 last:border-r-foreground"
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
            </div>
          )
        })}
      </div>
    </div>
  )
}
