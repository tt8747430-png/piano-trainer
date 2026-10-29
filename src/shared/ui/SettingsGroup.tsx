import { useId, type ReactNode } from 'react'
import { cn } from '@/shared/lib'
import { InfoTip } from './InfoTip'

/**
 * A group of settings, as an app's settings read (iOS's grouped list, memory-palaces' `SettingsSection`):
 * its name small over one card, what the group is for in the ⓘ beside it where its name does not say
 * (ADR 0096), its rows in the card. `flush` rows (a `RowLink`, a `ChoiceRow`, a `SwitchRow`) run to the
 * card's edges; fields sit inset. Untitled, it is a page's first card (the account).
 */
export function SettingsGroup({
  title,
  info,
  flush = false,
  children,
  className,
}: {
  title?: string
  info?: ReactNode
  flush?: boolean
  children: ReactNode
  className?: string
}) {
  const id = useId()
  return (
    <section
      aria-labelledby={title ? id : undefined}
      className={cn('flex flex-col gap-2', className)}
    >
      {title ? (
        <div className="flex items-center gap-1 px-3">
          <h2 id={id} className="font-sans text-sm font-semibold text-muted-foreground">
            {title}
          </h2>
          {info ? <InfoTip name={title}>{info}</InfoTip> : null}
        </div>
      ) : null}
      <div className={cn('flex flex-col card', flush ? 'p-1.5' : 'gap-3 px-5 py-4')}>
        {children}
      </div>
    </section>
  )
}
