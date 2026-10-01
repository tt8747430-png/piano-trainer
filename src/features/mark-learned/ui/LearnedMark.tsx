import { Check } from 'lucide-react'
import { cn } from '@/shared/lib'

/** The round check: filled in the learned paint once a step is learned, an empty ring before. */
export function LearnedMark({ learned }: { learned: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        'grid size-7 shrink-0 place-items-center rounded-full ring-1 transition-colors duration-200 ease-out ring-inset',
        learned ? 'bg-learned text-learned-foreground ring-learned' : 'ring-input',
      )}
    >
      {learned ? <Check className="size-4" strokeWidth={3} /> : null}
    </span>
  )
}
