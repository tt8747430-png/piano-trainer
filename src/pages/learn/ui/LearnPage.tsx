import { Link } from '@tanstack/react-router'
import { Search, Settings } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { RoundLink, ScreenHeader } from '@/shared/ui'
import { ContinueCard } from '@/widgets/continue-card'
import { CurriculumMap } from '@/widgets/curriculum'
import { RecentPieces } from '@/widgets/piece-list'
import { PracticeDays } from '@/widgets/practice-days'

/**
 * Learn (ADR 0051), the app's first place: Continue, then the curriculum from beginner to
 * professional, stage by stage, course by course; the days practised and the songs played last.
 */
export function LearnPage() {
  const { t } = useTranslation(['learn', 'common'])
  return (
    <div className="flex flex-col">
      <ScreenHeader
        title={t('learn:title')}
        actions={
          // A laptop's sidebar has Search and Settings at its foot.
          <div className="flex gap-2 lg:hidden">
            <RoundLink
              label={t('common:nav.search')}
              icon={Search}
              render={<Link to="/search" />}
            />
            <RoundLink
              label={t('common:nav.settings')}
              icon={Settings}
              render={<Link to="/settings" />}
            />
          </div>
        }
      />
      {/* On a phone: Continue, the curriculum, then the days and the songs played last. On a
          laptop the curriculum runs down the left, Continue and the rest stand on the right. */}
      <div className="mt-2 grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:grid-rows-[auto_1fr] lg:gap-x-12">
        <div className="lg:col-start-2 lg:row-start-1">
          <ContinueCard />
        </div>
        <div className="flex max-w-3xl flex-col gap-4 lg:col-start-1 lg:row-span-2 lg:row-start-1">
          <h2 className="sr-only">{t('learn:curriculum')}</h2>
          <CurriculumMap />
        </div>
        <div className="flex flex-col gap-6 lg:col-start-2 lg:row-start-2">
          <PracticeDays />
          <RecentPieces />
        </div>
      </div>
    </div>
  )
}
