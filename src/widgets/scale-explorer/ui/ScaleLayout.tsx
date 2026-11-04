import type { ReactNode } from 'react'

/**
 * A view of a scale, read top to bottom: the keys pinned; what it is (its name, the Tonic and Scale
 * menus, over its facts) with the view's one Play; its choices as labelled fields, as many columns as
 * fit; then its sections.
 */
export function ScaleLayout({
  keyboard,
  heading,
  facts,
  action,
  fields,
  children,
}: {
  keyboard: ReactNode
  heading: ReactNode
  facts?: ReactNode
  action?: ReactNode
  fields?: ReactNode
  children: ReactNode
}) {
  return (
    <div className="flex flex-col gap-6">
      {keyboard}
      <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
        <div className="flex min-w-0 flex-col gap-3">
          {heading}
          {facts}
        </div>
        {action}
      </div>
      {fields ? <div className="grid-fields gap-x-10 gap-y-5">{fields}</div> : null}
      {children}
    </div>
  )
}
