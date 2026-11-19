import type { RunChord, RunNote } from '../model/run-music'

/** The board's staff (`RS_CELL`): five lines 8 apart, the bottom one E4 at 48, in a view 82 tall from −6. */
const lineY = (step: number) => 48 - (step - 2) * 4
const ACCIDENTAL_SIGNS: Readonly<Record<RunNote['accidental'], string>> = {
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
function ChordCell({ chord, width, end }: { chord: RunChord; width: number; end: boolean }) {
  const cx = width / 2 - 3
  const steps = [...chord.notes].sort((a, b) => a.step - b.step)
  let shifted = false
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
  const heads = steps.map((note, index) => {
    const previous = steps[index - 1]
    shifted = previous !== undefined && note.step - previous.step === 1 && !shifted
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
 * the music shown.
 */
export function RunStaff({
  chords,
  cell,
  end,
}: {
  chords: readonly RunChord[]
  cell: number
  end: boolean
}) {
  return (
    <div className="flex [justify-content:safe_center] overflow-hidden text-foreground">
      <svg viewBox="0 -6 40 82" width={40} height={82} aria-hidden className="block shrink-0">
        <StaffLines width={40} end={false} />
        <text x={2} y={54} fontFamily="Noto Music, serif" fontSize={40} fill="currentColor">
          𝄞
        </text>
      </svg>
      {chords.map((chord, index) => (
        <ChordCell
          key={index}
          chord={chord}
          width={cell}
          end={end && index === chords.length - 1}
        />
      ))}
    </div>
  )
}
