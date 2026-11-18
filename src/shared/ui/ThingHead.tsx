import type { ReactNode } from 'react'

/**
 * A thing's head on its own Settings page (the board's THINGHEAD, one shape for a lesson's, a
 * course's and the account's): its 64 picture, then its name 20 bold over where it stands (14, Soft
 * Ink), 16 from the picture.
 */
export function ThingHead({
  mark,
  name,
  line,
}: {
  mark: ReactNode
  name: string
  line: ReactNode
}) {
  return (
    <div className="flex items-center gap-4 py-1">
      {mark}
      <div className="flex min-w-0 flex-col gap-0.5">
        <p className="text-xl font-bold text-balance">{name}</p>
        <p className="text-sm wrap-anywhere text-muted-foreground">{line}</p>
      </div>
    </div>
  )
}
