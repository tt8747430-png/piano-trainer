import { useMemo } from 'react'
import { noteIds, type Score, type ScoreAnnotation } from '@/shared/lib/notation'

/** A played note's verdict, as the sheet colours its head (R29 B8, Feedback). */
export type NoteVerdictMark = 'right' | 'wrong' | 'missed' | 'early' | 'late'

/** Each verdict's ink: right grass, wrong rose, early or late honey, missed faded. */
const INK: Readonly<Record<NoteVerdictMark, string>> = {
  right: 'var(--paint-full-grass)',
  wrong: 'var(--destructive)',
  early: 'var(--paint-full-yellow)',
  late: 'var(--paint-full-yellow)',
  missed: 'var(--muted-foreground)',
}

/**
 * A take's verdicts on the score (R29 B8): each judged note's head in its verdict's ink, found by the
 * engraving's ids (`noteIds`), whatever the layout draws.
 */
export function NoteVerdicts({
  score,
  verdicts,
}: {
  score: Score
  /** Each judged note's verdict, by where it is played (`notePlace`). */
  verdicts: ReadonlyMap<string, NoteVerdictMark>
}) {
  const ids = useMemo(() => noteIds(score), [score])
  const css = useMemo(
    () =>
      [...verdicts]
        .flatMap(([place, verdict]) =>
          (ids.get(place) ?? []).map(
            (id) => `[data-slot="score"] [id="${id}"]{color:${INK[verdict]};fill:${INK[verdict]}}`,
          ),
        )
        .join(''),
    [ids, verdicts],
  )
  return css ? <style data-slot="note-verdicts">{css}</style> : null
}

/**
 * The notes a learner circled (R29 B8), ringed in the accent: each note starting at a circle's tick
 * on its staff, found by the engraving's ids.
 */
export function CircledNotes({
  score,
  marks,
}: {
  score: Score
  marks: readonly ScoreAnnotation[]
}) {
  const ids = useMemo(() => noteIds(score), [score])
  const css = useMemo(() => {
    const circled = marks.filter((mark) => mark.kind === 'circle')
    return [...ids]
      .flatMap(([place, named]) => {
        const tick = Number(place.split(':')[0])
        return named.filter((id) =>
          circled.some((mark) => mark.at === tick && id.startsWith(`n-${mark.staff}-${tick}-`)),
        )
      })
      .map(
        (id) =>
          `[data-slot="score"] [id="${id}"] .notehead{filter:drop-shadow(0 0 1.5px var(--primary)) drop-shadow(0 0 1.5px var(--primary))}`,
      )
      .join('')
  }, [ids, marks])
  return css ? <style data-slot="circled-notes">{css}</style> : null
}
