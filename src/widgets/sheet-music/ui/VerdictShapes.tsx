import { VERDICT_INK, VERDICT_SHAPE, type VerdictMark } from '@/shared/ui'
import type { ScoreLayout } from '@/shared/ui/score'

/**
 * Each judged head's verdict as a shape beside it (DESIGN.md, Second Cue Rule; R34): ● right,
 * ◂ early, ▸ late, ○ missed, × wrong, in the verdict's ink, so the colour is never the only cue.
 * Placed by the engraving's layout; the take's summary says the same in words.
 */
export function VerdictShapes({
  layout,
  heads,
}: {
  layout: Pick<ScoreLayout, 'heads'>
  /** Each judged head's verdict, by its engraved id. */
  heads: ReadonlyMap<string, VerdictMark>
}) {
  if (heads.size === 0) return null
  return (
    <div
      aria-hidden
      data-slot="verdict-shapes"
      className="pointer-events-none absolute inset-0 z-10"
    >
      {(layout.heads ?? []).flatMap((head) => {
        const verdict = heads.get(head.id)
        if (!verdict) return []
        return [
          <span
            key={head.id}
            data-verdict={verdict}
            className="absolute -translate-y-1/2 text-[0.6875rem] leading-none font-bold"
            style={{
              left: head.right + 2,
              top: (head.top + head.bottom) / 2,
              color: VERDICT_INK[verdict],
            }}
          >
            {VERDICT_SHAPE[verdict]}
          </span>,
        ]
      })}
    </div>
  )
}
