import type { ReactNode } from 'react'
import type { BarMarkChoice } from '@/features/score-editor'
import { keySignature, type Clef, type Key } from '@/shared/lib/music'
import { ClefSign, SignatureGlyphs } from '@/shared/ui/pickers/picker-pictures'
import { SmuflPath, TimeSignatureSign } from '@/shared/ui/smufl'

/** A staff space in the picture's units: its five lines from y 8 to 32. */
const SPACE = 6
const TOP = 8
const LINES = [0, 1, 2, 3, 4].map((line) => TOP + line * SPACE)
/** The picture's size: a short stretch of staff, wide enough for seven sharps after a clef. */
const WIDTH = 96
const HEIGHT = 40

/**
 * A short staff a sign is drawn on (ADR 0115, forScore's palette): its five lines, in the soft ink
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

/** A key's signature after a treble clef, as forScore draws its palette's keys (ADR 0115). */
export function KeyPicture({ signatureOf }: { signatureOf: Key }) {
  const count = keySignature(signatureOf)
  // Centred together: the clef, then the signature's signs.
  const start = WIDTH / 2 - (18 + Math.abs(count) * SPACE * 1.15) / 2
  return (
    <Staff>
      <SmuflPath name="gClef" x={start} y={TOP + 3 * SPACE} space={SPACE} />
      <SignatureGlyphs count={count} x={start + 20} top={TOP} />
    </Staff>
  )
}

/** A clef drawn on its staff (ADR 0115, 0114): the picker's own picture. */
export function ClefPicture({ clef }: { clef: Clef }) {
  return <ClefSign clef={clef} />
}

/** A time signature as a key's face: its figures one over the other, Bravura's (ADR 0114). */
export function TimeFigures({
  meter,
}: {
  meter: { readonly count: number; readonly unit: number }
}) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="size-6" fill="currentColor">
      <TimeSignatureSign count={meter.count} unit={meter.unit} x={12} y={12} space={5} />
    </svg>
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

/** Each barline and ending drawn on its staff (ADR 0115). */
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
  // Flat's Repeat ×N: the end repeat with its times over it.
  repeatTimes: (
    <>
      {dots(MID - 4)}
      {thin(MID + 0.5)}
      {thick(MID + 5)}
      <text x={MID + 9} y={TOP + 4} fontSize="9" fontWeight="700" stroke="none">
        ×
      </text>
    </>
  ),
  ending1: ending('1.'),
  ending2: ending('2.'),
  ending3: ending('3.'),
  ending4: ending('4.'),
} as const satisfies Partial<Record<BarMarkChoice, ReactNode>>

export type BarlinePictured = keyof typeof BARLINES

/** A barline or an ending drawn on its staff (ADR 0115). */
export function BarlinePicture({ choice }: { choice: BarlinePictured }) {
  return <Staff>{BARLINES[choice]}</Staff>
}
