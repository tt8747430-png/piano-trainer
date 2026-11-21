import { Folder } from 'lucide-react'

/** A course's picture at its Settings' head (the board's COURSEPIC): a folder on the sage wash, 64. */
export function CourseMark() {
  return (
    <span className="grid size-16 shrink-0 place-items-center rounded-card bg-paint-grass ring-1 ring-foreground/8 ring-inset">
      <Folder aria-hidden className="size-6.5" />
    </span>
  )
}
