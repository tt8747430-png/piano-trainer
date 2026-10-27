import type { ReactNode } from 'react'
import type { BarMarkChoice } from '@/features/score-editor'
import { keySignature, type Clef, type Key, type Meter } from '@/shared/lib/music'
import { G_CLEF } from './palette-icons'

/** A staff space in the picture's units: its five lines from y 8 to 32. */
const SPACE = 6
const TOP = 8
const LINES = [0, 1, 2, 3, 4].map((line) => TOP + line * SPACE)
/** The picture's size: a short stretch of staff, wide enough for seven sharps after a clef. */
const WIDTH = 96
const HEIGHT = 40
/** Bravura's units to the picture's: 250 to a staff space. */
const GLYPH = SPACE / 250

/**
 * A short staff a sign is drawn on (ADR 0110, forScore's palette): its five lines, in the soft ink
 * the palette's staves wear, and the sign over them in the ink of the tile.
 */
function Staff({ children }: { children: ReactNode }) {
  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      fill="currentColor"
      stroke="currentColor"
      className="h-full w-full max-w-28"
    >
      <g strokeWidth="0.7" opacity="0.45">
        {LINES.map((y) => (
          <line key={y} x1="2" x2={WIDTH - 2} y1={y} y2={y} />
        ))}
      </g>
      {children}
    </svg>
  )
}

/** The treble clef, Bravura's, its curl round the G line (the second from the bottom). */
function TrebleClef({ x }: { x: number }) {
  return (
    <path
      d={G_CLEF}
      stroke="none"
      transform={`translate(${x} ${TOP + 3 * SPACE}) scale(${GLYPH} ${-GLYPH}) translate(-336 0)`}
    />
  )
}

/** The bass clef, drawn: its curl from the F line (the second from the top), its two dots round it. */
function BassClef({ x }: { x: number }) {
  const f = TOP + SPACE
  return (
    <g transform={`translate(${x - 7} ${f})`}>
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
const stepY = (step: number) => TOP + (step * SPACE) / 2

/** A clef drawn on its staff (ADR 0110). */
export function ClefPicture({ clef }: { clef: Clef }) {
  return (
    <Staff>{clef === 'bass' ? <BassClef x={WIDTH / 2} /> : <TrebleClef x={WIDTH / 2} />}</Staff>
  )
}

/** A key's signature after a treble clef, as forScore draws its palette's keys (ADR 0110). */
export function KeyPicture({ signatureOf }: { signatureOf: Key }) {
  const count = keySignature(signatureOf)
  const steps = (count > 0 ? SHARP_STEPS : FLAT_STEPS).slice(0, Math.abs(count))
  // Centred together: the clef, then the signature's signs, each a little apart.
  const each = 7
  const start = WIDTH / 2 - (16 + steps.length * each) / 2
  return (
    <Staff>
      <TrebleClef x={start + 8} />
      {steps.map((step, i) => {
        const x = start + 20 + i * each
        return count > 0 ? (
          <Sharp key={step} x={x} y={stepY(step)} />
        ) : (
          <Flat key={step} x={x} y={stepY(step)} />
        )
      })}
    </Staff>
  )
}

/** Common time's C, as the music font prints it. */
export const COMMON_TIME = '\u{1D134}'

/** A time signature, its count over its unit across the staff, or 4/4 as C (ADR 0110, 0114). */
export function TimePicture({ meter, common = false }: { meter: Meter; common?: boolean }) {
  const [count, unit] = meter.split('/')
  const figure = {
    textAnchor: 'middle',
    dominantBaseline: 'central',
    fontSize: 15,
    fontWeight: 800,
    stroke: 'none',
    className: 'font-display',
  } as const
  return (
    <Staff>
      {common ? (
        <text
          x={WIDTH / 2}
          y={TOP + 2 * SPACE}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={26}
          stroke="none"
          className="font-music"
        >
          {COMMON_TIME}
        </text>
      ) : (
        <>
          <text x={WIDTH / 2} y={TOP + SPACE} {...figure}>
            {count}
          </text>
          <text x={WIDTH / 2} y={TOP + 3 * SPACE} {...figure}>
            {unit}
          </text>
        </>
      )}
    </Staff>
  )
}

/** A time signature as a key's face: its figures one over the other, or 4/4 as C (ADR 0114). */
export function TimeFigures({
  meter,
  common = false,
}: {
  meter: Meter | { readonly count: number; readonly unit: number }
  common?: boolean
}) {
  if (common)
    return (
      <span aria-hidden className="font-music text-3xl leading-none">
        {COMMON_TIME}
      </span>
    )
  const [count, unit] = typeof meter === 'string' ? meter.split('/') : [meter.count, meter.unit]
  return (
    <span
      aria-hidden
      className="flex flex-col items-center font-serif text-base leading-[0.85] font-bold"
    >
      <span>{count}</span>
      <span>{unit}</span>
    </span>
  )
}

/** A thin barline at `x` across the staff. */
const thin = (x: number) => <line x1={x} x2={x} y1={TOP} y2={TOP + 4 * SPACE} strokeWidth="1" />
/** A thick one. */
const thick = (x: number) => (
  <rect x={x - 1.6} y={TOP} width="3.2" height={4 * SPACE} stroke="none" />
)
/** A repeat's two dots, in the spaces either side of the middle line. */
const dots = (x: number) => (
  <>
    <circle cx={x} cy={TOP + 1.5 * SPACE} r="1.4" stroke="none" />
    <circle cx={x} cy={TOP + 2.5 * SPACE} r="1.4" stroke="none" />
  </>
)
/** An ending's bracket over the staff, its number in it. */
const ending = (n: string) => (
  <>
    <path
      d={`M${WIDTH / 2 - 16} ${TOP + 2 * SPACE} V${TOP - 5} H${WIDTH / 2 + 22}`}
      fill="none"
      strokeWidth="1"
    />
    <text x={WIDTH / 2 - 12} y={TOP + 4} fontSize="9" fontWeight="700" stroke="none">
      {n}
    </text>
  </>
)

const MID = WIDTH / 2

/** Each barline and ending drawn on its staff (ADR 0110). */
const BARLINES = {
  plain: thin(MID),
  double: (
    <>
      {thin(MID - 2)}
      {thin(MID + 2)}
    </>
  ),
  final: (
    <>
      {thin(MID - 3)}
      {thick(MID + 2)}
    </>
  ),
  repeatStart: (
    <>
      {thick(MID - 5)}
      {thin(MID - 0.5)}
      {dots(MID + 4)}
    </>
  ),
  repeatEnd: (
    <>
      {dots(MID - 4)}
      {thin(MID + 0.5)}
      {thick(MID + 5)}
    </>
  ),
  ending1: ending('1.'),
  ending2: ending('2.'),
} as const satisfies Partial<Record<BarMarkChoice, ReactNode>>

export type BarlinePictured = keyof typeof BARLINES

/** A barline or an ending drawn on its staff (ADR 0110). */
export function BarlinePicture({ choice }: { choice: BarlinePictured }) {
  return <Staff>{BARLINES[choice]}</Staff>
}
