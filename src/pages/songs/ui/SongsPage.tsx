import { useTranslation } from 'react-i18next'
import { ScreenTitle } from '@/shared/ui'

export function SongsPage() {
  const { t } = useTranslation('songs')
  return <ScreenTitle>{t('title')}</ScreenTitle>
}
