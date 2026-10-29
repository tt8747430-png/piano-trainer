import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import type { LocalText } from '@/shared/i18n'
import { Textarea } from '@/shared/ui/primitives/textarea'

/** A text's two languages, each a field under its name, side by side where there is room. */
export function TextFields({
  value,
  label,
  onChange,
}: {
  value: LocalText
  label: string
  onChange: (text: LocalText) => void
}) {
  const { t } = useTranslation('learn')
  const id = useId()
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="mb-2 text-sm font-medium">{label}</legend>
      <div className="grid gap-3 sm:grid-cols-2">
        {(['en', 'ru'] as const).map((locale) => {
          const empty = value[locale].trim() === ''
          return (
            <div key={locale} className="flex min-w-0 flex-col gap-1">
              <label htmlFor={`${id}-${locale}`} className="text-xs text-muted-foreground">
                {t(locale === 'en' ? 'edit.english' : 'edit.russian')}
              </label>
              <Textarea
                id={`${id}-${locale}`}
                lang={locale}
                value={value[locale]}
                aria-invalid={empty || undefined}
                aria-describedby={empty ? `${id}-${locale}-empty` : undefined}
                className="min-h-11"
                onChange={(event) => onChange({ ...value, [locale]: event.target.value })}
              />
              {empty ? (
                <p id={`${id}-${locale}-empty`} className="text-xs text-destructive">
                  {t('edit.empty')}
                </p>
              ) : null}
            </div>
          )
        })}
      </div>
    </fieldset>
  )
}
