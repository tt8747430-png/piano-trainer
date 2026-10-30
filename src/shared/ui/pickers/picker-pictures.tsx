import { CLEF_FORMS, type Clef } from '@/shared/lib/music'

/** The music font's G clef, its outline in the font's units (1000 to an em). */
export const G_CLEF =
  'M376 415l25 -145c3 -18 3 -18 29 -18c147 0 241 -113 241 -241c0 -113 -67 -198 -168 -238c-14 -6 -15 -5 -13 -17c11 -62 29 -157 29 -214c0 -170 -130 -200 -197 -200c-151 0 -190 98 -190 163c0 62 40 115 107 115c61 0 96 -47 96 -102c0 -58 -36 -85 -67 -94c-23 -7 -32 -10 -32 -17c0 -13 26 -29 80 -29c59 0 159 18 159 166c0 47 -15 134 -27 201c-2 12 -4 11 -15 9c-20 -4 -46 -6 -69 -6c-245 0 -364 165 -364 339c0 202 153 345 297 464c12 10 11 12 9 24c-7 41 -14 106 -14 164c0 104 24 229 98 311c20 22 51 48 65 48c11 0 37 -28 52 -50c41 -60 65 -146 65 -233c0 -153 -82 -280 -190 -381c-6 -6 -8 -7 -6 -19zM470 943c-61 0 -133 -96 -133 -252c0 -32 2 -66 6 -92c2 -13 6 -14 13 -8c79 69 174 159 174 270c0 55 -27 82 -60 82zM361 262l-21 128c-2 11 -4 12 -14 4c-47 -38 -93 -75 -153 -142c-83 -94 -93 -173 -93 -232c0 -139 113 -236 288 -236c20 0 40 2 56 5c15 3 16 3 14 14l-50 298c-2 11 -4 12 -20 8c-61 -17 -100 -60 -100 -117c0 -46 30 -89 72 -107c7 -3 15 -6 15 -13c0 -6 -4 -11 -12 -11c-7 0 -19 3 -27 6c-68 23 -115 87 -115 177c0 85 57 164 145 194c18 6 18 5 15 24zM430 103l49 -285c2 -12 4 -12 16 -6c56 28 94 79 94 142c0 88 -67 156 -148 163c-12 1 -13 -2 -11 -14z'

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

/**
 * The C clef, the music font's: its glyph an em tall, four spaces, its middle on the line given (its
 * baseline two spaces under it).
 */
function CClef({ x, line }: { x: number; line: number }) {
  return (
    <text
      x={x}
      y={lineY(line) + 2 * SPACE}
      textAnchor="middle"
      fontSize={4 * SPACE}
      stroke="none"
      className="font-music"
    >
      {'\u{1D121}'}
    </text>
  )
}

/**
 * A clef drawn on a short staff (ADR 0115, 0114): its sign on its line, an octave clef's 8 or 15 over
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
