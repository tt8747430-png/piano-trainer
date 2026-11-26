import { cn } from '@/shared/lib'
import { PAINT } from '@/shared/ui'
import type { FolderLook } from '../model/types'

/** One page of the stack: a sheet of paper, tilted, with five lines of music on it. */
function Page({ x, y, turn }: { x: number; y: number; turn: number }) {
  return (
    <g transform={`rotate(${turn} ${x + 12} ${y + 15})`}>
      <rect
        x={x}
        y={y}
        width="24"
        height="30"
        rx="3"
        className="fill-card stroke-foreground"
        strokeOpacity={0.18}
      />
      {[0, 1, 2, 3, 4].map((line) => (
        <path
          key={line}
          d={`M${x + 4} ${y + 12 + line * 3}H${x + 20}`}
          className="stroke-foreground"
          strokeWidth={0.6}
          opacity={0.45}
        />
      ))}
    </g>
  )
}

/**
 * A folder's tile, as the Songs board draws it (`STACK`): two pages of music, one tilted over the
 * other, on the folder's paint; `large` at a library row's head and a folder's page.
 */
export function FolderTile({
  look,
  large = false,
  className,
}: {
  look: FolderLook
  large?: boolean
  className?: string
}) {
  return (
    <span
      data-slot="row-tile"
      aria-hidden
      className={cn(
        'grid shrink-0 place-items-center overflow-hidden',
        large ? 'size-11 rounded-control' : 'size-7.5 rounded-tile',
        PAINT[look.paint].fill,
        className,
      )}
    >
      <svg viewBox="0 0 44 44" className="size-full">
        <Page x={6} y={9} turn={-10} />
        <Page x={14} y={7} turn={8} />
      </svg>
    </span>
  )
}
