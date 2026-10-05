import { useTranslation } from 'react-i18next'
import { BackButton, ScreenHeader } from '@/shared/ui'
import { GapsLink, TrainerList } from '@/widgets/trainer-list'
import { QUIZ_GROUPS, QUIZ_TRAINERS } from '../model/quiz-groups'

/**
 * Quiz: every trainer, grouped by what it asks, each row opening its trainer as it was left. My gaps,
 * which checks across them, is in the bar.
 */
export function QuizPage() {
  const { t } = useTranslation('practice')
  return (
    <div className="flex flex-col gap-2">
      <ScreenHeader
        title={t('subjects.quiz')}
        back={<BackButton fallback={{ to: '/practice' }} />}
        actions={<GapsLink />}
      />
      <div className="flex flex-col gap-8">
        {QUIZ_GROUPS.map((group) => (
          <TrainerList
            key={group}
            title={t(`quizGroups.${group}`)}
            trainers={QUIZ_TRAINERS[group]}
          />
        ))}
      </div>
    </div>
  )
}
