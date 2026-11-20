import type { LucideIcon } from 'lucide-react'

/**
 * A kind's glyph on the quiet fill, at the head of a row that makes or adds it (the boards' INSROW
 * and New's dial): 36 square, 10 round, its 20 icon in ink. A picture: hidden from a screen reader.
 */
export function KindTile({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <span
      aria-hidden
      data-slot="kind-tile"
      className="grid size-9 shrink-0 place-items-center rounded-menu-item bg-muted text-foreground [&_svg]:size-5"
    >
      <Icon />
    </span>
  )
}
