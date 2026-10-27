import { useEffect, useLayoutEffect, useRef, type RefObject } from 'react'
import { animate, useMotionValue } from 'motion/react'
import { useDrag, useWheel } from '@use-gesture/react'
import type { CellBar } from '@/features/practice'
import { useElementSize, wasCanceled } from '@/shared/lib'
import type { Performance } from '@/shared/lib/arrangement'
import type { Tick } from '@/shared/lib/music'
import {
  beatThrough,
  GLIDE_MS,
  stripDrawn,
  stripEnds,
  stripRelease,
  stripShift,
  type StripLayout,
} from './strip-place'
import { useEveryFrame } from './use-every-frame'

/** How the strip slides to a beat it is taken to, not played or flung to: a tap's, a step's. */
const SLIDE = { duration: 0.3, ease: 'easeOut' } as const
/** How long the strip waits on the music to come to the beat it was let go on, at most. */
const WAIT_MS = 1000
/** How many beats on from the beat let go on the music may start: the beat group there or the next. */
const STARTS_WITHIN = 4

/** The beat the strip was let go on, held until the music stands there. */
interface Waiting {
  readonly cell: number
  /** The beat sounding as it was let go: while nothing plays, the music has come once it is not. */
  readonly left: number
  readonly since: number
}

/**
 * Where the beat strip stands and how it moves (ADR 0108). It is drawn at a base, the beat
 * sounding at the mark (Listen's clock's place frame by frame while it plays), plus an offset that
 * eases to nothing, so a move never fights the clock: a beat tapped or stepped to slides there in
 * 300ms, a flick glides on, slowing. A finger, a mouse or a trackpad's sideways scroll drags it, one
 * to one and a rubber band past its ends, taking it from the clock; let go, it settles on the beat
 * its glide comes to rest at (at once under reduced motion) and the cursor goes there (`onBeat`, the
 * music going on from there while it plays), the strip held on that beat until the music stands on
 * it. Taken away by the browser, it slides back. A beat clicked at a drag's end is no tap. Its
 * `frame` holds the `row` of beats (each a `data-cell`), measured as drawn.
 */
