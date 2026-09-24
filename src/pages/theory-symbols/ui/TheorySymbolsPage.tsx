import { useTranslation } from 'react-i18next'
import { SectionTitle } from '@/shared/ui'

export function TheorySymbolsPage() {
  const { t } = useTranslation('theory')
  return <SectionTitle>{t('tabs.symbols')}</SectionTitle>
}
