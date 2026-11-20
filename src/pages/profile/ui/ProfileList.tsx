import type { ReactNode } from 'react'
import { cn } from '@/shared/lib'

/**
 * A Profile list's box (the boards' BOX): each row after the first drawing its hairline inside its top
 * edge, as the boards' rows do, the card's own edge closing the list; each row leads with its picture,
 * 12 in, and pads 8 above and below (BROW, AROW, RUNROW9).
 * On the Profile itself a laptop's rows carry no chevron, the whole row the link; a sub-page's keep it
 * (`page`), as the boards' Badges and Achievements pages draw them.
 */
export function ProfileList({ children, page = false }: { children: ReactNode; page?: boolean }) {
  return (
    <div
      className={cn(
        'flex flex-col overflow-hidden card [&>*]:rounded-none [&>*+*]:shadow-[inset_0_1px_0_var(--color-hairline)] [&>a]:min-h-15 [&>a]:py-2 [&>a]:pl-3',
        !page && 'lg:[&_[data-slot=row-chevron]]:hidden',
      )}
    >
      {children}
    </div>
  )
}
