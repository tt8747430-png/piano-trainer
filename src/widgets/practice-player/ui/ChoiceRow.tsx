import { Check } from 'lucide-react'
import type { ReactNode } from 'react'

/** A choice in a popover's list: its label, pressed and checked in umber when chosen. */
export function ChoiceRow({
  chosen,
  onChoose,
  children,
}: {
  chosen: boolean
  onChoose: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      aria-pressed={chosen}
      onClick={onChoose}
      className="flex min-h-11 w-full items-center gap-3 rounded-lg px-2 text-left text-base transition-colors duration-200 ease-out outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring"
    >
      <span className="flex min-w-0 flex-1 items-center gap-3">{children}</span>
      {chosen ? <Check aria-hidden className="size-5 text-selected" /> : null}
    </button>
  )
}
