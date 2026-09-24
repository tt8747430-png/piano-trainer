import { useTranslation } from 'react-i18next'
import { SectionTitle } from '@/shared/ui'

export function TheoryQuizPage() {
  const { t } = useTranslation('quiz')
  return <SectionTitle>{t('title')}</SectionTitle>
}
