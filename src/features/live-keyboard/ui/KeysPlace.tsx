import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import type { KeysWindow } from '@/entities/settings'
import { cn } from '@/shared/lib'
import { MIN_KEYS_PX } from '@/shared/ui'
import { useKeysWindow } from '../model/use-keys-window'

/** Which sides a hold moves: the grip all four, a handle its own. */
type Sides = { readonly n?: true; readonly s?: true; readonly e?: true; readonly w?: true }
const MOVE: Sides = { n: true, s: true, e: true, w: true }
const HANDLES: readonly { sides: Sides; place: string; cursor: string; mark: string }[] = [
  {
    sides: { n: true, w: true },
    place: 'left-0 top-0 size-7',
    cursor: 'cursor-nwse-resize',
    mark: 'left-1.5 top-1.5 border-t-4 border-l-4 rounded-tl-md',
  },
  {
    sides: { n: true, e: true },
    place: 'right-0 top-0 size-7',
    cursor: 'cursor-nesw-resize',
    mark: 'right-1.5 top-1.5 border-t-4 border-r-4 rounded-tr-md',
  },
  {
    sides: { s: true, w: true },
    place: 'bottom-0 left-0 size-7',
    cursor: 'cursor-nesw-resize',
    mark: 'bottom-1.5 left-1.5 border-b-4 border-l-4 rounded-bl-md',
  },
  {
    sides: { s: true, e: true },
    place: 'right-0 bottom-0 size-7',
    cursor: 'cursor-nwse-resize',
    mark: 'right-1.5 bottom-1.5 border-r-4 border-b-4 rounded-br-md',
  },
  {
    sides: { w: true },
    place: 'inset-y-7 left-0 w-3',
    cursor: 'cursor-ew-resize',
    mark: 'top-1/2 left-0.5 h-7 -translate-y-1/2 border-l-4 rounded-full',
  },
  {
    sides: { e: true },
    place: 'inset-y-7 right-0 w-3',
    cursor: 'cursor-ew-resize',
    mark: 'top-1/2 right-0.5 h-7 -translate-y-1/2 border-r-4 rounded-full',
  },
  {
    sides: { s: true },
    place: 'inset-x-7 bottom-0 h-3',
    cursor: 'cursor-ns-resize',
    mark: 'bottom-0.5 left-1/2 w-7 -translate-x-1/2 border-b-4 rounded-full',
  },
]
/** The narrowest a window is sized: two octaves' keys still pressable. */
const LEAST_WIDTH = 220
/** A step of the arrow keys on the grip, in px. */
const STEP = 16

/** The screen's size, followed as it turns or the window is resized. */
function useScreen(): { width: number; height: number } {
  const read = () => ({ width: window.innerWidth, height: window.innerHeight })
  const [screen, setScreen] = useState(read)
  useEffect(() => {
    const follow = () => setScreen(read())
    window.addEventListener('resize', follow)
    return () => window.removeEventListener('resize', follow)
  }, [])
  return screen
}

/** A window held inside the screen, no smaller than its least and never taller than most of it. */
function inside(at: KeysWindow, screen: { width: number; height: number }): KeysWindow {
  const width = Math.round(Math.min(screen.width, Math.max(LEAST_WIDTH, at.width)))
  const height = Math.round(Math.min(screen.height * 0.7, Math.max(MIN_KEYS_PX, at.height)))
  return {
    width,
    height,
    left: Math.round(Math.min(screen.width - width, Math.max(0, at.left))),
    bottom: Math.round(Math.min(screen.height - height, Math.max(0, at.bottom))),
  }
}

/** `at` moved by a hold dragged `dx`, `dy` on `sides`: the grip moves it, a handle sizes it from its side. */
function dragged(at: KeysWindow, sides: Sides, dx: number, dy: number): KeysWindow {
  if (sides === MOVE) return { ...at, left: at.left + dx, bottom: at.bottom - dy }
  const next = { ...at }
  if (sides.e) next.width = at.width + dx
  if (sides.w) {
    const width = Math.max(LEAST_WIDTH, at.width - dx)
    next.left = at.left + at.width - width
    next.width = width
  }
  if (sides.n) next.height = at.height - dy
  if (sides.s) {
    const height = Math.max(MIN_KEYS_PX, at.height + dy)
    next.bottom = at.bottom + at.height - height
    next.height = height
  }
  return next
}

/**
 * The keys' window (loop round 24, owner: "piano should also be floating and draggabble and
 * resizeble from all the angles"): the keys, or the hands at the keys, float over the music in a
 * lifted window, at the foot over the transport (`foot`) until moved. Its grip along the top moves
 * it (the arrow keys too; a double tap puts it back); a handle at each corner and on each side but
 * the top sizes it from there. Where it stands is kept per size of screen. The music keeps room to
 * scroll clear of it (`--keys-room`). `children` draws what stands in it at its height, or at its
 * own where the learner sized none.
 */
