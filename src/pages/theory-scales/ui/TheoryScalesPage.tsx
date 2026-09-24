import { useTranslation } from 'react-i18next'
import { SectionTitle } from '@/shared/ui'

export function TheoryScalesPage() {
  const { t } = useTranslation('theory')
  return <SectionTitle>{t('tabs.scales')}</SectionTitle>
}
