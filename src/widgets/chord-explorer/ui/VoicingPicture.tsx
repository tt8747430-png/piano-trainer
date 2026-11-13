import { letterIndex, type PlacedChord, type PlacedTone } from '@/shared/lib/music'

/** A note's step on the staff, counted in letters from C-1. */
const step = ({ midi, tone }: PlacedTone) =>
  (Math.floor((midi - tone.note.accidental) / 12) - 1) * 7 + letterIndex(tone.note.letter)

/**
 * The voicing drawn, as the canvas's Voicing button draws it: five faint staff lines and the chord's
 * notes as noteheads, lowest at the foot, their steps scaled to fit; a note a step above the one under
 * it stands aside, as a second is written.
 */
export function VoicingPicture({ placed }: { placed: PlacedChord }) {
  const notes = [...placed.lh, ...placed.rh].toSorted((a, b) => a.midi - b.midi).map(step)
  const low = notes[0] ?? 0
  const high = notes.at(-1) ?? 0
  const scale = Math.min(2, 16 / Math.max(1, high - low))
  let previous: { at: number; aside: boolean } | null = null
  const heads = notes.map((at) => {
    const aside = previous !== null && at - previous.at === 1 && !previous.aside
    previous = { at, aside }
    return { cx: aside ? 15 : 10, cy: 19.5 - (at - low) * scale }
  })
  return (
    <svg viewBox="0 0 24 22" width="24" height="22" aria-hidden className="size-auto">
      <path
        d="M2 3.5H22M2 7.5H22M2 11.5H22M2 15.5H22M2 19.5H22"
        stroke="currentColor"
        strokeOpacity=".28"
        strokeWidth="1"
      />
      {heads.map(({ cx, cy }, index) => (
        <ellipse
          key={index}
          cx={cx}
          cy={cy}
          rx="2.9"
          ry="2.05"
          transform={`rotate(-18 ${cx} ${cy})`}
          fill="currentColor"
        />
      ))}
    </svg>
  )
}
