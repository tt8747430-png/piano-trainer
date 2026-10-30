import { useTranslation } from 'react-i18next'
import type { Locale } from '@/shared/i18n'
import { Segmented } from '@/shared/ui'

/**
 * The language a document is written in (round 21), in the editor's bar beside where its draft
 * stands: English or Русский, each named in itself. The document opens anew on the other.
 */
export function LanguageChoice({
  value,
  onChange,
}: {
  value: Locale
  onChange: (locale: Locale) => void
}) {
  const { t } = useTranslation('learn')
  return (
    <div className="w-28 shrink-0">
      <Segmented
        label={t('edit.doc.language')}
        value={value}
        options={[
          { value: 'en' as const, label: 'EN', title: 'English' },
          { value: 'ru' as const, label: 'RU', title: 'Русский' },
        ]}
        onChange={onChange}
      />
    </div>
  )
}
