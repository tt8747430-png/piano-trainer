import type { ReactNode } from 'react'
import { cn } from '@/shared/lib'

/**
 * One card holding the rows, a hairline between them from the title's edge (84: 12, the 56 tile, 16),
 * as an inset grouped list draws it (the boards' SONGLIST, 2026-11-18: "a song list on a phone is one
 * list, not a card per song").
 */
const INSET_LIST =
  "card flex flex-col overflow-hidden [&>li+li]:relative [&>li+li]:before:absolute [&>li+li]:before:top-0 [&>li+li]:before:right-0 [&>li+li]:before:left-21 [&>li+li]:before:h-px [&>li+li]:before:bg-border [&>li+li]:before:content-['']"

/** A place's rows (R72's SONGLIST): one card holding them, a hairline between each. */
export function LibraryRows({ className, children }: { className?: string; children: ReactNode }) {
  return <ul className={cn(INSET_LIST, className)}>{children}</ul>
}
