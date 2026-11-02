import { ChevronRight } from 'lucide-react'
import type { ComponentProps } from 'react'
import { cn } from '@/shared/lib'
import { RowFace, type RowFaceProps } from './RowFace'
import { rowClass } from './row-class'

type FaceProps = Omit<RowFaceProps, 'children' | 'mark'>

/**
 * A list row that opens a picker over its page (a popover on a laptop, a sheet on a phone): a
 * `RowButton`'s face with its value and a chevron, taking the props a trigger is given (`render`),
 * so the picker it opens stands by it.
 */
export function RowTrigger({
  title,
  detail,
  count,
  icon,
  numeral,
  paint,
  trailing,
  value,
  className,
  ...button
}: FaceProps & Omit<ComponentProps<'button'>, 'title' | 'children'>) {
  const face = {
    title,
    detail,
    count,
    trailing,
    value,
    ...{ icon, numeral, paint },
  } as RowFaceProps
  return (
    <button
      type="button"
      {...button}
      className={cn(
        rowClass(paint !== undefined),
        'w-full text-left disabled:opacity-50 disabled:hover:bg-transparent',
        className,
      )}
    >
      <RowFace
        {...face}
        end={
          <ChevronRight
            data-slot="row-chevron"
            aria-hidden
            className="size-5 shrink-0 text-muted-foreground transition-transform duration-200 ease-out group-hover/row:translate-x-0.5 group-hover/row:text-foreground"
          />
        }
      />
    </button>
  )
}
