import { Check } from 'lucide-react'
import { cn } from '@/shared/lib'

/**
 * The one check a chosen thing wears (the boards' CHECKBOX, 24 round, a 2 ring): filled in ink while
 * chosen, a ring while not, fading in as Select starts. Drawn only; the row around it is the
 * checkbox, so it is hidden from a screen reader.
 */
export function CheckMark({ checked, className }: { checked: boolean; className?: string }) {
  return (
    <span
      aria-hidden
      data-slot="check-mark"
      className={cn(
        'grid size-6 shrink-0 place-items-center rounded-pill border-2 transition-colors duration-200 ease-out motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-90 motion-safe:duration-200',
        checked ? 'border-transparent bg-selected text-selected-foreground' : 'border-input',
        className,
      )}
    >
      {checked ? <Check className="size-3.5" strokeWidth={3} /> : null}
    </span>
  )
}
