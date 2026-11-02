import { useTranslation } from 'react-i18next'
import { drillOf, type Trainer, type TrainerView } from '@/features/trainer'

/** How a trainer asks in its chosen drill, in a sentence: the setup's ⓘ in the screen's bar. */
export function useTrainerHow(trainer: Trainer, view: TrainerView): string {
  const { t } = useTranslation('quiz')
  const { id } = trainer
  return id === 'chords' || id === 'intervals' || id === 'cadences'
    ? t(`how.${id}.${drillOf(trainer, view) ?? 'flashcards'}`)
    : t(`how.${id}`)
}
