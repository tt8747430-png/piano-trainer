import type { ReactNode } from 'react'

/** A screen's large title, with an optional way back before it and actions after it. */
export function ScreenHeader({
  title,
  back,
  actions,
}: {
  title: ReactNode
  back?: ReactNode
  actions?: ReactNode
}) {
  return (
    <header className="flex items-center gap-3 pt-2 pb-4">
      {back}
      <h1 className="min-w-0 flex-1 text-4xl font-bold tracking-tight text-balance">{title}</h1>
      {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
    </header>
  )
}
