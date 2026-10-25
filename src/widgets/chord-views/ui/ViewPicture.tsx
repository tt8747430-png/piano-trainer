import type { MusicView } from '@/entities/settings'

/** A staff's lines, top down. */
const STAFF = [10, 14, 18, 22, 26]
/** The sheet's notes: each head's middle, its stem up from its right side. */
const NOTES = [
  [11, 22],
  [18, 18],
  [25, 20],
  [41, 24],
  [48, 20],
  [55, 16],
] as const

/** A few bars of staff, notes on it. */
function Sheet() {
  return (
    <>
      <g strokeWidth={0.8} className="stroke-current opacity-60">
        {STAFF.map((y) => (
          <line key={y} x1={2} x2={62} y1={y} y2={y} />
        ))}
        {[2, 33, 62].map((x) => (
          <line key={x} x1={x} x2={x} y1={10} y2={26} />
        ))}
      </g>
      {NOTES.map(([x, y]) => (
        <g key={x} className="fill-current stroke-current">
          <ellipse cx={x} cy={y} rx={2.6} ry={1.9} transform={`rotate(-20 ${x} ${y})`} />
          <line x1={x + 2.3} x2={x + 2.3} y1={y - 0.5} y2={y - 11} strokeWidth={1} />
        </g>
      ))}
    </>
  )
}

/** Words as bars, at a line's height: each `[x, width]`. */
function Words({ y, words }: { y: number; words: readonly (readonly [number, number])[] }) {
  return words.map(([x, width]) => (
    <rect key={x} x={x} y={y} width={width} height={3} rx={1.5} className="fill-current" />
  ))
}

/** A chip over a line of words, and a line after it, read and not followed. */
function Lyrics() {
  return (
    <>
      <rect x={4} y={3} width={10} height={6.5} rx={1.6} className="fill-current" />
      <rect x={30} y={3} width={8} height={6.5} rx={1.6} className="fill-current opacity-30" />
      <Words
        y={13}
        words={[
          [4, 14],
          [20, 7],
          [30, 13],
          [45, 12],
        ]}
      />
      <g className="opacity-40">
        <rect x={4} y={21} width={8} height={6.5} rx={1.6} className="fill-current" />
        <rect x={36} y={21} width={10} height={6.5} rx={1.6} className="fill-current" />
        <Words
          y={31}
          words={[
            [4, 10],
            [16, 14],
            [36, 16],
            [54, 6],
          ]}
        />
      </g>
    </>
  )
}

/** A little keyboard: its white keys outlined, its black keys filled, a dot on each key held. */
function Keys({
  x,
  y,
  width,
  held,
}: {
  x: number
  y: number
  width: number
  held: readonly number[]
}) {
  const whites = 5
  const key = width / whites
  const height = width * 0.6
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={1}
        strokeWidth={0.9}
        className="fill-none stroke-current"
      />
      {Array.from({ length: whites - 1 }, (_, i) => (
        <line
          key={i}
          x1={x + key * (i + 1)}
          x2={x + key * (i + 1)}
          y1={y}
          y2={y + height}
          strokeWidth={0.6}
          className="stroke-current"
        />
      ))}
      {/* C♯, D♯ and F♯ over the white keys C to G. */}
      {[1, 2, 4].map((place) => (
        <rect
          key={place}
          x={x + key * place - key * 0.3}
          y={y}
          width={key * 0.6}
          height={height * 0.6}
          className="fill-current"
        />
      ))}
      {held.map((white) => (
        <circle
          key={white}
          cx={x + key * (white + 0.5)}
          cy={y + height * 0.8}
          r={key * 0.28}
          className="fill-current"
        />
      ))}
    </g>
  )
}

/** A row of beat cells, a barline before each bar of four, one filled. */
function Beats({ y, filled, count = 8 }: { y: number; filled: number; count?: number }) {
  const width = 60 / count
  return Array.from({ length: count }, (_, i) => (
    <g key={i}>
      <rect
        x={2 + i * width + 0.4}
        y={y}
        width={width - 0.8}
        height={width - 0.8}
        rx={0.6}
        className={i === filled ? 'fill-current' : 'fill-current opacity-20'}
      />
      {i % 4 === 0 ? (
        <line
          x1={2 + i * width}
          x2={2 + i * width}
          y1={y - 0.5}
          y2={y + width}
          strokeWidth={1.2}
          className="stroke-current"
        />
      ) : null}
    </g>
  ))
}

/** The chord sounding as keys beside the next, greyed, over a strip of beats. */
function Diagrams() {
  return (
    <>
      <Keys x={4} y={2} width={30} held={[0, 2, 4]} />
      <g className="opacity-35">
        <Keys x={40} y={7} width={20} held={[0, 3]} />
      </g>
      <Beats y={29} filled={2} />
    </>
  )
}

/** Bars as rows of beat cells, one filled. */
function Grid() {
  return (
    <>
      <Beats y={5} filled={5} />
      <Beats y={22} filled={-1} />
    </>
  )
}

const PICTURES = { sheet: Sheet, lyrics: Lyrics, diagrams: Diagrams, grid: Grid } as const

/**
 * A view of the music drawn in its own style (ADR 0099), the picture on its tile in the View: a few
 * bars of staff; a chip over a line of words; a diagram beside a greyed one over a strip of beats; a
 * grid of cells, one filled. In the ink of the tile it is on.
 */
export function ViewPicture({ view }: { view: MusicView }) {
  const Picture = PICTURES[view]
  return (
    <svg aria-hidden viewBox="0 0 64 40" className="h-12 w-20 overflow-visible">
      <Picture />
    </svg>
  )
}