export function useStripMotion({
  performance,
  bars,
  sounding,
  ticks,
  clock,
  still,
  onBeat,
}: {
  performance: Performance
  bars: readonly CellBar[]
  /** The beat sounding along the strip: the cursor's while nothing plays. */
  sounding: number
  /** Each beat's tick, along the strip. */
  ticks: readonly Tick[]
  /** Listen's clock while it plays. */
  clock: (() => Tick | null) | null
  still: boolean
  onBeat: (at: Tick) => void
}): {
  frame: RefObject<HTMLDivElement | null>
  row: RefObject<HTMLDivElement | null>
  onPointerDownCapture: () => void
  onClickCapture: (event: { preventDefault(): void; stopPropagation(): void }) => void
} {
  const frame = useRef<HTMLDivElement>(null)
  const row = useRef<HTMLDivElement>(null)
  const { width } = useElementSize(frame)
  // Each beat's place along the strip as drawn: measured, so it holds at the reader's text size.
  const places = useRef<{ lefts: number[]; widths: number[] }>({ lefts: [], widths: [] })
  useLayoutEffect(() => {
    const cells = [...(row.current?.querySelectorAll<HTMLElement>('[data-cell]') ?? [])]
    places.current = {
      // The row is each beat's offset parent.
      lefts: cells.map((cell) => cell.offsetLeft),
      widths: cells.map((cell) => cell.offsetWidth),
    }
  }, [bars, width])
  const offset = useMotionValue(0)
  const drawn = useRef(0)
  const held = useRef(false)
  const dragged = useRef(false)
  const waiting = useRef<Waiting | null>(null)
  const wheelFrom = useRef(0)
  const moving = clock !== null && !still
  const latest = useRef({ sounding, moving, clock })
  useLayoutEffect(() => {
    latest.current = { sounding, moving, clock }
  })

  const layout = (): StripLayout => ({ room: frame.current?.clientWidth ?? 0, ...places.current })
  /** Where the strip stands with no offset: the music's place, or the beat waited for. */
  const base = (): number => {
    const strip = layout()
    const { moving: playing, clock: read, sounding: cell } = latest.current
    const tick = playing ? read?.() : null
    if (tick !== null && tick !== undefined) {
      const place = beatThrough(performance, bars, tick)
      const wait = waiting.current
      const come = wait && place.cell >= wait.cell && place.cell <= wait.cell + STARTS_WITHIN
      if (wait && (come || Date.now() - wait.since > WAIT_MS)) waiting.current = null
      if (!waiting.current) return stripShift({ ...strip, ...place })
    }
    return stripShift({ ...strip, cell: waiting.current?.cell ?? cell, through: 0 })
  }
  const draw = (x: number) => {
    drawn.current = x
    if (row.current) row.current.style.transform = `translateX(${x}px)`
  }
  const write = () => {
    if (!held.current) draw(base() + offset.get())
  }
  /** The base moved at once (a tap, a step, a stop): the strip slides from where it was drawn. */
  const rebase = () => {
    const to = base()
    if (still) {
      offset.jump(0)
      draw(to)
    } else {
      offset.jump(drawn.current - to)
      void animate(offset, 0, SLIDE)
    }
  }

  useEffect(() => offset.on('change', write))
  useEveryFrame(write, moving)
  const shown = useRef<{ sounding: number; moving: boolean } | null>(null)
  useLayoutEffect(() => {
    if (held.current) return
    const before = shown.current
    shown.current = { sounding, moving }
    const wait = waiting.current
    if (wait && !moving) {
      if (sounding === wait.left) return write()
      waiting.current = null
      // Come to the beat it glides to; elsewhere (the beat group after it), on there.
      return sounding === wait.cell ? write() : rebase()
    }
    // As it opens it stands where the music is; it slides as a tap or a step takes it, or a stop.
    if (before === null || moving || (before.sounding === sounding && !before.moving)) write()
    else rebase()
  })

  /** Taken in hand: from the clock, from any glide. */
  const grab = () => {
    offset.stop()
    held.current = true
    dragged.current = true
  }
  const dragTo = (shift: number) => {
    const strip = layout()
    draw(stripDrawn(shift, stripEnds(strip), strip.room))
  }
  /** Let go with a `velocity` (px a millisecond): settled on a beat, the cursor goes there. */
  const release = (velocity: number) => {
    held.current = false
    const shift = drawn.current
    const cell = stripRelease({ ...layout(), shift, velocity, still })
    waiting.current = { cell, left: latest.current.sounding, since: Date.now() }
    offset.jump(shift - base())
    if (still) offset.jump(0)
    else
      void animate(offset, 0, {
        type: 'inertia',
        velocity: velocity * 1000,
        power: GLIDE_MS / 1000,
        timeConstant: GLIDE_MS,
        modifyTarget: () => 0,
        restDelta: 0.5,
      })
    write()
    const at = ticks[cell]
    if (at !== undefined) onBeat(at)
  }
  /** Taken away by the browser: back where the music is. */
  const putBack = () => {
    held.current = false
    rebase()
  }

  useDrag(
    ({ first, last, tap, offset: [x], velocity: [speed], direction: [way], event }) => {
      if (tap) return
      if (first) grab()
      if (!last) dragTo(x)
      else if (wasCanceled(event)) putBack()
      else release(speed * way)
    },
    {
      target: frame,
      axis: 'x',
      filterTaps: true,
      from: () => [drawn.current, 0],
      pointer: { keys: false },
    },
  )
  useWheel(
    ({ first, last, movement: [along], delta: [dx, dy], event }) => {
      if (first) {
        // Up and down is the page's.
        if (Math.abs(dx) <= Math.abs(dy)) return
        wheelFrom.current = drawn.current
        grab()
      }
      if (!held.current) return
      // Sideways the page goes nowhere: no swipe back through the history, no pull.
      if (!last) event.preventDefault()
      if (last) release(0)
      else dragTo(wheelFrom.current - along)
    },
    { target: frame, eventOptions: { passive: false } },
  )

  return {
    frame,
    row,
    onPointerDownCapture: () => {
      dragged.current = false
    },
    onClickCapture: (event) => {
      if (!dragged.current) return
      dragged.current = false
      event.preventDefault()
      event.stopPropagation()
    },
  }
}
