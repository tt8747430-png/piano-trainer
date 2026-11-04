import type { Dynamic, NoteMarks } from '@/shared/lib/music'
import type { Measure, NotesEvent, Score, ScoreEvent, StaffId } from './types'

/** A mark typed onto a score (R29 B8): the learner's, written as the engraving's own marks. */
export type ScoreAnnotation = {
  readonly at: number
  readonly staff: StaffId
} & (
  | { readonly kind: 'text'; readonly value: string }
  | { readonly kind: 'fingering'; readonly value: 1 | 2 | 3 | 4 | 5 }
  | { readonly kind: 'dynamic'; readonly value: Dynamic }
  | { readonly kind: 'breath' | 'pause' | 'circle' }
)

/** The marks a typed mark adds to its notes: a circle is drawn round them apart (`circledNotes`). */
function marked(event: NotesEvent, mark: ScoreAnnotation): NotesEvent {
  const marks: NoteMarks = event.marks ?? {}
  switch (mark.kind) {
    case 'text':
      return { ...event, marks: { ...marks, text: mark.value } }
    case 'dynamic':
      return { ...event, marks: { ...marks, dynamic: mark.value } }
    case 'breath':
    case 'pause': {
      // A breath mark after the note, a pause's fermata over it: the engraving's own articulations.
      const artic = mark.kind === 'breath' ? 'breath' : 'fermata'
      const kept = (marks.articulations ?? []).filter((each) => each !== artic)
      return { ...event, marks: { ...marks, articulations: [...kept, artic] } }
    }
    case 'fingering': {
      // On the chord's top note, its notes kept in their order (the engraving's ids follow it).
      const top = Math.max(...event.notes.map((each) => each.midi))
      const finger = mark.value
      return {
        ...event,
        notes: event.notes.map((each) => (each.midi === top ? { ...each, finger } : each)),
      }
    }
    case 'circle':
      return event
  }
}

/**
 * A score with the learner's typed marks written in (R29 B8, D7): each on the notes that start at its
 * tick on its staff, as the engraving's own text, finger, dynamic, breath mark or fermata. A mark
 * where no note starts is left out.
 */
export function annotate(score: Score, marks: readonly ScoreAnnotation[]): Score {
  if (marks.length === 0) return score
  const measures = score.measures.map((measure): Measure => {
    const end = measure.startTick + measure.ticks
    const here = marks.filter((mark) => mark.at >= measure.startTick && mark.at < end)
    if (here.length === 0) return measure
    const staves = { ...measure.staves }
    for (const staff of Object.keys(staves) as StaffId[]) {
      const voices = staves[staff]
      const own = here.filter((mark) => mark.staff === staff)
      if (!voices || own.length === 0) continue
      staves[staff] = voices.map((voice, index) =>
        index > 0
          ? voice
          : {
              ...voice,
              events: voice.events.map((event): ScoreEvent =>
                event.kind === 'notes'
                  ? own
                      .filter((mark) => mark.at === event.tick)
                      .reduce((done, mark) => marked(done, mark), event)
                  : event,
              ),
            },
      )
    }
    return { ...measure, staves }
  })
  return { ...score, measures }
}

/** The notes a learner circled, by their onset and staff: what the sheet rings (`noteIds`). */
export const circledAt = (marks: readonly ScoreAnnotation[]): readonly ScoreAnnotation[] =>
  marks.filter((mark) => mark.kind === 'circle')
