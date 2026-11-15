import { useId, type ReactNode } from 'react'
import { cn } from '@/shared/lib'
import { InfoTip } from './InfoTip'

/**
 * A group of settings, as an app's settings read (iOS's grouped list, memory-palaces' `SettingsSection`):
 * its name small over one card, what the group is for in the ⓘ at its heading's end where its name does not say
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
  heading = false,
  children,
  className,
}: {
  title?: string
  info?: ReactNode
  footnote?: ReactNode
  flush?: boolean
  /** Its own cards under its name (a list of instruments' families), no card round them. */
  bare?: boolean
  /** Its name as a page's section title (a song's Details, beside its Chords and Sections). */
  heading?: boolean
  children: ReactNode
  className?: string
}) {
  const id = useId()
  return (
    <section
      aria-labelledby={title ? id : undefined}
      className={cn('flex flex-col', heading ? 'gap-3' : 'gap-1.5', className)}
    >
      {title ? (
        <div className={cn('flex items-center gap-1', !heading && 'px-1')}>
          <h2
            id={id}
            className={
              heading
                ? 'font-sans text-xl font-bold'
                : 'font-sans text-[0.8125rem]/4 font-semibold tracking-[0.04em] text-muted-foreground uppercase'
            }
          >
            {title}
          </h2>
          {/* At the heading's far edge, as the boards' group heads (S9CAPS). */}
          {info ? (
            <InfoTip name={title} className="ms-auto">
              {info}
            </InfoTip>
          ) : null}
        </div>
      ) : null}
      {bare ? (
        <div className="flex flex-col gap-3">{children}</div>
      ) : (
        <div
          className={cn(
            // A switch row draws its line beneath it; the card's edge stands for the last one's.
            'flex flex-col card [&>[data-slot=switch-row]:last-child]:border-b-0',
            // A row's hover fills the card to its edges (R23), square between rows; a switch row, which
            // has no inset of its own, sits 16 in, as the canvas's GROUP rows.
            flush
              ? 'overflow-hidden [&>[data-slot=switch-row]]:px-4 [&>:is(a,button)+:is(a,button)]:border-t [&>:is(a,button)+:is(a,button)]:border-hairline [&>*]:rounded-none [&>*:first-child]:rounded-t-card [&>*:last-child]:rounded-b-card'
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
