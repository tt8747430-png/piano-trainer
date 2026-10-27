import { use, type ReactNode } from 'react'
import { cn } from '@/shared/lib'
import { ChromeShownContext } from '../model/chrome-shown'

type PlayerAreaName = 'keys' | 'sheet' | 'status' | 'dock'

/** How the transport steps aside: down towards the foot. */
const ASIDE =
  'transition-[opacity,translate] duration-200 ease-out data-hidden:translate-y-2 data-hidden:opacity-0 motion-reduce:transition-none'

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
  return (
    <div
      data-area={area}
      data-hidden={hidden || undefined}
      inert={hidden}
      className={cn('min-w-0', area === 'dock' && ASIDE, className)}
    >
      {children}
    </div>
  )
}
