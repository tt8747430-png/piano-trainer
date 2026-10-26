import { use, type ReactNode } from 'react'
import { cn } from '@/shared/lib'
import { ChromeShownContext } from '../model/chrome-shown'

type PlayerAreaName = 'lead' | 'actions' | 'tools' | 'keys' | 'sheet' | 'status' | 'dock'

/** The areas that step aside with the screen's bar: its two groups and the tools row under it. */
const BAR_AREAS: readonly PlayerAreaName[] = ['lead', 'actions', 'tools']

/** How an area steps aside: the transport down towards the foot, the bar up towards the top. */
const ASIDE = {
  dock: 'transition-[opacity,translate] duration-200 ease-out data-hidden:translate-y-2 data-hidden:opacity-0 motion-reduce:transition-none',
  bar: 'transition-[opacity,translate] duration-200 ease-out data-hidden:-translate-y-2 data-hidden:opacity-0 motion-reduce:transition-none',
} as const

/**
 * One part of the Player's screen, placed by its name. The transport's (`dock`) fades out of sight
 * and reach while the screen hides it, and the bar's and the tools row's while they step aside (ADR
 * 0102), their room kept so nothing moves.
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
  const part = area === 'dock' ? 'dock' : BAR_AREAS.includes(area) ? 'bar' : null
  const hidden = part !== null && !shown[part]
  return (
    <div
      data-area={area}
      data-hidden={hidden || undefined}
      inert={hidden}
      className={cn('min-w-0', part === null ? null : ASIDE[part], className)}
    >
      {children}
    </div>
  )
}
