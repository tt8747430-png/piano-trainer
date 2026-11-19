import type { ReactNode } from 'react'
import type { StaffNote } from '@/entities/progress'

/** The board's staff (`RS_CELL`): five lines 8 apart, the bottom one E4 at 48, in a view 82 tall from −6. */
const lineY = (step: number) => 48 - (step - 2) * 4
const ACCIDENTAL_SIGNS: Readonly<Record<StaffNote['accidental'], string>> = {
  [-2]: '𝄫',
  [-1]: '♭',
  0: '',
  1: '♯',
  2: '𝄪',
}

function StaffLines({ width, end }: { width: number; end: boolean }) {
  return (
    <>
      {[0, 1, 2, 3, 4].map((line) => (
        <path
          key={line}
          d={`M0 ${16 + line * 8}H${width}`}
          stroke="currentColor"
          strokeWidth={0.8}
          opacity={0.5}
        />
      ))}
      {end ? <path d={`M${width - 0.6} 16V48`} stroke="currentColor" strokeWidth={1.2} /> : null}
    </>
  )
}

/** A bar of one whole-note chord, as an engraver sets it: a second's upper note to the right, a ledger under C4. */
function ChordCell({
  chord,
  width,
  end,
}: {
  chord: readonly StaffNote[]
  width: number
  end: boolean
}) {
  const cx = width / 2 - 3
  const steps = [...chord].sort((a, b) => a.step - b.step)
  // Accidentals stand in columns left of the chord, the highest nearest it, each moving a column
  // out when one stands less than a sixth above it in the column (Gould, Behind Bars: chords).
  const columns: number[][] = []
  const column = new Map<number, number>()
  for (const note of [...steps].reverse()) {
    if (note.accidental === 0) continue
    const free = columns.findIndex((each) => each.every((step) => step - note.step >= 6))
    const at = free === -1 ? columns.push([]) - 1 : free
    columns[at]?.push(note.step)
    column.set(note.step, at)
  }
  // A second's upper note stands to the right, the next note back on the stem's side.
  const shifts: boolean[] = []
  for (const [index, note] of steps.entries()) {
    const previous = steps[index - 1]
    shifts.push(previous !== undefined && note.step - previous.step === 1 && !shifts[index - 1])
  }
  const heads = steps.map((note, index) => {
    const shifted = shifts[index] ?? false
    const x = cx + (shifted ? 10 : 0)
    const y = lineY(note.step)
    return (
      <g key={`${note.step}-${index}`}>
        {note.accidental !== 0 ? (
          <text
            x={cx - 16 - 8 * (column.get(note.step) ?? 0)}
            y={y + 4}
            fontFamily="Noto Music, serif"
            fontSize={14}
            fill="currentColor"
          >
            {ACCIDENTAL_SIGNS[note.accidental]}
          </text>
        ) : null}
        {note.step <= 0 ? (
          <path
            d={`M${cx - 9} 56H${cx + 9 + (shifted ? 10 : 0)}`}
            stroke="currentColor"
            strokeWidth={1}
          />
        ) : null}
        <ellipse
          cx={x}
          cy={y}
          rx={5.4}
          ry={3.9}
          transform={`rotate(-24 ${x} ${y})`}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.7}
        />
      </g>
    )
  })
  return (
    <svg
      viewBox={`0 -6 ${width} 82`}
      width={width}
      height={82}
      aria-hidden
      className="block shrink-0"
    >
      <StaffLines width={width} end={end} />
      {heads}
    </svg>
  )
}

/**
 * One line of a run's music on the paper (the run boards' `PV_LINE`): the treble clef's cell 40 wide,
 * then each chord a whole note in its own bar, `cell` wide, the line's last bar closed when it ends
 * the music shown; with `marks`, each bar's mark under it in a row 32 tall (the results' `RS_RUNSTAFF`).
 */
export function RunStaff({
  chords,
  cell,
  end,
  marks,
  clefWidth = 40,
}: {
  chords: readonly (readonly StaffNote[])[]
  cell: number
  end: boolean
  marks?: readonly ReactNode[]
  /** The clef's cell: 40 in the run, 34 in its results (`RS_CELL`'s clef). */
  clefWidth?: number
}) {
  const clef = (
    <svg
      viewBox={`0 -6 ${clefWidth} 82`}
      width={clefWidth}
      height={82}
      aria-hidden
      className="block shrink-0"
    >
      <StaffLines width={clefWidth} end={false} />
      <text x={2} y={54} fontFamily="Noto Music, serif" fontSize={40} fill="currentColor">
        𝄞
      </text>
    </svg>
  )
  return (
    <div
      role={marks ? 'list' : undefined}
      className="flex [justify-content:safe_center] overflow-hidden text-foreground"
    >
      <div className="flex shrink-0 flex-col items-center">
        {clef}
        {marks ? <span className="h-8" /> : null}
      </div>
      {chords.map((chord, index) => (
        <div
          key={index}
          role={marks ? 'listitem' : undefined}
          className="flex shrink-0 flex-col items-center"
        >
          <ChordCell chord={chord} width={cell} end={end && index === chords.length - 1} />
          {marks ? (
            <span className="h-8 text-center text-xs leading-4 whitespace-nowrap">
              {marks[index]}
            </span>
          ) : null}
        </div>
      ))}
    </div>
  )
}