export function KeysPlace({
  foot,
  children,
}: {
  /** Where it stands until moved: the room under it, a CSS length (over the transport, or the screen's foot). */
  readonly foot: string
  readonly children: (height: number | undefined) => ReactNode
}) {
  const { t } = useTranslation('common')
  const kept = useKeysWindow()
  const screen = useScreen()
  const box = useRef<HTMLDivElement>(null)
  const [moving, setMoving] = useState<KeysWindow | null>(null)
  const at = moving ?? kept.window
  const shown = at === null ? null : inside(at, screen)
  // The music's room under its last line: from the window's top to the screen's foot.
  useLayoutEffect(() => {
    const root = document.documentElement
    const measure = () => {
      const top = box.current?.getBoundingClientRect().top
      if (top !== undefined)
        root.style.setProperty('--keys-room', `${Math.max(0, window.innerHeight - top)}px`)
    }
    measure()
    const watch = new ResizeObserver(measure)
    if (box.current) watch.observe(box.current)
    return () => {
      watch.disconnect()
      root.style.removeProperty('--keys-room')
    }
  }, [shown?.left, shown?.bottom, shown?.width, shown?.height])
  const now = (): KeysWindow | null => {
    const rect = box.current?.getBoundingClientRect()
    if (!rect) return null
    return {
      left: rect.left,
      bottom: window.innerHeight - rect.bottom,
      width: rect.width,
      height: rect.height,
    }
  }
  const hold = (sides: Sides, event: React.PointerEvent) => {
    const from = now()
    if (from === null) return
    event.preventDefault()
    event.stopPropagation()
    const id = event.pointerId
    const x = event.clientX
    const y = event.clientY
    let last = from
    const follow = (moved: PointerEvent) => {
      if (moved.pointerId !== id) return
      last = inside(dragged(from, sides, moved.clientX - x, moved.clientY - y), screen)
      setMoving(last)
    }
    const stop = (ended: PointerEvent) => {
      if (ended.pointerId !== id) return
      window.removeEventListener('pointermove', follow)
      window.removeEventListener('pointerup', stop)
      window.removeEventListener('pointercancel', stop)
      if (last !== from) kept.set(last)
      setMoving(null)
    }
    window.addEventListener('pointermove', follow)
    window.addEventListener('pointerup', stop)
    window.addEventListener('pointercancel', stop)
  }
  const nudge = (event: React.KeyboardEvent) => {
    const dx = event.key === 'ArrowLeft' ? -STEP : event.key === 'ArrowRight' ? STEP : 0
    const dy = event.key === 'ArrowUp' ? -STEP : event.key === 'ArrowDown' ? STEP : 0
    const from = now()
    if ((dx === 0 && dy === 0) || from === null) return
    event.preventDefault()
    kept.set(inside(dragged(from, MOVE, dx, dy), screen))
  }
  return (
    <div
      ref={box}
      data-slot="keys-window"
      className="fixed z-30 rounded-[20px] bg-card shadow-(--elevation-3) ring-1 ring-foreground/10"
      style={
        shown === null
          ? // Until moved, centred over the transport, 1100 wide at most (the laptop board's).
            {
              left: 0,
              right: 0,
              marginInline: 'auto',
              width: 'min(1100px, calc(100% - 16px))',
              bottom: foot,
            }
          : { left: shown.left, bottom: shown.bottom, width: shown.width, height: shown.height }
      }
    >
      <div className="size-full overflow-hidden rounded-[20px]">{children(shown?.height)}</div>
      <button
        type="button"
        aria-label={t('keysWindow.move')}
        title={t('keysWindow.hint')}
        onPointerDown={(event) => hold(MOVE, event)}
        onDoubleClick={() => kept.set(null)}
        onKeyDown={nudge}
        className="absolute top-0 left-1/2 z-10 flex h-6 w-24 -translate-x-1/2 cursor-grab touch-none items-center justify-center outline-none before:absolute before:inset-x-0 before:-inset-y-2.5 before:content-[''] focus-visible:ring-2 focus-visible:ring-ring active:cursor-grabbing"
      >
        <span
          aria-hidden
          className="h-1.5 w-11 rounded-full bg-card/90 ring-1 ring-foreground/25"
        />
      </button>
      {HANDLES.map(({ sides, place, cursor, mark }) => (
        <span
          key={place}
          aria-hidden
          onPointerDown={(event) => hold(sides, event)}
          className={cn('absolute z-10 touch-none', place, cursor)}
        >
          <span
            className={cn(
              'absolute size-3.5 border-card drop-shadow-[0_0_1px_rgb(0_0_0/0.6)]',
              mark,
            )}
          />
        </span>
      ))}
    </div>
  )
}
