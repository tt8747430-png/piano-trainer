import { useTranslation } from 'react-i18next'

export function TheorySymbolsPage() {
  const { t } = useTranslation('theory')
  return <h2 className="text-lg font-semibold">{t('tabs.symbols')}</h2>
}
