import { useId } from 'react'
import { cn } from '@/shared/lib'
import { rowClass } from './row-class'

/**
 * A row that does something (R24), as iOS's "Sign Out" and Settings' "Sync now" read: its label in
 * the link's accent (`danger`: the destructive red), no tile and no chevron, its status at its right
 * edge where it has one ("Synced 2 min ago"). Greyed (`disabled`), it says why (`reason`): the
 * browser's tooltip, and to a screen reader. A destructive one (`DangerRow`) stands last and alone.
 */
export function ActionRow({
  title,
  status,
  onClick,
  disabled = false,
  reason,
  danger = false,
}: {
  title: string
  /** Where the act stands, at the row's end. */
  status?: string | undefined
  onClick: () => void
  disabled?: boolean
  reason?: string | undefined
  danger?: boolean
}) {
  const id = useId()
  const why = disabled ? reason : undefined
  return (
    <button
      type="button"
      data-row="action"
      data-danger={danger ? '' : undefined}
      onClick={onClick}
      disabled={disabled}
      title={why}
      aria-describedby={why ? id : undefined}
      className={cn(
        rowClass(false),
        'w-full text-left disabled:opacity-50 disabled:hover:bg-transparent',
      )}
    >
      <span
        className={cn(
          'min-w-0 flex-1 text-lg leading-snug font-semibold text-pretty',
          danger ? 'text-destructive' : 'text-link',
        )}
      >
        {title}
      </span>
      {status ? (
        <span data-slot="row-value" className="min-w-min text-end text-muted-foreground">
          {status}
        </span>
      ) : null}
      {why ? (
        <span id={id} hidden>
          {why}
        </span>
      ) : null}
    </button>
  )
}
