import { Link } from '@tanstack/react-router'
import { Settings } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { RoundLink, ScreenHeader } from '@/shared/ui'
import { ContinueCard } from '@/widgets/continue-card'
import { PathLevels } from '@/widgets/path-levels'

export function PathPage() {
  const { t } = useTranslation(['path', 'common'])
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <ScreenHeader
          title={t('path:title')}
          actions={
            <RoundLink
              label={t('common:nav.settings')}
              icon={Settings}
              render={<Link to="/settings" />}
            />
          }
        />
        <ContinueCard />
      </div>
      <PathLevels />
    </div>
  )
}
