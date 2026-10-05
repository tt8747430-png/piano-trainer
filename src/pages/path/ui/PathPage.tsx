import { Link } from '@tanstack/react-router'
import { Settings } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { RoundLink, ScreenHeader } from '@/shared/ui'
import { ContinueCard } from '@/widgets/continue-card'
import { PathLevels } from '@/widgets/path-levels'

export function PathPage() {
  const { t } = useTranslation(['path', 'common'])
  return (
    <div className="flex flex-col">
      {/* The screen's bar spans the page, so it sticks while the levels scroll under it. */}
      <ScreenHeader
        title={t('path:title')}
        actions={
          // A laptop's sidebar has Settings at its foot.
          <div className="lg:hidden">
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
        <PathLevels />
      </div>
    </div>
  )
}
