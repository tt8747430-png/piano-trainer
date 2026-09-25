import { useTranslation } from 'react-i18next'

export function TheoryScalesPage() {
  const { t } = useTranslation('theory')
  return <h2 className="text-lg font-semibold">{t('tabs.scales')}</h2>
}
