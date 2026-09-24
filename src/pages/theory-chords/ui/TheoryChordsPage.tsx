import { useTranslation } from 'react-i18next'
import { SectionTitle } from '@/shared/ui'

export function TheoryChordsPage() {
  const { t } = useTranslation('theory')
  return <SectionTitle>{t('tabs.chords')}</SectionTitle>
}
