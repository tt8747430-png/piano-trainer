import { useEffect, useLayoutEffect, useRef, type RefObject } from 'react'
import { animate, useMotionValue } from 'motion/react'
import { useDrag, useWheel } from '@use-gesture/react'
import { wasCanceled } from '@/shared/lib'
import { pairRelease, pairSwipe } from './swipe'
import { useEveryFrame } from './use-every-frame'

/** The pair's spring, an iOS page's: quick, with no bounce. */
const SPRING = { type: 'spring', stiffness: 380, damping: 38 } as const
/** How long the pair waits on the music to come to the chord it was swiped to, at most. */
const WAIT_MS = 700
/** How long the pair takes to settle into its places once the music is there: its slots' slide. */
const SETTLE_MS = 300

/** How far the pair is drawn along to land each way: its next or its chord before in the first place. */
export interface PairLanding {
  readonly on: number
  readonly back: number
}

/** A swipe's state on a wheel: not the pair's (up and down), following, or gone a chord. */
type Wheel = 'page' | 'following' | 'gone'

/**
 * How the Diagrams view's pair moves (ADR 0108). Its diagrams stand in their slots, moved on by
 * two numbers in diagrams' widths: `--slide`, the clock's (`slide`, frame by frame while `moving`),
 * and `--swipe`, a finger's, added to it, so a swipe never fights the clock. A finger, a mouse or a
 * trackpad's sideways scroll draws the pair along one to one, a rubber band towards an end with no
 * chord (`before`, `after`); let go past a third of a diagram or with a flick it springs on to land
 * (`landing`) and the cursor goes there (`onSwipe`), else it springs back; a trackpad goes one chord
 * a gesture. Once the music stands on the chord swiped to, the pair settles into its slots as a step
 * does. Under reduced motion nothing springs. A diagram clicked at a drag's end is no tap.
 */
export function usePairMotion({
  now,
  before,
  after,
  landing,
  moving,
  still,
  slide,
  onSwipe,
}: {
  /** The chord sounding: what changes once a swipe has gone there. */
  now: number | null
  before: boolean
  after: boolean
  landing: PairLanding
  moving: boolean
  still: boolean
  /** How far the clock has slid the pair on, from 0 to 1. */
  slide: () => number
  onSwipe: (way: 1 | -1) => void
}): {
  pair: RefObject<HTMLDivElement | null>
  onPointerDownCapture: () => void
  onClickCapture: (event: { preventDefault(): void; stopPropagation(): void }) => void
} {
  const pair = useRef<HTMLDivElement>(null)
  const swipe = useMotionValue(0)
  const dragged = useRef(false)
  const wheel = useRef<Wheel>('page')
  /** The chord sounding as a swipe went on, until the music has moved from it. */
  const waiting = useRef<{ readonly from: number | null } | null>(null)
  const latest = useRef({ now, before, after, landing, slide, onSwipe })
  useLayoutEffect(() => {
    latest.current = { now, before, after, landing, slide, onSwipe }
  })

  const paint = () => {
    const drawn = pair.current
    if (!drawn) return
    drawn.style.setProperty('--slide', String(latest.current.slide()))
    drawn.style.setProperty('--swipe', String(swipe.get()))
  }
  useLayoutEffect(paint)
  useEveryFrame(paint, moving)
  useEffect(() => swipe.on('change', paint))

  /** A diagram's width: how far a whole swipe goes. */
  const width = () =>
    pair.current?.querySelector('[data-diagram]')?.getBoundingClientRect().width ?? 0
  const swiping = (on: boolean) => pair.current?.toggleAttribute('data-swiping', on)
  const ends = () => ({ before: latest.current.before, after: latest.current.after })

  const springBack = (velocity: number) => {
    if (still) {
      swipe.jump(0)
      swiping(false)
    } else void animate(swipe, 0, { ...SPRING, velocity, onComplete: () => swiping(false) })
  }
  const go = (way: 1 | -1, velocity: number) => {
    const { landing: land, now: from } = latest.current
    const to = way === 1 ? land.on : land.back
    waiting.current = { from }
    if (still) swipe.jump(to)
    else void animate(swipe, to, { ...SPRING, velocity })
    latest.current.onSwipe(way)
    // The music never came (the cursor could not go there): back where it was.
    setTimeout(() => {
      if (waiting.current?.from !== from) return
      waiting.current = null
      springBack(0)
    }, WAIT_MS)
  }

  // The music is on the chord swiped to: the pair settles into its slots, sliding as a step does.
  useLayoutEffect(() => {
    const drawn = pair.current
    if (!waiting.current || now === waiting.current.from || !drawn) return
    waiting.current = null
    swipe.stop()
    swipe.jump(0)
    swiping(false)
    if (!still) {
      drawn.setAttribute('data-settling', '')
      setTimeout(() => drawn.removeAttribute('data-settling'), SETTLE_MS)
    }
    paint()
  })

  useDrag(
    ({ first, last, tap, offset: [x], velocity: [speed], direction: [dir], event }) => {
      if (tap || waiting.current) return
      const along = width()
      if (first) {
        swipe.stop()
        swiping(true)
        dragged.current = true
      }
      if (!last) return swipe.set(pairSwipe(x, along, ends()))
      if (wasCanceled(event)) return springBack(0)
      const velocity = speed * dir
      // The finger's speed, in diagrams a second.
      const carried = along > 0 ? (-velocity / along) * 1000 : 0
      const way = pairRelease({ offset: x, velocity, width: along, ...ends() })
      if (way === 0) springBack(carried)
      else go(way, carried)
    },
    {
      target: pair,
      axis: 'x',
      filterTaps: true,
      from: () => [-swipe.get() * width(), 0],
      pointer: { keys: false },
    },
  )
  useWheel(
    ({ first, last, movement: [along], delta: [dx, dy], event }) => {
      if (first) {
        // Up and down is the page's.
        wheel.current = Math.abs(dx) > Math.abs(dy) && !waiting.current ? 'following' : 'page'
        if (wheel.current === 'following') {
          swipe.stop()
          swiping(true)
        }
      }
      if (wheel.current === 'page') return
      // Sideways the page goes nowhere: no swipe back through the history, no pull.
      if (!last) event.preventDefault()
      // One chord a gesture: the rest of its scroll goes nowhere.
      if (wheel.current === 'gone') return
      if (last) return springBack(0)
      const offset = -along
      const way = pairRelease({ offset, velocity: 0, width: width(), ...ends() })
      if (way === 0) return swipe.set(pairSwipe(offset, width(), ends()))
      wheel.current = 'gone'
      go(way, 0)
    },
    { target: pair, eventOptions: { passive: false } },
  )

  return {
    pair,
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
