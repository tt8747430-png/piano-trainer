import type { ReactNode } from 'react'
import { cn } from '@/shared/lib'

/**
 * One group of a menu or sheet under its heading (ADR 0085): the View menus' Layout, Staves and
 * Show, the Setup's How it plays, the Song sheet's Parts. Every group of the Player's and the
 * editor's menus wears the same heading, so the two screens read alike.
 */
export function MenuSection({
  title,
  className,
  children,
}: {
  title: string
  className?: string
  children: ReactNode
}) {
  return (
    <section aria-label={title} className={cn('flex flex-col gap-2', className)}>
      <h2 className="text-sm font-semibold text-muted-foreground">{title}</h2>
      {children}
    </section>
  )
}
