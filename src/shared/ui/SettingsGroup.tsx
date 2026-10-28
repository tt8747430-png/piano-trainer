import { useId, type ReactNode } from 'react'
import { cn } from '@/shared/lib'
import { InfoTip } from './InfoTip'

/**
 * A group of settings, boxed as the book boxes a thing (Settings, the MIDI keyboard's screen): its
 * title in a band across the top, what the group is for in the ⓘ beside it where its title does
 * not say (ADR 0096), its rows under it. `flush` rows (a list of choices, a row that leads on) run
 * to the card's edges.
 */
export function SettingsGroup({
  title,
  info,
  flush = false,
  children,
  className,
}: {
  title: string
  info?: ReactNode
  flush?: boolean
  children: ReactNode
  className?: string
}) {
  const id = useId()
  return (
    <section aria-labelledby={id} className={cn('overflow-hidden card', className)}>
      <div className="flex items-center gap-1.5 border-b border-border bg-muted px-5 py-2">
        <h2 id={id} className="text-xl">
          {title}
        </h2>
        {info ? <InfoTip name={title}>{info}</InfoTip> : null}
      </div>
      <div className={cn('flex flex-col', flush ? 'p-1.5' : 'gap-3 px-5 py-4')}>{children}</div>
    </section>
  )
}
