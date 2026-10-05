import { Check } from 'lucide-react'

/** Learned, on a row: a small disc in the learned paint with a check, named for a screen reader. */
export function LearnedBadge({ label }: { label: string }) {
  return (
    <span
      role="img"
      aria-label={label}
      className="grid size-5 shrink-0 place-items-center rounded-full bg-learned text-learned-foreground"
    >
      <Check aria-hidden className="size-3.5" strokeWidth={3} />
    </span>
  )
}
