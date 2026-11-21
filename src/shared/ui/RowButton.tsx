import type { ComponentProps, Ref } from 'react'
import { cn } from '@/shared/lib'
import { useDisabledReason } from './disabled-reason'
import { OpensMark } from './NavMarks'
import { RowFace, type RowFaceProps } from './RowFace'
import { ROW_CLASS } from './row-class'

/**
 * A list row that acts in place, over its page (a chord's sheet, a lesson played in the Player):
 * a `RowLink`'s face without its chevron, which says a row leads to a page; a button, not a
 * link. Greyed (`disabled`), it says why (`reason`): the browser's tooltip, and to a screen reader.
 * The one of its list where the screen is now (`current`: the Player's section) wears the muted fill.
 * One that destroys (`destructive`: Delete account…) is set in the destructive ink, its tile too.
 */
export function RowButton({
  onClick,
  disabled = false,
  reason,
  current = false,
  destructive = false,
  opens = false,
  trigger,
  ref,
  ...face
}: RowFaceProps & {
  onClick?: () => void
  disabled?: boolean
  reason?: string | undefined
  current?: boolean
  destructive?: boolean
  /** It opens a sheet or popover of its own choices (Count-in › 1 bar): a chevron at its end, as a link row's. */
  opens?: boolean
  /** The props a picker gives its trigger (a popover on a laptop, a sheet on a phone), so it opens by the row. */
  trigger?: ComponentProps<'button'>
  ref?: Ref<HTMLButtonElement>
}) {
  const greyed = useDisabledReason(disabled, reason)
  return (
    <button
      ref={ref}
      type="button"
      {...trigger}
      {...(onClick ? { onClick } : {})}
      disabled={disabled}
      {...greyed.props}
      aria-current={current ? 'true' : undefined}
      className={cn(
        ROW_CLASS,
        'w-full text-left disabled:opacity-50 disabled:hover:bg-transparent aria-[current=true]:bg-muted',
        destructive &&
          'text-destructive [&_[data-slot=row-tile]]:bg-destructive/10 [&_[data-slot=row-tile]]:text-destructive',
        trigger?.className,
      )}
    >
      <RowFace {...face} end={opens ? <OpensMark /> : undefined} />
      {greyed.note}
    </button>
  )
}
