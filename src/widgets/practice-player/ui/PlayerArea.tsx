import { use, type ReactNode } from 'react'
import { cn } from '@/shared/lib'
import { DockShownContext } from '../model/dock-shown'

type PlayerAreaName = 'lead' | 'actions' | 'tools' | 'keys' | 'sheet' | 'status' | 'dock'

/**
 * One part of the Player's screen, placed by its name. The transport's (`dock`) fades out of sight
 * and reach while the screen hides it, its room kept so nothing moves.
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
  const hidden = !use(DockShownContext) && area === 'dock'
  return (
    <div
      data-area={area}
      data-hidden={hidden || undefined}
      inert={hidden}
      className={cn(
        'min-w-0',
        area === 'dock' &&
          'transition-[opacity,translate] duration-200 ease-out data-hidden:translate-y-2 data-hidden:opacity-0 motion-reduce:transition-none',
        className,
      )}
    >
      {children}
    </div>
  )
}
