import { Link } from '@tanstack/react-router'
import { Settings } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { RoundLink, ScreenHeader } from '@/shared/ui'

export function PathPage() {
  const { t } = useTranslation('path')
  const { t: tCommon } = useTranslation('common')
  return (
    <ScreenHeader
      title={t('title')}
      actions={
        <RoundLink
          label={tCommon('nav.settings')}
          icon={Settings}
          render={<Link to="/settings" />}
        />
      }
    />
  )
}
