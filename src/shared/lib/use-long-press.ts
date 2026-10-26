import {
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useRef,
} from 'react'

export interface LongPressOptions {
  delay?: number
  moveTolerance?: number
}

export interface LongPressHandlers {
  onPointerDown: (event: ReactPointerEvent) => void
  onPointerMove: (event: ReactPointerEvent) => void
  onPointerUp: () => void
  onPointerLeave: () => void
  onPointerCancel: () => void
  onContextMenu: (event: ReactMouseEvent) => void
  onClick: (event: ReactMouseEvent) => void
}

export function useLongPress(
  { onLongPress, onTap }: { onLongPress: () => void; onTap?: () => void },
  { delay = 450, moveTolerance = 10 }: LongPressOptions = {},
): LongPressHandlers {
  const timer = useRef<number | undefined>(undefined)
  const fired = useRef(false)
  const origin = useRef<{ x: number; y: number } | null>(null)

  const clear = useCallback(() => {
    if (timer.current !== undefined) {
      window.clearTimeout(timer.current)
      timer.current = undefined
    }
    origin.current = null
  }, [])

  useEffect(() => clear, [clear])

  const onPointerDown = useCallback(
    (event: ReactPointerEvent) => {
      fired.current = false
      origin.current = { x: event.clientX, y: event.clientY }
      timer.current = window.setTimeout(() => {
        fired.current = true
        onLongPress()
      }, delay)
    },
    [onLongPress, delay],
  )

  const onPointerMove = useCallback(
    (event: ReactPointerEvent) => {
      const start = origin.current
      if (!start) return
      if (
        Math.abs(event.clientX - start.x) > moveTolerance ||
        Math.abs(event.clientY - start.y) > moveTolerance
      ) {
        clear()
      }
    },
    [clear, moveTolerance],
  )

  const onContextMenu = useCallback((event: ReactMouseEvent) => {
    if (fired.current) event.preventDefault()
  }, [])

  const onClick = useCallback(
    (event: ReactMouseEvent) => {
      if (fired.current) {
        fired.current = false
        event.preventDefault()
        event.stopPropagation()
        return
      }
      onTap?.()
    },
    [onTap],
  )

  return {
    onPointerDown,
    onPointerMove,
    onPointerUp: clear,
    onPointerLeave: clear,
    onPointerCancel: clear,
    onContextMenu,
    onClick,
  }
}
