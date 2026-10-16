import type { ReactNode } from 'react'
import { FoldSection, type Fold } from './FoldSection'

/**
 * A titled group of rows, each its own card, in as many columns as the width holds: one on a phone,
 * more beside a sidebar. Given a `fold`, its heading folds it away. Its children are `li`s.
 */
export function RowGroup({
  title,
  fold,
  children,
  footer,
}: {
  title: string
  fold?: Fold | undefined
  children: ReactNode
  /** What follows the rows, under the group's name still (Search's Show all). */
  footer?: ReactNode
}) {
  return (
    <FoldSection title={title} fold={fold}>
      <ul className="grid-cards gap-2 *:card">{children}</ul>
      {footer}
    </FoldSection>
  )
}
