import { cn } from '@/shared/lib'

/** A notehead, and the glyph's box: two heads wide (a second sits beside its neighbour), a 7th chord tall. */
const HEAD = { rx: 3.5, ry: 2.5 }
const BOX = { width: 16, height: 26 }
/** A scale step up the stack is half a head, as on a staff: a third's heads touch, a second's overlap. */
const STEP = HEAD.ry
/** A note a second above its neighbour stands to its right, as it is engraved. */
const SECOND_SHIFT = HEAD.rx * 1.7

/**
 * An inversion drawn as its chord's stack of noteheads, the root's in the root's paint: root position
 * a root under even thirds; an inversion its root moved up over a fourth (a 7th chord's, beside the
 * 7th under it), so the picture shows which note is on the bottom without a word.
 */
export function InversionGlyph({
  notes,
  inversion,
  className,
}: {
  /** How many notes the chord stacks: 3 a triad, 4 a 7th chord. */
  notes: number
  inversion: number
  className?: string
}) {
  const size = Math.min(Math.max(notes, 3), 4)
  // Chord tones from the root in thirds; the ones under the bass move up an octave (7 steps).
  const stack = Array.from({ length: size }, (_, tone) => ({
    root: tone === 0,
    step: tone * 2 + (tone < inversion ? 7 : 0),
  })).sort((a, b) => a.step - b.step)
  const lowest = stack[0]?.step ?? 0
  const span = ((stack.at(-1)?.step ?? 0) - lowest) * STEP
  const foot = (BOX.height + span) / 2
  const left = (BOX.width - SECOND_SHIFT) / 2
  return (
    <svg
      viewBox={`0 0 ${BOX.width} ${BOX.height}`}
      aria-hidden
      className={cn('h-8 w-5 shrink-0', className)}
    >
      {stack.map(({ root, step }, i) => {
        const beside = i > 0 && step - (stack[i - 1]?.step ?? step) === 1
        const cx = left + (beside ? SECOND_SHIFT : 0)
        const cy = foot - (step - lowest) * STEP
        return (
          <ellipse
            key={step}
            cx={cx}
            cy={cy}
            rx={HEAD.rx}
            ry={HEAD.ry}
            transform={`rotate(-20 ${cx} ${cy})`}
            className={root ? 'fill-role-root' : 'fill-current'}
          />
        )
      })}
    </svg>
  )
}
