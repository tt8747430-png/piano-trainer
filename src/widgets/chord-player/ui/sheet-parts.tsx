import type { ReactNode } from 'react'

/** A pop-up's look in a sheet's rows, Musicca's select: white, ringed, its value and the up-down chevrons. */
export const POP =
  'h-11 rounded-control border-0 bg-card px-3 font-normal shadow-[0_0_0_1px_var(--color-border)] [&_span]:font-normal'

/** A sheet's white card of rows (`GROUP` with `bg=SHEET`): 14 round, the hairline ring, a line between rows. */
export function SheetCard({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col overflow-hidden rounded-card bg-card shadow-[0_0_0_1px_var(--color-border)]">
      {children}
    </div>
  )
}

/** One of a sheet's rows (canvas 173, `ROW59`): 56 high, its name, its controls at its end. */
export function SheetRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex min-h-14 items-center gap-2 py-1.5 pr-3 pl-4 not-last:shadow-[inset_0_-1px_0_var(--color-muted)]">
      <span className="min-w-0 flex-1 text-base">{label}</span>
      {children}
    </div>
  )
}

/** One of a sheet's acts at its foot (canvas 173, `QBTN`): its icon and name on the quiet fill, sharing the row. */
export function SheetAct({
  icon,
  onClick,
  children,
}: {
  icon: ReactNode
  onClick(): void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-11 min-w-0 flex-1 items-center justify-center gap-2 rounded-control bg-muted px-3 text-subhead font-semibold whitespace-nowrap transition-colors duration-150 ease-out hover:brightness-95"
    >
      {icon}
      <span className="truncate">{children}</span>
    </button>
  )
}
