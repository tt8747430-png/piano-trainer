import { useTranslation } from 'react-i18next'
import { ScreenHeader } from '@/shared/ui'
import { PlaceActions } from '@/widgets/app-nav'
import { ContinueAction } from '@/widgets/continue-action'
import { CourseCovers, LevelRows, OwnItems } from '@/widgets/curriculum'

/**
 * Learn (ADR 0053, canvas 163), the app's first place: its title in the bar with Search, as every
 * place's; then Continue, the four Levels, each opening its page, the Courses' first covers with See
 * all, and Your lessons and courses. A laptop sets Continue and the Levels beside the learner's own,
 * the Courses across under them.
 */
export function LearnPage() {
  const { t } = useTranslation('learn')
  return (
    <div className="flex flex-col pb-8">
      <ScreenHeader title={t('title')} large tools={<PlaceActions />} />
      <div className="mt-2 grid min-w-0 gap-8 lg:grid-cols-2 lg:items-start lg:gap-x-8">
        <div className="flex min-w-0 flex-col gap-6">
          <ContinueAction />
          <LevelRows />
        </div>
        <div className="min-w-0 lg:col-span-2 lg:row-start-2">
          <CourseCovers />
        </div>
        <div className="min-w-0 lg:col-start-2 lg:row-start-1">
          <OwnItems />
        </div>
      </div>
    </div>
  )
}
