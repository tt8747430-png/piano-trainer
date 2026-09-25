import { useTranslation } from 'react-i18next'
import { ScreenHeader } from '@/shared/ui'

export function SongsPage() {
  const { t } = useTranslation('songs')
  return <ScreenHeader title={t('title')} />
}
