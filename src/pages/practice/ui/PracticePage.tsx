import { useTranslation } from 'react-i18next'
import { PROGRESSIONS, STUDIES } from '@/entities/piece'
import { localText, useLocale } from '@/shared/i18n'
import { ScreenHeader } from '@/shared/ui'
import { ExerciseList } from '@/widgets/exercise-list'
import { PieceList } from '@/widgets/piece-list'
import { TrainerList } from '@/widgets/trainer-list'

/** Practice: the trainers and the exercises by group, then the studies and progressions, each opening its page here. */
export function PracticePage() {
  const { t } = useTranslation('practice')
  const locale = useLocale()
  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader title={t('title')} />
      <div className="flex flex-col gap-8 lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-10">
        <div className="flex flex-col gap-8">
          <TrainerList />
          <ExerciseList />
        </div>
        <PieceList
          groups={[STUDIES, PROGRESSIONS].map((collection) => ({
            id: collection.id,
            heading: localText(collection.name, locale),
            entries: collection.entries,
          }))}
        />
      </div>
    </div>
  )
}
