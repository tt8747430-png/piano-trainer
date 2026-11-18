import type { ReactNode } from 'react'

/**
 * A Profile section's box (the boards' BOX): its rows parted by hairlines, the last drawing none, so
 * the card's own edge closes the list; each row leads with its picture, 12 in (BROW, AROW, RUNROW9),
 * and on a laptop carries no chevron, the whole row the link.
 */
export function ProfileList({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col overflow-hidden card [&>*]:rounded-none [&>*+*]:border-t [&>*+*]:border-hairline [&>a]:min-h-15 [&>a]:pl-3 lg:[&_[data-slot=row-chevron]]:hidden">
      {children}
    </div>
  )
}
