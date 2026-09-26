import { useRef, type KeyboardEvent, type PointerEvent, type RefObject } from 'react'
import { useTranslation } from 'react-i18next'
import {
  keysInView,
  PIANO_LAYOUT,
  scrollByOctave,
  scrollToCentre,
  useMediaQuery,
  viewFrame,
  type ScrollMetrics,
} from '@/shared/lib'
import { printedKeyName, type Midi } from '@/shared/lib/music'
import { useScrollView } from './use-scroll-view'

/** The map's black keys never change: drawn once. */
const BLACK_KEYS = PIANO_LAYOUT.keys
  .filter((key) => key.black)
  .map((key) => (
    <span
      key={key.midi}
      className="absolute top-0 h-3/5 bg-key-black"
      style={{ left: `${key.left}%`, width: `${key.width}%` }}
    />
  ))

/** Where each key takes the view: an octave either way, or an end. */
const MOVES: Readonly<Partial<Record<string, (metrics: ScrollMetrics) => number>>> = {
  ArrowLeft: (metrics) => scrollByOctave(metrics, PIANO_LAYOUT.whites, -1),
  ArrowDown: (metrics) => scrollByOctave(metrics, PIANO_LAYOUT.whites, -1),
  ArrowRight: (metrics) => scrollByOctave(metrics, PIANO_LAYOUT.whites, 1),
  ArrowUp: (metrics) => scrollByOctave(metrics, PIANO_LAYOUT.whites, 1),
  Home: () => 0,
  End: ({ clientWidth, scrollWidth }) => Math.max(0, scrollWidth - clientWidth),
}

/**
 * The keyboard map: all 88 keys small in the rail, a frame round the stretch in view, dots on the
 * keys marked or down. A slider: tap or drag it to move there, the arrow keys step an octave.
 */
export function KeyboardMap({
  scroller,
  dots,
}: {
  scroller: RefObject<HTMLElement | null>
  dots: ReadonlySet<Midi>
}) {
  const { t } = useTranslation('common')
  const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const dragging = useRef<number | null>(null)
  const metrics = useScrollView(scroller)
  const frame = viewFrame(metrics)
  const edges = keysInView(PIANO_LAYOUT.keys, frame)
  const room = Math.max(0, metrics.scrollWidth - metrics.clientWidth)

  const moveView = (left: number, smooth: boolean) =>
    scroller.current?.scrollTo({ left, behavior: smooth && !reduceMotion ? 'smooth' : 'instant' })

  const moveToPoint = (event: PointerEvent<HTMLDivElement>) => {
    const box = event.currentTarget.getBoundingClientRect()
    if (box.width > 0)
      moveView(scrollToCentre(metrics, (event.clientX - box.left) / box.width), false)
  }

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const move = MOVES[event.key]
    if (!move) return
    event.preventDefault()
    moveView(move(metrics), true)
  }

  return (
    <div
      role="slider"
      tabIndex={0}
      aria-label={t('rail.map')}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={room === 0 ? 0 : Math.round((metrics.scrollLeft / room) * 100)}
      aria-valuetext={
        edges
          ? t('rail.mapRange', { from: printedKeyName(edges.from), to: printedKeyName(edges.to) })
          : undefined
      }
      onKeyDown={onKeyDown}
      onPointerDown={(event) => {
        dragging.current = event.pointerId
        moveToPoint(event)
      }}
      onPointerMove={(event) => {
        if (dragging.current === event.pointerId && event.buttons !== 0) moveToPoint(event)
      }}
      onPointerUp={() => {
        dragging.current = null
      }}
      onPointerCancel={() => {
        dragging.current = null
      }}
      className="relative flex h-11 w-full touch-none items-end rounded-sm px-1 pb-0.5 outline-none focus-visible:ring-3 focus-visible:ring-ring"
    >
      {/* The strip and its dots share one box, so a key's place is a share of the strip's width. */}
      <div aria-hidden className="relative h-6 w-full">
        <div className="absolute inset-x-0 top-0 h-4 overflow-hidden rounded-xs bg-key-white">
          {BLACK_KEYS}
          <span
            className="absolute inset-y-0 rounded-xs ring-2 ring-primary ring-inset"
            style={{ left: `${frame.left * 100}%`, width: `${frame.width * 100}%` }}
          />
        </div>
        {PIANO_LAYOUT.keys
          .filter((key) => dots.has(key.midi))
          .map((key) => (
            <span
              key={key.midi}
              className="absolute bottom-0 size-1 -translate-x-1/2 rounded-full bg-key-scale"
              style={{ left: `${key.left + key.width / 2}%` }}
            />
          ))}
      </div>
    </div>
  )
}
