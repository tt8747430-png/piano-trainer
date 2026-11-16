import { use, useLayoutEffect, useRef, type ReactNode } from 'react'
import { cn } from '@/shared/lib'
import { ChromeShownContext } from '../model/chrome-shown'

type PlayerAreaName = 'keys' | 'sheet' | 'status' | 'dock' | 'transport'

/** How the transport steps aside: down towards the foot. */
const ASIDE =
  'transition-[opacity,translate] duration-200 ease-out data-hidden:translate-y-2 data-hidden:opacity-0 motion-reduce:transition-none'

/**
 * Wait mode's line under the floating transport lifts it by its height: the room the keys' window
 * stands above (`--status-room`), so the transport never covers the keys. Nothing where the line
 * stands elsewhere (in the bar's row on a phone on its side).
 */
function useStatusRoom(status: boolean) {
  const box = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    const line = box.current
    if (!status || !line) return
    const root = document.documentElement
    const measure = () => {
      const dock = line.parentElement?.querySelector('[data-area=dock]')
      const under = dock
        ? line.getBoundingClientRect().top >= dock.getBoundingClientRect().bottom
        : false
      root.style.setProperty('--status-room', `${under ? line.offsetHeight : 0}px`)
      // The keys' window moved with it: the music's room under its last line follows (`KeysPlace`).
      const keys = document.querySelector('[data-slot=keys-window]')
      if (keys)
        root.style.setProperty(
          '--keys-room',
          `${Math.max(0, window.innerHeight - keys.getBoundingClientRect().top)}px`,
        )
    }
    measure()
    const watch = new ResizeObserver(measure)
    watch.observe(line)
    return () => {
      watch.disconnect()
      root.style.removeProperty('--status-room')
    }
  }, [status])
  return box
}

/**
 * One part of the Player's screen under its bar (`ScoreBar`), and the score editor's (ADR 0115),
 * placed by its name. The transport's (`dock`) fades out of sight and reach while the screen hides
 * it, its room kept so nothing moves.
 */
export function PlayerArea({
  area,
  className,
  children,
}: {
  area: PlayerAreaName
  className?: string
  children?: ReactNode
}) {
  const shown = use(ChromeShownContext)
  const hidden = area === 'dock' && !shown.dock
  const box = useStatusRoom(area === 'status')
  return (
    <div
      ref={box}
      data-area={area}
      data-hidden={hidden || undefined}
      inert={hidden}
      className={cn('min-w-0', area === 'dock' && ASIDE, className)}
    >
      {children}
    </div>
  )
}
