import { cn } from '@/shared/lib'
import { RowFace, type RowFaceProps } from './RowFace'
import { rowClass } from './row-class'

/**
 * A list row that opens something in place, over its page (a chord's sheet): a `RowLink`'s face
 * without its chevron, which says a row leads to a page; a button, not a link.
 */
export function RowButton({ onClick, ...face }: RowFaceProps & { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(rowClass(face.paint !== undefined), 'w-full text-left')}
    >
      <RowFace {...face} />
    </button>
  )
}
