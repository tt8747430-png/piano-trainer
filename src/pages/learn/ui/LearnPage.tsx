import { useTranslation } from 'react-i18next'
import { ScreenHeader } from '@/shared/ui'
import { PlaceActions } from '@/widgets/app-nav'
import { ContinueAction } from '@/widgets/continue-action'
import { CourseCovers, LevelRows, OwnItems } from '@/widgets/curriculum'

/**
 * Learn (ADR 0053, canvas 163), the app's first place: its title in the bar with Search, as every
 * place's; then Continue, the four Levels, each opening its page, the Courses' first covers with See
 * all, and Your lessons and courses. A laptop sets Continue across the page, the Levels beside the
 * learner's own under it, the Courses across under them (the LearnLaptop board's).
 */
export function LearnPage() {
  const { t } = useTranslation('learn')
  return (
    <div className="flex flex-col pb-8">
      <ScreenHeader title={t('title')} large tools={<PlaceActions />} />
      <div className="mt-1 grid min-w-0 gap-3.5 lg:grid-cols-2 lg:items-start lg:gap-x-8 lg:gap-y-[18px]">
        <div className="min-w-0 lg:col-span-2">
          <ContinueAction />
        </div>
        <div className="min-w-0">
          <LevelRows />
        </div>
        <div className="min-w-0 lg:col-span-2 lg:row-start-3">
          <CourseCovers />
        </div>
        <div className="min-w-0 lg:col-start-2 lg:row-start-2">
          <OwnItems />
        </div>
      </div>
    </div>
  )
}
