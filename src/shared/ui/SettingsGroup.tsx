import { useId, type ReactNode } from 'react'
import { cn } from '@/shared/lib'
import { InfoTip } from './InfoTip'
import { HEADED_SECTION } from './SectionHead'

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
  danger = false,
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
  /** What ends or destroys: the page's last group, set apart (`DangerGroup`). */
  danger?: boolean
  children: ReactNode
  className?: string
}) {
  const id = useId()
  return (
    <section
      aria-labelledby={title ? id : undefined}
      data-slot="settings-group"
      data-group={danger ? 'danger' : undefined}
      className={cn(heading ? HEADED_SECTION : 'flex flex-col gap-2', className)}
    >
      {title ? (
        <div
          data-slot="settings-head"
          // With an ⓘ the head is the boards' S9CAPS row, 28 tall, the words centred on it.
          className={cn('flex items-center gap-1', !heading && 'px-4', info && 'min-h-7')}
        >
          <h2
            id={id}
            data-slot="settings-heading"
            className={heading ? 'font-sans text-xl leading-6 font-bold' : 'caps'}
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
          data-slot="settings-card"
          className={cn(
            'flex flex-col card',
            // A row's hover fills the card to its edges (R23), square between rows; a switch row, which
            // has no inset of its own, sits 16 in, as the canvas's GROUP rows; every row is parted from
            // the next by a hairline that takes no room, as GROUP draws them.
            flush
              ? 'overflow-hidden rows-hairline [&>[data-slot=switch-row]]:px-4 [&>*]:rounded-none [&>*:first-child]:rounded-t-card [&>*:last-child]:rounded-b-card'
              : 'gap-3 px-5 py-4',
          )}
        >
          {children}
        </div>
      )}
      {/* On the rows' inset, as iOS sets a group's footer under its cells' text. */}
      {footnote ? (
        <p data-slot="settings-foot" className="px-4 text-sm text-muted-foreground">
          {footnote}
        </p>
      ) : null}
    </section>
  )
}
