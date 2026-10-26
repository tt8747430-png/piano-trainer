import { Check } from 'lucide-react'
import { cn } from '@/shared/lib'
import { RowFace, type RowFaceProps } from './RowFace'
import { rowClass } from './row-class'

/**
 * A list row that is on or off (a song in a setlist, Chordify's Save to setlists): a `RowLink`'s face,
 * and at its end, in its `trailing` place, a check, umber while on (the neutral chosen), a ring
 * while off; a tap turns it.
 */
export function RowCheck({
  checked,
  onCheckedChange,
  ...face
}: RowFaceProps & {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={() => onCheckedChange(!checked)}
      className={cn(rowClass(face.paint !== undefined), 'w-full text-left')}
    >
      <RowFace
        {...face}
        trailing={
          <span
            data-slot="row-check"
            aria-hidden
            className={cn(
              'grid size-7 shrink-0 place-items-center rounded-full border transition-colors duration-200 ease-out',
              checked ? 'border-transparent bg-selected text-selected-foreground' : 'border-input',
            )}
          >
            {checked ? <Check className="size-4" strokeWidth={3} /> : null}
          </span>
        }
      />
    </button>
  )
}
