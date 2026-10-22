import { Maximize2, ZoomIn, ZoomOut } from 'lucide-react'
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type PointerEvent,
  type ReactNode,
} from 'react'
import { useTranslation } from 'react-i18next'
import {
  fitWidth,
  panBy,
  reveal,
  useElementSize,
  zoomAt,
  ZOOM_STEP,
  type CanvasView,
} from '@/shared/lib'
import { RevealContext } from './canvas-reveal'
import { Button } from './primitives/button'

/** How far a press moves before it is a drag of the canvas, not a click on what it holds. */
const DRAG_START = 6
/** How much a wheel's pixel of travel with Ctrl zooms: a notch of 100 a sixth of an octave, as MuseScore's. */
const WHEEL_ZOOM = Math.log(2) / 6 / 100

/**
 * Pages floating on a canvas (ADR 0075), as a notation app's page view: drawn at their print size,
 * moved by a drag (a click or a double click on them still reaches them), zoomed by a pinch, by Ctrl
 * or ⌘ with the wheel, or by its buttons; opened with a page's width fitted to the screen. A grip
 * (`data-grip`: a note's, the loop's) drags itself, not the canvas.
 */
export function PageCanvas({ column, children }: { column: number; children: ReactNode }) {
  const { t } = useTranslation('music')
  const viewport = useRef<HTMLDivElement>(null)
  const content = useRef<HTMLDivElement>(null)
  const screen = useElementSize(viewport)
  const sheet = useElementSize(content)
  const view = useRef<CanvasView>({ x: 0, y: 0, zoom: 1 })
  const [zoom, setZoom] = useState(1)
  // Fitted until the learner moves or zooms it; fitted again when the screen or the pages change.
  const moved = useRef(false)

  const show = useCallback((next: CanvasView) => {
    view.current = next
    const element = content.current
    if (element) element.style.transform = `translate(${next.x}px, ${next.y}px) scale(${next.zoom})`
    setZoom(next.zoom)
  }, [])

  const fit = useCallback(() => {
    if (screen.width <= 0 || sheet.width <= 0) return
    show(fitWidth(sheet, column, screen))
  }, [show, sheet, column, screen])

  useLayoutEffect(() => {
    if (!moved.current) fit()
  }, [fit])

  const zoomBy = (factor: number) => {
    moved.current = true
    show(
      zoomAt(view.current, view.current.zoom * factor, {
        x: screen.width / 2,
        y: screen.height / 2,
      }),
    )
  }

  // The wheel moves the canvas, and with Ctrl or ⌘ (a trackpad's pinch says Ctrl) zooms it at the
  // pointer: a listener of its own, so it can keep the page from scrolling.
  useEffect(() => {
    const element = viewport.current
    if (!element) return
    const onWheel = (event: WheelEvent) => {
      event.preventDefault()
      moved.current = true
      const box = element.getBoundingClientRect()
      const size = { width: box.width, height: box.height }
      const pages = content.current
      const drawn = { width: pages?.offsetWidth ?? 0, height: pages?.offsetHeight ?? 0 }
      show(
        event.ctrlKey || event.metaKey
          ? zoomAt(view.current, view.current.zoom * Math.exp(-event.deltaY * WHEEL_ZOOM), {
              x: event.clientX - box.left,
              y: event.clientY - box.top,
            })
          : panBy(view.current, -event.deltaX, -event.deltaY, drawn, size),
      )
    }
    element.addEventListener('wheel', onWheel, { passive: false })
    return () => element.removeEventListener('wheel', onWheel)
  }, [show])

  // The pointers down on the canvas, where each was last; a drag once one has moved far enough.
  const pointers = useRef(new Map<number, { x: number; y: number }>())
  const dragging = useRef(false)
  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    // A grip (a note's, the loop's) drags itself. Not its pointer capture: a touch is captured by
    // whatever it lands on, so every touch would be a grip's.
    const target = event.target as Element
    if (event.button !== 0 || target.closest('[data-grip]')) return
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY })
  }
  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const last = pointers.current.get(event.pointerId)
    if (!last) return
    const now = { x: event.clientX, y: event.clientY }
    const all = [...pointers.current.entries()]
    if (all.length >= 2) {
      // Two fingers: the canvas zoomed by how far apart they go, about the point between them.
      const [[a, at], [, bt]] = all as [[number, typeof now], [number, typeof now]]
      const other = event.pointerId === a ? bt : at
      const before = Math.hypot(last.x - other.x, last.y - other.y)
      const after = Math.hypot(now.x - other.x, now.y - other.y)
      const box = event.currentTarget.getBoundingClientRect()
      const middle = { x: (now.x + other.x) / 2 - box.left, y: (now.y + other.y) / 2 - box.top }
      const zoomed = zoomAt(view.current, view.current.zoom * (after / Math.max(before, 1)), middle)
      show(panBy(zoomed, (now.x - last.x) / 2, (now.y - last.y) / 2, sheet, screen))
      dragging.current = true
      moved.current = true
    } else {
      if (!dragging.current && Math.hypot(now.x - last.x, now.y - last.y) < DRAG_START) return
      if (!dragging.current) event.currentTarget.setPointerCapture(event.pointerId)
      dragging.current = true
      moved.current = true
      show(panBy(view.current, now.x - last.x, now.y - last.y, sheet, screen))
    }
    pointers.current.set(event.pointerId, now)
  }
  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    pointers.current.delete(event.pointerId)
    if (pointers.current.size > 0 || !dragging.current) return
    // The click a drag ends with is the drag's, not a click on what it was over.
    const swallow = (click: MouseEvent) => {
      click.stopPropagation()
      click.preventDefault()
    }
    window.addEventListener('click', swallow, { capture: true, once: true })
    setTimeout(() => window.removeEventListener('click', swallow, { capture: true }), 0)
    dragging.current = false
  }

  const revealElement = useCallback(
    (element: Element) => {
      const pages = content.current
      if (!pages) return
      const box = element.getBoundingClientRect()
      const origin = pages.getBoundingClientRect()
      const { zoom: at } = view.current
      show(
        reveal(
          view.current,
          {
            top: (box.top - origin.top) / at,
            bottom: (box.bottom - origin.top) / at,
            left: (box.left - origin.left) / at,
            right: (box.right - origin.left) / at,
          },
          screen,
        ),
      )
    },
    [show, screen],
  )

  return (
    <div
      ref={viewport}
      role="region"
      aria-label={t('sheet.canvas.label')}
      data-slot="page-canvas"
      className="relative h-full min-h-0 cursor-grab touch-none overflow-clip bg-muted/50 select-none active:cursor-grabbing"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <div
        ref={content}
        className="absolute top-0 left-0 w-max origin-top-left will-change-transform"
      >
        <RevealContext value={revealElement}>{children}</RevealContext>
      </div>
      <div className="absolute top-2 right-2 flex items-center rounded-full bg-card/95 text-card-foreground shadow-md ring-1 ring-hairline">
        <Button
          variant="ghost"
          size="icon"
          className="size-11 rounded-full"
          aria-label={t('sheet.canvas.zoomOut')}
          title={t('sheet.canvas.zoomOut')}
          onClick={() => zoomBy(1 / ZOOM_STEP)}
        >
          <ZoomOut aria-hidden />
        </Button>
        <span className="min-w-12 text-center text-sm tabular-nums" aria-live="polite">
          {t('sheet.canvas.zoom', { percent: Math.round(zoom * 100) })}
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="size-11 rounded-full"
          aria-label={t('sheet.canvas.zoomIn')}
          title={t('sheet.canvas.zoomIn')}
          onClick={() => zoomBy(ZOOM_STEP)}
        >
          <ZoomIn aria-hidden />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="size-11 rounded-full"
          aria-label={t('sheet.canvas.fit')}
          title={t('sheet.canvas.fit')}
          onClick={() => {
            moved.current = false
            fit()
          }}
        >
          <Maximize2 aria-hidden />
        </Button>
      </div>
    </div>
  )
}
