import { Link, useSearch } from '@tanstack/react-router'
import { Search, Settings } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useViewChange } from '@/shared/lib'
import { RoundLink, ScreenHeader } from '@/shared/ui'
import { ContinueCard } from '@/widgets/continue-card'
import { NextLesson } from '@/widgets/next-lesson'
import { PathLevels, type PathView } from '@/widgets/path-levels'
import { RecentPieces } from '@/widgets/piece-list'
import { PracticeDays } from '@/widgets/practice-days'

export function PathPage() {
  const { t } = useTranslation(['path', 'common'])
  const view = useSearch({ from: '/shell/' })
  const set = useViewChange<PathView>()
  return (
    <div className="flex flex-col">
      {/* The screen's bar spans the page, so it sticks while the levels scroll under it. */}
      <ScreenHeader
        title={t('path:title')}
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
      <div className="mt-2 flex flex-col gap-6">
        <ContinueCard />
        <NextLesson />
        <PracticeDays />
        <RecentPieces />
        <PathLevels view={view} onChange={set} />
      </div>
    </div>
  )
}
