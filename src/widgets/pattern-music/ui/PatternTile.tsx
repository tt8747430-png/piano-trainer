import type { BookPattern, PatternBook } from '@/entities/pattern'
import { cn } from '@/shared/lib'
import type { Midi } from '@/shared/lib/music'
import { PAINT } from '@/shared/ui'
import { usePatternSample } from '../model/use-pattern-sample'

/** The tile's room (the board's 44 square): the notes run from 6 to 38 across, a line at 21.5. */
const LEFT = 6
const SPAN = 32
/** Each hand's four heights: the right hand's over the line, the left hand's under it. */
const LEVELS = 4
const STEP = 3.5
const LOW = 33

/**
 * A pattern as a library row's picture (the board's roll in small, the Accompaniment rows): its bar's
 * notes as short bars on its lilac tile, the right hand in ink over a faint line and the left in the
 * lilac's own ink under it, each hand's higher notes higher. A picture: hidden from readers.
 */
export function PatternTile({ pattern, book }: { pattern: BookPattern; book: PatternBook }) {
  const sample = usePatternSample(pattern, book)
  const notes = sample.sounds.flatMap((sound) =>
    sound.kind === 'note' && (sound.part === 'rh' || sound.part === 'lh')
      ? [{ at: sound.at, duration: sound.duration, midi: sound.midi, part: sound.part }]
      : [],
  )
  const end = Math.max(...notes.map((note) => note.at + note.duration), 0)
  const level = (part: 'rh' | 'lh') => {
    const pitches = [...new Set(notes.filter((n) => n.part === part).map((n) => n.midi))].sort(
      (a, b) => a - b,
    )
    return (midi: Midi) =>
      pitches.length < 2
        ? 1.5
        : Math.round((pitches.indexOf(midi) / (pitches.length - 1)) * (LEVELS - 1))
  }
  const of = { rh: level('rh'), lh: level('lh') }
  return (
    <svg
      viewBox="0 0 44 44"
      aria-hidden
      data-slot="row-tile"
      className={cn(
        'size-11 shrink-0 rounded-thumb ring-1 ring-border',
        PAINT.lilac.fill,
        PAINT.lilac.ink,
      )}
    >
      <path d="M6 21.5h32" className="stroke-foreground/12" />
      {end > 0
        ? notes.map((note, i) => {
            const height = (note.part === 'rh' ? LEVELS : 0) + of[note.part](note.midi)
            return (
              <rect
                key={i}
                x={LEFT + (SPAN * note.at) / end}
                y={LOW - height * STEP}
                width={Math.max(1.6, (SPAN * note.duration) / end - 0.6)}
                height={2.6}
                rx={1.3}
                className={note.part === 'rh' ? 'fill-foreground' : 'fill-current'}
              />
            )
          })
        : null}
    </svg>
  )
}
