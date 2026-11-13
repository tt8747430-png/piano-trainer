import { useMemo } from 'react'
import { FOLDER_PICTURE_ICONS, useLibrary } from '@/entities/library'
import { isPiece, type Entry } from '@/entities/piece'
import { TileMark } from '@/shared/ui'
import { incipitSteps } from '../model/incipit'

/** The little staff's lines, top down, in the 44-unit square: 4.5 apart round its middle at 22. */
const LINES = [13, 17.5, 22, 26.5, 31]
/** A step of the staff, a line to the next space. */
const STEP = 2.25

/**
 * A song's small cover at the head of its row (canvas 133, "rows show their music"): the picture the
 * learner chose on its paint, as its big cover; else its first notes' heads on a printed staff, a
 * page in both themes, so a song is known by its tune before its name is read. Hidden from a screen
 * reader: the row names the song.
 */
export function PieceMark({ entry }: { entry: Entry }) {
  const look = useLibrary((state) => state.songLooks[entry.id])
  const steps = useMemo(() => (isPiece(entry) ? incipitSteps(entry) : []), [entry])
  if (look) return <TileMark large icon={FOLDER_PICTURE_ICONS[look.picture]} paint={look.paint} />
  const gap = steps.length > 1 ? 24 / (steps.length - 1) : 0
  return (
    <svg
      data-slot="row-tile"
      aria-hidden
      viewBox="0 0 44 44"
      className="size-11 shrink-0 rounded-control bg-(--p-paper-card) text-(--p-ink) shadow-[0_0_0_1px_--alpha(var(--color-foreground)/10%)]"
    >
      {LINES.map((y) => (
        <path key={y} d={`M5 ${y}H39`} stroke="currentColor" strokeWidth={0.7} opacity={0.55} />
      ))}
      {steps.map((step, i) => {
        const x = 10 + i * gap
        const y = 22 - step * STEP
        return (
          <ellipse
            key={i}
            cx={x}
            cy={y}
            rx={2.6}
            ry={2}
            fill="currentColor"
            transform={`rotate(-20 ${x} ${y})`}
          />
        )
      })}
    </svg>
  )
}
