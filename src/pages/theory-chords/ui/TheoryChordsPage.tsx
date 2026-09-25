import { useTranslation } from 'react-i18next'

export function TheoryChordsPage() {
  const { t } = useTranslation('theory')
  return <h2 className="text-lg font-semibold">{t('tabs.chords')}</h2>
}
