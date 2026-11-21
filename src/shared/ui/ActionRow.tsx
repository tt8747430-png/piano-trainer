import { cn } from '@/shared/lib'
import { useDisabledReason } from './disabled-reason'
import { ROW_CLASS } from './row-class'

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
  const greyed = useDisabledReason(disabled, reason)
  return (
    <button
      type="button"
      data-row="action"
      data-danger={danger ? '' : undefined}
      onClick={onClick}
      disabled={disabled}
      {...greyed.props}
      className={cn(
        ROW_CLASS,
        'w-full text-left disabled:opacity-50 disabled:hover:bg-transparent',
      )}
    >
      <span
        className={cn(
          'min-w-0 flex-1 text-base leading-snug text-pretty',
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
      {greyed.note}
    </button>
  )
}
