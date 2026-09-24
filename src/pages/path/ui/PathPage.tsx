import { Link } from '@tanstack/react-router'
import { Settings } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { ScreenTitle } from '@/shared/ui'

export function PathPage() {
  const { t } = useTranslation('path')
  const { t: tCommon } = useTranslation('common')
  return (
    <div className="flex items-start justify-between gap-2">
      <ScreenTitle>{t('title')}</ScreenTitle>
      <Link
        to="/settings"
        aria-label={tCommon('nav.settings')}
        className="inline-flex size-11 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
      >
        <Settings aria-hidden className="size-5" />
      </Link>
    </div>
  )
}
