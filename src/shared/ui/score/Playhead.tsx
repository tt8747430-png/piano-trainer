import { useEffect, useEffectEvent, useLayoutEffect, useRef, type RefObject } from 'react'
import { cn, useScrollMotion } from '@/shared/lib'
import type { Tick } from '@/shared/lib/music'
import { useCanvasReveal } from '../canvas-reveal'
import type { ScoreLayout } from './layout'
import { followScroll, playheadSpan, playheadX } from './playhead-place'

/**
 * The playhead (ADR 0096), the Player's and the editor's alike in every layout: one thin line across
 * the system at the time that sounds, from its highest staff's top line to its lowest's foot, the
 * same height wherever it stands. It stands at `tick`; while the music plays it follows `clock` every
 * frame, between the onsets. It moves by `left`, never a transform: a transform would make the pages
 * round it one picture, which Safari scales blurry when they are zoomed. The sheet follows it: its
 * line comes into sight as it comes onto it (on a page canvas, the canvas moves to it), and a line
 * wider than its `scroller` scrolls to keep it in its middle half.
 */
export function Playhead({
  layout,
  tick,
  clock,
  scroller,
  hidden = false,
}: {
  layout: ScoreLayout
  /** Where it stands, in the layout's ticks: the notes awaited, where Play starts or stopped. */
  tick: Tick
  /**
   * Where the music is now, in the layout's ticks, read every frame while it plays: it moves with
   * it, waiting at the line's end once the music is past it; null (before the music starts), it
   * stays where it is.
   */
  clock?: (() => Tick | null) | null | undefined
  /** The line's own sideways scroller, where it is wider than the screen. */
  scroller?: RefObject<HTMLElement | null> | undefined
  /** Out of sight, the sheet still following it (the Player's, while its loop stands chosen). */
  hidden?: boolean
}) {
  const line = useRef<HTMLDivElement>(null)
  const first = layout.measures[0]
  const last = layout.measures.at(-1)
  const start = first?.startTick ?? 0
  const end = last ? last.startTick + last.ticks : 0
  const moving = typeof clock === 'function'
  // The music on this line now; none before it starts, or gone round to an earlier line.
  const heard = useEffectEvent((): Tick | null => {
    const at = clock?.() ?? null
    return at === null || at < start ? null : Math.min(at, end)
  })
  useLayoutEffect(() => {
    const element = line.current
    if (!element) return
    const place = (at: Tick) => {
      element.style.left = `${playheadX(layout, at)}px`
    }
    place(heard() ?? tick)
    if (!moving) return
    let frame = requestAnimationFrame(function follow() {
      const at = heard()
      if (at !== null) place(at)
      frame = requestAnimationFrame(follow)
    })
    return () => cancelAnimationFrame(frame)
  }, [layout, tick, moving])

  const reveal = useCanvasReveal()
  const motion = useScrollMotion()
  // Its line into sight as it comes onto it, as the Player's line playing always came.
  const bring = useEffectEvent(() => {
    const shown = line.current?.closest('[data-slot="sheet-line"]')
    if (!shown) return
    if (reveal) reveal(shown)
    else shown.scrollIntoView({ block: 'nearest', behavior: motion })
  })
  useEffect(() => bring(), [])
  // Along a line wider than its scroller: kept in its middle half, a beat group at a time. Its x
  // counts from the engraving's box, which sits `offsetLeft` into the scroller.
  const x = playheadX(layout, tick)
  useEffect(() => {
    const view = scroller?.current
    const box = line.current?.parentElement
    if (!view || !box || view.scrollWidth <= view.clientWidth) return
    const left = followScroll(box.offsetLeft + x, {
      left: view.scrollLeft,
      width: view.clientWidth,
    })
    if (left !== null) view.scrollTo({ left, behavior: motion })
  }, [scroller, x, motion])

  return (
    <div
      ref={line}
      aria-hidden
      data-slot="playhead"
      className={cn(
        'pointer-events-none absolute z-0 w-0.5 rounded-full bg-ring',
        !moving && 'transition-[left] duration-200 ease-out motion-reduce:transition-none',
        hidden && 'invisible',
      )}
      style={playheadSpan(layout)}
    />
  )
}
