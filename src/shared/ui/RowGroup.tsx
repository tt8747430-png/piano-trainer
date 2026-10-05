import { useId, type ReactNode } from 'react'

/**
 * A titled group of rows, each its own card, in as many columns as the width holds: one on a phone,
 * more beside a sidebar. Its children are `li`s.
 */
export function RowGroup({ title, children }: { title: string; children: ReactNode }) {
  const id = useId()
  return (
    <section aria-labelledby={id} className="flex flex-col gap-3">
      <h2 id={id} className="text-2xl">
        {title}
      </h2>
      <ul className="grid-cards gap-2 *:card *:px-2">{children}</ul>
    </section>
  )
}
