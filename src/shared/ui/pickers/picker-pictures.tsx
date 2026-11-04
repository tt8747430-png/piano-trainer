import type { ReactNode } from 'react'
import { CLEF_FORMS, type Clef } from '@/shared/lib/music'
import { clefSmufl, SMUFL, SmuflPath } from '../smufl'

/** A staff space in the pictures' units: every sign on a short staff is drawn at this one size. */
const SPACE = 6

/**
 * A short staff a sign is drawn on (ADR 0115, 0114): its five lines in the soft ink, the sign over them
 * in the ink of the cell. `top` is the top line's y; the picture is `width` by `height`.
 */
export function ShortStaff({
  width,
  height,
  top,
  className,
  children,
}: {
  width: number
  height: number
  top: number
  className: string
  children: ReactNode
}) {
  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${width} ${height}`}
      fill="currentColor"
      stroke="currentColor"
      className={className}
    >
      <g strokeWidth="0.6" opacity="0.45">
        {[0, 1, 2, 3, 4].map((line) => (
          <line key={line} x1="2" x2={width - 2} y1={top + line * SPACE} y2={top + line * SPACE} />
        ))}
      </g>
      {children}
    </svg>
  )
}

/**
 * The staff steps of a treble signature's sharps (F♯ C♯ G♯ D♯ A♯ E♯ B♯) and flats (B♭ E♭ A♭ D♭ G♭
 * C♭ F♭), from the top line down: 0 the top line, 1 the space under it.
 */
const SHARP_STEPS = [0, 3, -1, 2, 5, 1, 4] as const
const FLAT_STEPS = [4, 1, 5, 2, 6, 3, 7] as const

/** The signs of a key signature on a treble staff whose top line is at `top`, from `x` on. */
export function SignatureGlyphs({ count, x, top }: { count: number; x: number; top: number }) {
  const steps = (count > 0 ? SHARP_STEPS : FLAT_STEPS).slice(0, Math.abs(count))
  // Bravura's sharp is a staff space wide; a flat a little less: each set a space apart.
  const each = SPACE * 1.15
  return (
    <>
      {steps.map((step, i) => (
        <SmuflPath
          key={step}
          name={count > 0 ? 'accidentalSharp' : 'accidentalFlat'}
          x={x + i * each}
          y={top + (step * SPACE) / 2}
          space={SPACE}
        />
      ))}
    </>
  )
}

/**
 * A key signature drawn on a short staff (ADR 0114, Flat's key grid): `count` sharps, flats below zero,
 * none for C major and A minor, the signs centred on the staff.
 */
export function SignatureSigns({ count }: { count: number }) {
  const width = 52
  const top = 10
  const signs = Math.abs(count)
  const x = width / 2 - (signs * SPACE * 1.15) / 2 + 0.6
  return (
    <ShortStaff width={width} height={38} top={top} className="h-9 w-full max-w-16">
      <SignatureGlyphs count={count} x={x} top={top} />
    </ShortStaff>
  )
}

/** The clef pictures' staff: five lines from y 14, room above and below for an octave clef's figure. */
const CLEF_TOP = 14
const CLEF_WIDTH = 40
const CLEF_HEIGHT = 56

/**
 * A clef drawn on a short staff (ADR 0115, 0114): Bravura's glyph on its line, an octave clef's 8 or 15
 * the font's own, every clef at one size.
 */
export function ClefSign({ clef }: { clef: Clef }) {
  const name = clefSmufl(clef)
  const { line } = CLEF_FORMS[clef]
  const y = CLEF_TOP + (5 - line) * SPACE
  // The glyph's ink centred across the cell: its origin set back by half its width.
  const [left, , right] = SMUFL[name].box
  const half = ((left + right) / 2) * (SPACE / 250)
  return (
    <ShortStaff
      width={CLEF_WIDTH}
      height={CLEF_HEIGHT}
      top={CLEF_TOP}
      className="h-12 w-full max-w-12"
    >
      <SmuflPath name={name} x={CLEF_WIDTH / 2 - half} y={y} space={SPACE} />
    </ShortStaff>
  )
}
