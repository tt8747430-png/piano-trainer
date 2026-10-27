import type { ReactNode } from 'react'
import { cn } from '@/shared/lib'
import { InfoTip } from './InfoTip'

/**
 * One group of a menu or sheet under its heading (ADR 0115): the View menu's Layout, Staves and
 * Show, the Setup's How it plays. Every group of the Player's and the editor's menus wears the same
 * heading, so the two screens read alike; what the group is for, where its heading does not say, is
 * an `InfoTip` beside it (ADR 0096).
 */
export function MenuSection({
  title,
  info,
  className,
  children,
}: {
  title: string
  /** What the group is for, opened from the ⓘ beside its heading. */
  info?: ReactNode
  className?: string
  children: ReactNode
}) {
  return (
    <section aria-label={title} className={cn('flex flex-col gap-2', className)}>
      <div className="flex items-center gap-1.5">
        <h2 className="text-sm font-semibold text-muted-foreground">{title}</h2>
        {info ? <InfoTip name={title}>{info}</InfoTip> : null}
      </div>
      {children}
    </section>
  )
}
