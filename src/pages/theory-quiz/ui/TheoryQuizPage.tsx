import { useTranslation } from 'react-i18next'

export function TheoryQuizPage() {
  const { t } = useTranslation('quiz')
  return <h2 className="text-lg font-semibold">{t('title')}</h2>
}
