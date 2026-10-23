import type { Ref } from 'react'
import { staffTops } from './size'

/**
 * The staff's place while its engraver loads: its five lines, faint, where the engraving will draw
 * them, so the page reads as music on its way rather than a gap.
 */
export function StaffPlace({
  place,
  height,
  scale,
  count,
}: {
  place?: Ref<HTMLDivElement>
  height: number
  scale: number
  /** How many staves: each staff's top line where the engraving will place it. */
  count: number
}) {
  const tops = staffTops(count)
  return (
    <div ref={place} style={{ height: height * scale }} className="text-hairline" aria-hidden>
      <svg width="100%" height="100%" preserveAspectRatio="none">
        {tops.flatMap((top) =>
          [0, 10, 20, 30, 40].map((line) => (
            <line
              key={top + line}
              x1="0"
              x2="100%"
              y1={(top + line) * scale}
              y2={(top + line) * scale}
              stroke="currentColor"
            />
          )),
        )}
      </svg>
    </div>
  )
}
