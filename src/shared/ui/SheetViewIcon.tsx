import { FileText, MoveHorizontal, Rows3 } from 'lucide-react'
import type { SheetView } from '@/shared/lib'

const ICONS = { scroll: Rows3, pages: FileText, horizontal: MoveHorizontal } as const

/** A score's layout drawn (ADR 0064): lines down the screen, A4 pages, or one line across. */
export function SheetViewIcon({ view }: { view: SheetView }) {
  const Icon = ICONS[view]
  return <Icon aria-hidden className="size-5" />
}
