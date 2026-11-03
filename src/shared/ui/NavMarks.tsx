import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/shared/lib'

/**
 * The navigation marks (R23), drawn here alone so every one is the same size, stroke and muted ink
 * on the same right edge: › opens a page (a row's end, nudged as the row is hovered), ‹ goes back a
 * page of a sheet. ⌃⌄ (a picker) and ⌄ (a fold) belong to their own controls; arrows are for
 * movement only (transpose, octave, next and previous), never to navigate.
 */
export function OpensMark({ className }: { className?: string }) {
  return (
    <ChevronRight
      data-slot="row-chevron"
      aria-hidden
      className={cn(
        'size-5 shrink-0 text-muted-foreground transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:text-foreground group-hover/row:translate-x-0.5 group-hover/row:text-foreground',
        className,
      )}
    />
  )
}

/** ‹ before a sheet's Back, as a button's leading icon. */
export function BackMark() {
  return <ChevronLeft data-icon="inline-start" aria-hidden />
}
