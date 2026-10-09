import { FINGERS, midi, PIANO, type Finger, type Midi } from '@/shared/lib/music'
import { isOneOf } from './is-one-of'

/** A teaching diagram's two colours: the hands' tones (`a` the right, `b` the left). */
export const DIAGRAM_COLOURS = ['a', 'b'] as const
export type DiagramColour = (typeof DIAGRAM_COLOURS)[number]

/** A key marked on a teaching diagram: its colour, and the finger on it where there is one. */
export interface DiagramMark {
  readonly colour: DiagramColour
  readonly finger?: Finger
}

/** A diagram's marked keys. */
export type DiagramMarks = ReadonlyMap<Midi, DiagramMark>

const isColour = isOneOf(DIAGRAM_COLOURS)
/** One mark as a URL writes it: the key, its colour, then its finger (`60a3`, `64b`). */
const MARK = /^(\d{2,3})([ab])([1-5])?$/

const fingerOf = (written: string | undefined): { finger?: Finger } => {
  const finger = FINGERS.find((each) => String(each) === written)
  return finger === undefined ? {} : { finger }
}

/**
 * A `marks` param read (spec 2026-10-09 §5.2): each mark on the piano kept, a key's last mark
 * standing; anything else left out, so a link sent with a slip still opens its diagram.
 */
export function readDiagramMarks(param: string): DiagramMarks {
  const marks = new Map<Midi, DiagramMark>()
  for (const written of param.split(',')) {
    const [, key, colour, finger] = MARK.exec(written) ?? []
    const number = Number(key)
    if (!isColour(colour) || number < PIANO.from || number > PIANO.to) continue
    marks.set(midi(number), { colour, ...fingerOf(finger) })
  }
  return marks
}

/** The marks written back as a `marks` param, lowest key first. */
export const diagramMarksParam = (marks: DiagramMarks): string =>
  [...marks]
    .sort(([a], [b]) => a - b)
    .map(([key, { colour, finger }]) => `${key}${colour}${finger ?? ''}`)
    .join(',')

const sameMark = (a: DiagramMark, b: DiagramMark) => a.colour === b.colour && a.finger === b.finger

/** A key tapped in Mark: marked as `mark`; tapped again with the same mark, cleared; with another, it takes it. */
export function markKey(marks: DiagramMarks, key: Midi, mark: DiagramMark): DiagramMarks {
  const next = new Map(marks)
  const had = marks.get(key)
  if (had && sameMark(had, mark)) next.delete(key)
  else
    next.set(key, {
      colour: mark.colour,
      ...(mark.finger === undefined ? {} : { finger: mark.finger }),
    })
  return next
}
