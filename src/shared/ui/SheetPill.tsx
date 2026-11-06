import type { ReactNode } from 'react'

/** How far the pill stands from the sheet's edges and what floats over them, in CSS px. */
const GAP = 8

/**
 * The sheet's one small floating control (R34, Songscription's view pill): at the score's foot, at its
 * right, clear of what floats over it (`covered`: the editor's palette, a strip at the foot); always
 * in sight, so it never appears under a finger (ADR 0115). Its parent is the sheet's positioned box.
 */
export function SheetPill({
  covered,
  children,
}: {
  covered?: { readonly right?: number; readonly bottom?: number } | undefined
  children: ReactNode
}) {
  return (
    <div
      data-slot="sheet-pill"
      style={{ right: (covered?.right ?? 0) + GAP, bottom: (covered?.bottom ?? 0) + GAP }}
      className="absolute z-10 flex items-center rounded-pill bg-card/95 text-card-foreground shadow-md ring-1 ring-hairline print:hidden"
    >
      {children}
    </div>
  )
}
