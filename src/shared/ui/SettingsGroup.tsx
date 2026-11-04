import { useId, type ReactNode } from 'react'
import { cn } from '@/shared/lib'
import { InfoTip } from './InfoTip'

/**
 * A group of settings, as an app's settings read (iOS's grouped list, memory-palaces' `SettingsSection`):
 * its name small over one card, what the group is for in the ⓘ beside it where its name does not say
 * (ADR 0096), its rows in the card. `flush` rows (a `RowLink`, a `ChoiceRow`, a `SwitchRow`) run to the
 * card's edges; fields sit inset. Untitled, it is a page's first card (the account). A `footnote` is
 * the one line a group may have under its card (R20), as iOS's.
 */
export function SettingsGroup({
  title,
  info,
  footnote,
  flush = false,
  bare = false,
  children,
  className,
}: {
  title?: string
  info?: ReactNode
  footnote?: ReactNode
  flush?: boolean
  /** Its own cards under its name (a list of instruments' families), no card round them. */
  bare?: boolean
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
      {bare ? (
        <div className="flex flex-col gap-3">{children}</div>
      ) : (
        <div
          className={cn(
            'flex flex-col card',
            // A row's hover fills the card to its edges (R23), square between rows.
            flush
              ? 'overflow-hidden [&>*]:rounded-none [&>*:first-child]:rounded-t-card [&>*:last-child]:rounded-b-card'
              : 'gap-3 px-5 py-4',
          )}
        >
          {children}
        </div>
      )}
      {footnote ? <p className="px-3 text-sm text-muted-foreground">{footnote}</p> : null}
    </section>
  )
}
