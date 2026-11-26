import { ChevronRight } from 'lucide-react'

/**
 * A folded list's way to the rest, the boards' quiet link under its card (owner, 2026-11-16: "why the
 * show all is not under the add member"): "Show all n ›" in the link colour, its reach 44 tall, 4 in
 * from the card's edge with 4 of its own room.
 */
export function ShowAll({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="ms-1 -mt-1 flex min-h-11 items-center gap-1 self-start rounded-control px-1 text-subhead font-semibold text-link tabular-nums"
    >
      {label}
      <ChevronRight aria-hidden className="size-4.5" />
    </button>
  )
}
