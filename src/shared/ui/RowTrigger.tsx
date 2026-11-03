import type { ComponentProps } from 'react'
import { cn } from '@/shared/lib'
import { OpensMark } from './NavMarks'
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
      <RowFace {...face} end={<OpensMark />} />
    </button>
  )
}
