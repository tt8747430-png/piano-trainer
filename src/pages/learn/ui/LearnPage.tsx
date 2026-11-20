import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { NewDial, ScreenHeader } from '@/shared/ui'
import { PlaceActions } from '@/widgets/app-nav'
import { ContinueAction } from '@/widgets/continue-action'
import {
  CourseCovers,
  LevelRows,
  NewOwnSheet,
  OwnItems,
  useNewOwnActions,
  type OwnKind,
} from '@/widgets/curriculum'

/**
 * Learn (ADR 0053; the Learn and LearnLaptop boards), the app's first place, in the examples' one
 * order: its title in the bar with Search; Continue (flowkey's Continue learning), the four Levels
 * (the path), the Courses on a shelf with See all, then Made by you. Sections stand 32 apart, each
 * head 12 over what it heads, on both sizes; a laptop lays each section across the page (the Levels
 * four cards, the Courses five, the learner's own three), never two columns that end apart. The
 * floating honey + at the bottom right makes a lesson or a course, the screen's one honey act.
 */
export function LearnPage() {
  const { t } = useTranslation('learn')
  const [making, setMaking] = useState<OwnKind | null>(null)
  const newActions = useNewOwnActions(setMaking)
  return (
    <div className="flex flex-col pb-8">
      <ScreenHeader title={t('title')} large tools={<PlaceActions />} />
      {/* Continue 8 under the head on a phone and 16 on a laptop, as the boards start a place's content. */}
      <div className="mt-2 flex min-w-0 flex-col gap-8 lg:mt-4">
        <ContinueAction />
        <LevelRows />
        <CourseCovers />
        <OwnItems />
      </div>
      <NewDial label={t('own.newOwn')} actions={newActions} />
      <NewOwnSheet kind={making} onClose={() => setMaking(null)} />
    </div>
  )
}
