import type { PatternSample } from '../model/pattern-sample'

/** The roll's drawing room: a bar's width to its height, as the board's ROLL (340 × 68). */
const WIDTH = 340
const HEIGHT = 68
/** Each hand's lane: the right hand's over the middle line, the left hand's under it. */
const LANES = { rh: { top: 4, bottom: 30 }, lh: { top: 40, bottom: 64 } } as const
const NOTE = 7

/**
 * How a pattern plays, as a piano roll (the board's ROLL): each hand's notes in its lane, the right
 * hand amber over the middle line and the left hand blue under it, higher notes higher, on a grid of
 * its beats. `label` says it for readers.
 */
export function PatternRoll({ sample, label }: { sample: PatternSample; label: string }) {
  const notes = sample.sounds.flatMap((sound) =>
    sound.kind === 'note' && (sound.part === 'rh' || sound.part === 'lh')
      ? [{ ...sound, part: sound.part }]
      : [],
  )
  const end = Math.max(...notes.map((note) => note.at + note.duration), 0)
  // A line on every beat of every bar, the bars' own lines stronger.
  const count = Number.parseInt(sample.music.meter, 10)
  const beats = Math.max(sample.music.bars.length, 1) * count
  const x = (seconds: number) => (end > 0 ? (seconds / end) * WIDTH : 0)
  const lane = (part: 'rh' | 'lh') => {
    const pitches = notes.filter((note) => note.part === part).map((note) => note.midi)
    const low = Math.min(...pitches)
    const high = Math.max(...pitches)
    const { top, bottom } = LANES[part]
    return (midi: number) =>
      high === low
        ? (top + bottom - NOTE) / 2
        : bottom - NOTE - ((midi - low) / (high - low)) * (bottom - top - NOTE)
  }
  const y = { rh: lane('rh'), lh: lane('lh') }
  return (
    <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-label={label} className="block w-full">
      {Array.from({ length: beats + 1 }, (_, beat) => (
        <path
          key={beat}
          d={`M${(beat / beats) * WIDTH} 0V${HEIGHT}`}
          className="stroke-muted"
          strokeWidth={beat % count === 0 ? 1.5 : 0.8}
        />
      ))}
      <path d={`M0 ${HEIGHT / 2 + 2}H${WIDTH}`} className="stroke-border" />
      {notes.map((note, index) => (
        <rect
          key={index}
          x={x(note.at) + 2}
          y={y[note.part](note.midi)}
          width={Math.max(x(note.duration) - 4, 3)}
          height={NOTE}
          rx={3}
          fill={note.part === 'rh' ? 'var(--p-roll-amber)' : 'var(--p-roll-blue)'}
        />
      ))}
    </svg>
  )
}
