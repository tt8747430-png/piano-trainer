import { useTranslation } from 'react-i18next'
import { SectionTitle } from '@/shared/ui'

export function TheoryQuizPage() {
  const { t } = useTranslation('theory')
  return <SectionTitle>{t('tabs.quiz')}</SectionTitle>
}
