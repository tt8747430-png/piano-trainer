import type { SheetView } from '@/shared/lib'

/** Where the notes of a miniature line stand, by turns, down from its top line. */
const HEIGHTS = [4.8, 3.2, 1.6, 3.2] as const

/** A line of music in miniature: a staff's five lines from `x1` to `x2` at `y`, its notes as dots. */
function Line({ x1, x2, y }: { x1: number; x2: number; y: number }) {
  const notes = Array.from({ length: Math.floor((x2 - x1 - 4) / 7) }, (_, i) => x1 + 5 + i * 7)
  return (
    <g>
      <g strokeWidth={0.5} className="stroke-current opacity-60">
        {[0, 1.6, 3.2, 4.8, 6.4].map((step) => (
          <line key={step} x1={x1} x2={x2} y1={y + step} y2={y + step} />
        ))}
      </g>
      {notes.map((x, i) => (
        <circle
          key={x}
          cx={x}
          cy={y + (HEIGHTS[i % HEIGHTS.length] ?? 0)}
          r={1.1}
          className="fill-current"
        />
      ))}
    </g>
  )
}

/** An A4 page, its lines inside its margins. */
function Page() {
  return (
    <>
      <rect
        x={18}
        y={1}
        width={28}
        height={38}
        rx={1.5}
        strokeWidth={0.9}
        className="fill-none stroke-current"
      />
      {[5, 15, 25].map((y) => (
        <Line key={y} x1={21} x2={43} y={y} />
      ))}
    </>
  )
}

/** Lines one under the other, running on past the foot, an arrow down beside them. */
function Vertical() {
  return (
    <>
      {[2, 13, 24].map((y) => (
        <Line key={y} x1={6} x2={50} y={y} />
      ))}
      <g className="opacity-35">
        <Line x1={6} x2={50} y={35} />
      </g>
      <path
        d="M57 10 V30 M53.5 26.5 L57 30 L60.5 26.5"
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="fill-none stroke-current"
      />
    </>
  )
}

/** One line running out past both sides, an arrow across under it. */
function Panorama() {
  return (
    <>
      <Line x1={0} x2={64} y={10} />
      <path
        d="M14 30 H50 M18 26.5 L14 30 L18 33.5 M46 26.5 L50 30 L46 33.5"
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="fill-none stroke-current"
      />
    </>
  )
}

const PICTURES = { page: Page, vertical: Vertical, panorama: Panorama } as const

/**
 * A score's layout in miniature (ADR 0115), its tile's picture in the View: a page; lines down the
 * screen, scrolled down; one line across, scrolled across. In the ink of the tile it is on.
 */
export function LayoutPicture({ layout }: { layout: SheetView }) {
  const Picture = PICTURES[layout]
  return (
    <svg aria-hidden viewBox="0 0 64 40" className="h-10 w-16 overflow-visible">
      <Picture />
    </svg>
  )
}
