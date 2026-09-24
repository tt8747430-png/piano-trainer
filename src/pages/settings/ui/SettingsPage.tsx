import { useTranslation } from 'react-i18next'
import { ScreenTitle } from '@/shared/ui'

export function SettingsPage() {
  const { t } = useTranslation('settings')
  return <ScreenTitle>{t('title')}</ScreenTitle>
}
