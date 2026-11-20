import { cn } from '@/shared/lib'
import { CheckMark } from './CheckMark'
import { RowFace, type RowFaceProps } from './RowFace'
import { ROW_CLASS } from './row-class'

/**
 * A list row that is on or off (a song ticked to move into a folder, Apple Music's Add Music): a `RowLink`'s face,
 * and at its end, in its `trailing` place, the kit's `CheckMark`; a tap turns it.
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
      className={cn(ROW_CLASS, 'w-full text-left')}
    >
      <RowFace {...face} trailing={<CheckMark checked={checked} />} />
    </button>
  )
}
