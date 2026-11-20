import type { ComponentProps } from 'react'
import { cn } from '@/shared/lib'
import { OpensMark } from './NavMarks'
import { RowFace, type RowFaceProps } from './RowFace'
import { ROW_CLASS } from './row-class'

type FaceProps = Pick<RowFaceProps, 'title' | 'detail' | 'count' | 'trailing' | 'value'>

/**
 * A list row that opens a picker over its page (a popover on a laptop, a sheet on a phone): a
 * `RowButton`'s face with its value and a chevron, taking the props a trigger is given (`render`),
 * so the picker it opens stands by it.
 */
export function RowTrigger({
  title,
  detail,
  count,
  trailing,
  value,
  className,
  ...button
}: FaceProps & Omit<ComponentProps<'button'>, 'title' | 'children'>) {
  return (
    <button
      type="button"
      {...button}
      className={cn(
        ROW_CLASS,
        'w-full text-left disabled:opacity-50 disabled:hover:bg-transparent',
        className,
      )}
    >
      <RowFace
        title={title}
        detail={detail}
        count={count}
        trailing={trailing}
        value={value}
        end={<OpensMark />}
      />
    </button>
  )
}
