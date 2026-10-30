import type { ReactNode } from 'react'
import { FoldSection, type Fold } from './FoldSection'

/**
 * A titled group of rows in one card (a grouped list, as Settings' and Practice's), in as many
 * columns as the width holds: one on a phone, more beside a sidebar. Given a `fold`, its heading folds it away. Its children are `li`s. A group
 * inside a section of its page heads itself at `level` 3, a size down.
 */
export function RowGroup({
  title,
  fold,
  info,
  level = 2,
  children,
  footer,
}: {
  title: string
  fold?: Fold | undefined
  /** What the group is for, opened from the ⓘ beside its name. */
  info?: ReactNode
  level?: 2 | 3
  children: ReactNode
  /** What follows the rows, under the group's name still (Search's Show all). */
  footer?: ReactNode
}) {
  return (
    <FoldSection
      title={title}
      fold={fold}
      info={info}
      level={level}
      headingClassName={level === 2 ? 'text-2xl' : 'text-xl'}
    >
      <ul className="grid-cards gap-x-2 card p-1.5">{children}</ul>
      {footer}
    </FoldSection>
  )
}
