import { useId, type ReactNode } from 'react'

/**
 * A titled group of rows, each its own card, in as many columns as the width holds: one on a phone,
 * more beside a sidebar. Its children are `li`s.
 */
export function RowGroup({
  title,
  children,
  footer,
}: {
  title: string
  children: ReactNode
  /** What follows the rows, under the group's name still (Search's Show all). */
  footer?: ReactNode
}) {
  const id = useId()
  return (
    <section aria-labelledby={id} className="flex flex-col gap-3">
      <h2 id={id} className="text-2xl">
        {title}
      </h2>
      <ul className="grid-cards gap-2 *:card">{children}</ul>
      {footer}
    </section>
  )
}
