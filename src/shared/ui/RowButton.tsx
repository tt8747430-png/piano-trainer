import { useId, type Ref } from 'react'
import { cn } from '@/shared/lib'
import { RowFace, type RowFaceProps } from './RowFace'
import { rowClass } from './row-class'

/**
 * A list row that acts in place, over its page (a chord's sheet, a lesson played in the Player):
 * a `RowLink`'s face without its chevron, which says a row leads to a page; a button, not a
 * link. Greyed (`disabled`), it says why (`reason`): the browser's tooltip, and to a screen reader.
 * The one of its list where the screen is now (`current`: the Player's section) wears the muted fill.
 */
export function RowButton({
  onClick,
  disabled = false,
  reason,
  current = false,
  ref,
  ...face
}: RowFaceProps & {
  onClick: () => void
  disabled?: boolean
  reason?: string | undefined
  current?: boolean
  ref?: Ref<HTMLButtonElement>
}) {
  const id = useId()
  const why = disabled ? reason : undefined
  return (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={why}
      aria-describedby={why ? id : undefined}
      aria-current={current ? 'true' : undefined}
      className={cn(
        rowClass(face.paint !== undefined),
        'w-full text-left disabled:opacity-50 disabled:hover:bg-transparent aria-[current=true]:bg-muted',
      )}
    >
      <RowFace {...face} />
      {why ? (
        <span id={id} hidden>
          {why}
        </span>
      ) : null}
    </button>
  )
}
