import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { exercisesIn, type Exercise } from '@/entities/exercise'
import { localText, useLocale } from '@/shared/i18n'
import {
  noteParam,
  printedNote,
  spellScale,
  type ScaleKind,
  type SpelledNote,
} from '@/shared/lib/music'
import { PractiseRow, PractiseRows } from '@/shared/ui'

const SCALE_EXERCISES = exercisesIn('scales')

/** The scale's own first exercise, the one the floating bar's Practise this scale opens. */
export const firstScaleExercise = (kind: ScaleKind) =>
  SCALE_EXERCISES.find((exercise) => exercise.fields.kind?.includes(kind) !== false)

/** A drill's opening, as the music it plays (the canvas's PRACTISE line): its first notes, then "…". */
function opening(id: Exercise['id'], names: readonly string[]): string {
  const at = (step: number) => names[((step % names.length) + names.length) % names.length] ?? ''
  const steps = (count: number, each: (step: number) => string) =>
    `${Array.from({ length: count }, (_, step) => each(step)).join(' · ')} …`
  switch (id) {
    case 'thirds':
      return steps(3, (step) => `${at(step)} ${at(step + 2)}`)
    case 'sixths':
      return steps(3, (step) => `${at(step)} ${at(step + 5)}`)
    case 'groups':
      return steps(2, (step) => [0, 1, 2, 3].map((more) => at(step + more)).join(' '))
    case 'contrary':
      return steps(3, (step) => `${at(step)} ${at(-step)}`)
    default:
      return `${[...names, at(0)].join(' ')} …`
  }
}

/**
 * A scale's exercises in the Player (canvas v174's PRACT60, the Chords page's `PractiseRows`), each
 * opening on this scale and showing the music it starts with: the scale itself, in 3rds, in 6ths, in
 * groups, in contrary motion, and the daily routine (a major or minor scale's only).
 */
export function ScaleExercises({ root, kind }: { root: SpelledNote; kind: ScaleKind }) {
  const { t } = useTranslation('practice')
  const locale = useLocale()
  const names = spellScale(root, kind).map((tone) => printedNote(tone.note))
  return (
    <PractiseRows title={t('inPlayer')}>
      {SCALE_EXERCISES.filter((exercise) => exercise.fields.kind?.includes(kind) !== false).map(
        (exercise) => (
          <PractiseRow
            key={exercise.id}
            title={localText(exercise.name, locale)}
            detail={opening(exercise.id, names)}
            render={
              <Link
                to="/play/exercise/$exerciseId"
                params={{ exerciseId: exercise.id }}
                search={{ root: noteParam(root), kind }}
              />
            }
          />
        ),
      )}
    </PractiseRows>
  )
}
