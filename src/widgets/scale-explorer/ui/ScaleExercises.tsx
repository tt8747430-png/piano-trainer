import { Link } from '@tanstack/react-router'
import { Spline } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { exercisesIn } from '@/entities/exercise'
import { localText, useLocale } from '@/shared/i18n'
import { noteParam, type ScaleKind, type SpelledNote } from '@/shared/lib/music'
import { LevelMark, RowGroup, RowLink } from '@/shared/ui'

const SCALE_EXERCISES = exercisesIn('scales')

/**
 * A scale's exercises in the Player, each opening on this scale: the scale itself over several
 * octaves, in 3rds, in 6ths, in groups and in contrary motion.
 */
export function ScaleExercises({ root, kind }: { root: SpelledNote; kind: ScaleKind }) {
  const { t } = useTranslation('practice')
  const locale = useLocale()
  return (
    <RowGroup title={t('inPlayer')}>
      {SCALE_EXERCISES.map((exercise) => (
        <li key={exercise.id}>
          <RowLink
            title={localText(exercise.name, locale)}
            detail={localText(exercise.trains, locale)}
            icon={Spline}
            paint="sky"
            trailing={<LevelMark level={exercise.level} />}
            render={
              <Link
                to="/play/exercise/$exerciseId"
                params={{ exerciseId: exercise.id }}
                search={{
                  root: noteParam(root),
                  ...(exercise.fields.kind?.includes(kind) ? { kind } : {}),
                }}
              />
            }
          />
        </li>
      ))}
    </RowGroup>
  )
}
