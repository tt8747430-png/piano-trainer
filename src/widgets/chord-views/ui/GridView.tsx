import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { writtenBarOf, type BarRange, type PlayedBeat } from '@/features/practice'
import { barUnder, useElementSize, useScrollMotion } from '@/shared/lib'
import type { Performance } from '@/shared/lib/arrangement'
import type { Tick } from '@/shared/lib/music'
import { LoopGrip, SheetTitle } from '@/shared/ui'
import { ChordChart } from '@/widgets/chord-chart'
import { loopedBars, playedOf } from '../model/beat-span'
import { inSight } from '../model/in-sight'
import { useFollow } from '../model/use-follow'
import { BackToPlayhead } from './BackToPlayhead'
import { gridWords } from '../model/lyric-lines'

/**
 * The Grid (ADR 0108): the music's chord chart in beats under its title, its sections headed,
 * the beat sounding filled, the loop's bars on its band, a grip at each of its ends dragging it bar by
 * bar (`onLoop`); a beat tapped takes the cursor there. Its own scroller, with room to scroll its last line clear of the transport floating over its foot. The
 * bar the cursor is in is kept in sight as the music moves on, as the sheet keeps the line playing;
 * opening, the Grid stays at its top, its title in sight, where that bar is in sight there (a loop's
 * further on is brought to). With the View's Lyrics, each bar's words under the beats they are sung
 * on (ADR 0108).
 */
export function GridView({
  title,
  performance,
  headings,
  beat,
  loop,
  words,
  playing,
  onBeat,
  onLoop,
}: {
  title: string
  performance: Performance
  headings: readonly string[]
  beat: PlayedBeat
  loop: BarRange | null
  /** The View's Lyrics: the words under the beats. */
  words: boolean
  /** Whether the music plays: a scroll by hand then pauses following (A37). */
  playing: boolean
  /** A beat tapped: the tick it is first played at. */
  onBeat: (at: Tick) => void
  /** The loop dragged by a grip to other bars. */
  onLoop: (loop: BarRange) => void
}) {
  const { t } = useTranslation('player')
  const bar = writtenBarOf(performance, beat.bar)
  const sung = useMemo(() => (words ? gridWords(performance) : undefined), [words, performance])
  const scroller = useRef<HTMLElement>(null)
  // The bar last kept in sight; none before the Grid opens.
  const kept = useRef<string | null>(null)
  const motion = useScrollMotion()
  // The one follow rule (A37): a scroll by hand while it plays pauses it, the pill brings it back.
  const follow = useFollow(scroller, playing)
  const { following, returns } = follow
  useEffect(() => {
    const box = scroller.current
    const here = box?.querySelector('[aria-current="step"]')
    const place = `${bar}:${returns}`
    if (!box || !here || !following || kept.current === place) return
    const opening = kept.current === null
    kept.current = place
    if (opening && inSight(here, box)) return
    here.scrollIntoView({ block: 'nearest', behavior: motion })
  }, [bar, motion, following, returns])
  return (
    <section
      ref={scroller}
      aria-label={t('views.grid')}
      className="flex h-full scroll-pb-(--float-room) flex-col gap-6 overflow-y-auto overscroll-contain *:shrink-0"
    >
      <SheetTitle title={title} place="lines" />
      <div className="relative mx-auto w-full">
        <ChordChart
          tap="go"
          performance={performance}
          headings={headings}
          playing={bar}
          beat={beat.beat}
          looped={loopedBars(performance, loop)}
          words={sung}
          onBar={(_, at) => onBeat(at)}
        />
        {loop ? <GridLoopGrips performance={performance} loop={loop} onLoop={onLoop} /> : null}
      </div>
      <div aria-hidden className="-mt-6 h-(--float-room) shrink-0" />
      <BackToPlayhead follow={follow} />
    </section>
  )
}

/** Where a grip stands over the chart: its centre on the bar's edge, down the bar. */
interface GripPlace {
  readonly left: number
  readonly top: number
  readonly height: number
}

/**
 * The Grid's loop grips (R37): one on the loop's first bar's left edge, one on its last bar's right,
 * where the chart lays them out. A grip dragged to a bar as written takes the loop's end to that
 * bar's pass nearest it (`playedOf`), as the loop is bars played (ADR 0115).
 */
function GridLoopGrips({
  performance,
  loop,
  onLoop,
}: {
  performance: Performance
  loop: BarRange
  onLoop: (loop: BarRange) => void
}) {
  // Over the chart, its whole box: the bars are placed from it.
  const frame = useRef<HTMLDivElement>(null)
  const { width } = useElementSize(frame)
  const first = writtenBarOf(performance, loop.first)
  const last = writtenBarOf(performance, loop.last)
  const lastWritten = performance.bars.reduce(
    (most, _, played) => Math.max(most, writtenBarOf(performance, played)),
    0,
  )
  const [places, setPlaces] = useState<{ start: GripPlace; end: GripPlace } | null>(null)
  useLayoutEffect(() => {
    setPlaces(gripPlaces(frame.current, first, last))
  }, [first, last, width])
  const bars = performance.bars.length
  return (
    <div ref={frame} className="pointer-events-none absolute inset-0 *:pointer-events-auto">
      {places ? (
        <>
          <LoopGrip
            end="start"
            bar={first}
            min={0}
            max={last}
            barAt={barUnder}
            style={places.start}
            onMove={(written) => {
              const played = playedOf(performance, written, loop.first, 0, loop.last)
              if (played !== null) onLoop({ first: played, last: loop.last })
            }}
          />
          <LoopGrip
            end="end"
            bar={last}
            min={first}
            max={lastWritten}
            barAt={barUnder}
            style={places.end}
            onMove={(written) => {
              const played = playedOf(performance, written, loop.last, loop.first, bars - 1)
              if (played !== null) onLoop({ first: loop.first, last: played })
            }}
          />
        </>
      ) : null}
    </div>
  )
}

/** Where the grips stand over the chart `frame` covers: on its first bar's left and last bar's right. */
function gripPlaces(
  frame: HTMLElement | null,
  first: number,
  last: number,
): { start: GripPlace; end: GripPlace } | null {
  const box = frame?.getBoundingClientRect()
  const chart = frame?.parentElement
  const at = (bar: number) => chart?.querySelector(`[data-bar="${bar}"]`)?.getBoundingClientRect()
  const a = at(first)
  const b = at(last)
  return box && a && b
    ? {
        start: { left: a.left - box.left, top: a.top - box.top, height: a.height },
        end: { left: b.right - box.left, top: b.top - box.top, height: b.height },
      }
    : null
}
