import { CLEF_FORMS, type Clef } from '@/shared/lib/music'
import { G_CLEF } from './palette-icons'

/** A staff space in the pictures' units. */
const SPACE = 6
/** Bravura's units to the pictures': 250 to a staff space. */
const GLYPH = SPACE / 250

/** A sharp centred on a line or space, three spaces tall. */
function Sharp({ x, y }: { x: number; y: number }) {
  return (
    <path
      d="M8.5 3h1.4v18H8.5zM14.1 2h1.4v18h-1.4zM5 9.6 19 6.6v2.8L5 12.4zM5 15.6l14-3v2.8L5 18.4z"
      stroke="none"
      transform={`translate(${x} ${y}) scale(0.55) translate(-12 -11.5)`}
    />
  )
}

/** A flat, its bowl on a line or space and its stem two spaces above. */
function Flat({ x, y }: { x: number; y: number }) {
  return (
    <path
      d={`M${x - 1.6} ${y - 10} V${y + 3} C${x + 3.6} ${y + 0.6} ${x + 4.6} ${y - 3.6} ${x + 1.2} ${y - 3.4} C${x - 0.2} ${y - 3.3} ${x - 1.2} ${y - 2.4} ${x - 1.6} ${y - 1.2}`}
      fill="none"
      strokeWidth="1.25"
      strokeLinejoin="round"
    />
  )
}

/**
 * The staff steps of a treble signature's sharps (F♯ C♯ G♯ D♯ A♯ E♯ B♯) and flats (B♭ E♭ A♭ D♭ G♭
 * C♭ F♭), from the top line down: 0 the top line, 1 the space under it.
 */
const SHARP_STEPS = [0, 3, -1, 2, 5, 1, 4] as const
const FLAT_STEPS = [4, 1, 5, 2, 6, 3, 7] as const

/**
 * A key signature's signs alone, where a treble staff would place them, with no staff under them
 * (ADR 0114, as notation apps' key sheets draw their tiles): `count` sharps, or flats below zero.
 */
export function SignatureSigns({ count }: { count: number }) {
  const steps = (count > 0 ? SHARP_STEPS : FLAT_STEPS).slice(0, Math.abs(count))
  const each = 6.5
  const width = 7 * each + 6
  const top = 9
  const start = width / 2 - ((steps.length - 1) * each) / 2
  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${width} 40`}
      fill="currentColor"
      stroke="currentColor"
      className="h-9 w-full max-w-16"
    >
      {steps.map((step, i) => {
        const x = start + i * each
        const y = top + (step * SPACE) / 2
        return count > 0 ? <Sharp key={step} x={x} y={y} /> : <Flat key={step} x={x} y={y} />
      })}
    </svg>
  )
}

/** The clef pictures' staff: five lines from y 14, room above and below for a C clef off it. */
const TOP = 14
const WIDTH = 40
const HEIGHT = 52
const lineY = (line: number) => TOP + (5 - line) * SPACE

/** The G clef, Bravura's, its curl round the line given. */
function GClef({ x, line }: { x: number; line: number }) {
  return (
    <path
      d={G_CLEF}
      stroke="none"
      transform={`translate(${x} ${lineY(line)}) scale(${GLYPH} ${-GLYPH}) translate(-336 0)`}
    />
  )
}

/** The F clef, drawn: its curl from the line given, its two dots either side of it. */
function FClef({ x, line }: { x: number; line: number }) {
  return (
    <g transform={`translate(${x - 8} ${lineY(line)})`}>
      <circle cx="2.2" cy="0.4" r="2.2" stroke="none" />
      <path
        d="M0.4 0.4 C0.4 -4.6 4 -6.4 7.2 -6.2 C11.4 -6 13.4 -2.8 13.2 1.6 C12.8 9.4 6.4 15 -0.6 18.2"
        fill="none"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
      <circle cx="16.4" cy="-2.6" r="1.25" stroke="none" />
      <circle cx="16.4" cy="3.2" r="1.25" stroke="none" />
    </g>
  )
}

/** The C clef, drawn: a thick and a thin bar four spaces tall, two bows meeting at its line. */
function CClef({ x, line }: { x: number; line: number }) {
  const c = lineY(line)
  const half = 2 * SPACE
  const left = x - 7
  const bow = (way: 1 | -1) =>
    `M${left + 5.4} ${c - way * 0.4} C${left + 8} ${c - way * 0.4} ${left + 9.5} ${c - way * 2.6} ${left + 10} ${c - way * 4.8} C${left + 10.6} ${c - way * 7.6} ${left + 12.4} ${c - way * 10.6} ${left + 14.6} ${c - way * 10.2}`
  return (
    <g>
      <rect x={left} y={c - half} width="2.8" height={2 * half} stroke="none" />
      <rect x={left + 4} y={c - half} width="0.9" height={2 * half} stroke="none" />
      <path d={bow(1)} fill="none" strokeWidth="1.6" strokeLinecap="round" />
      <path d={bow(-1)} fill="none" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx={left + 13.2} cy={c - 9.4} r="1.9" stroke="none" />
      <circle cx={left + 13.2} cy={c + 9.4} r="1.9" stroke="none" />
    </g>
  )
}

/**
 * A clef drawn on a short staff (ADR 0110, 0114): its sign on its line, an octave clef's 8 or 15 over
 * or under it, small, as notation apps print it.
 */
export function ClefSign({ clef }: { clef: Clef }) {
  const { shape, line, octaves } = CLEF_FORMS[clef]
  const x = WIDTH / 2
  // The 8 or 15 just off the sign: a G clef reaches a space over the staff and two under it.
  const mark = octaves === 0 ? null : Math.abs(octaves) === 2 ? '15' : '8'
  const over = shape === 'G' ? TOP - 8 : TOP - 3
  const under = shape === 'G' ? TOP + 4 * SPACE + 13 : lineY(line) + 21
  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      fill="currentColor"
      stroke="currentColor"
      className="h-12 w-full max-w-12"
    >
      <g strokeWidth="0.6" opacity="0.45">
        {[1, 2, 3, 4, 5].map((each) => (
          <line key={each} x1="3" x2={WIDTH - 3} y1={lineY(each)} y2={lineY(each)} />
        ))}
      </g>
      {shape === 'G' ? <GClef x={x - 1} line={line} /> : null}
      {shape === 'F' ? <FClef x={x} line={line} /> : null}
      {shape === 'C' ? <CClef x={x} line={line} /> : null}
      {mark ? (
        <text
          x={x + (shape === 'F' ? -2 : 0)}
          y={octaves > 0 ? over : under}
          textAnchor="middle"
          fontSize="7.5"
          fontStyle="italic"
          fontWeight="700"
          stroke="none"
          className="font-display"
        >
          {mark}
        </text>
      ) : null}
    </svg>
  )
}
