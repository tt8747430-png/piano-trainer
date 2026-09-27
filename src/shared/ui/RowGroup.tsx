import { useId, type ReactNode } from 'react'

/** A titled card of rows, parted by hairlines: Learn's and Practice's lists. */
export function RowGroup({ title, children }: { title: string; children: ReactNode }) {
  const id = useId()
  return (
    <section aria-labelledby={id} className="flex flex-col gap-2">
      <h2 id={id} className="text-2xl">
        {title}
      </h2>
      <ul className="flex flex-col divide-y divide-hairline rounded-3xl border border-border bg-card px-2">
        {children}
      </ul>
    </section>
  )
}
