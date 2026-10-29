import { useTranslation } from 'react-i18next'
import { useLocale } from '@/shared/i18n'
import { BackButton, ScreenHeader } from '@/shared/ui'

/** When either page last changed. */
const UPDATED = new Date(Date.UTC(2026, 9, 29))

/** Each page's sections, in their order. */
const PRIVACY = ['device', 'account', 'sync', 'public', 'errors', 'where', 'delete'] as const
const TERMS = ['use', 'account', 'publish', 'content', 'changes'] as const

/**
 * The app's Privacy or Terms (ADR 0116), in one column: its title, when it last changed, then a heading
 * and a paragraph a section. Read signed in or not; Back leads to Settings › Help.
 */
export function LegalPage({ page }: { page: 'privacy' | 'terms' }) {
  const { t } = useTranslation('legal')
  const locale = useLocale()
  const date = new Intl.DateTimeFormat(locale, { dateStyle: 'long' }).format(UPDATED)
  const sections =
    page === 'privacy'
      ? PRIVACY.map((key) => ({
          key,
          heading: t(`privacy.sections.${key}.heading`),
          text: t(`privacy.sections.${key}.text`),
        }))
      : TERMS.map((key) => ({
          key,
          heading: t(`terms.sections.${key}.heading`),
          text: t(`terms.sections.${key}.text`),
        }))
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 pb-8">
      <ScreenHeader
        title={t(`${page}.title`)}
        back={<BackButton fallback={{ to: '/settings' }} />}
      />
      <p className="-mt-3 text-sm text-muted-foreground">{t('updated', { date })}</p>
      {sections.map(({ key, heading, text }) => (
        <section key={key} className="flex flex-col gap-1.5">
          <h2 className="font-display text-xl">{heading}</h2>
          <p className="text-pretty">{text}</p>
        </section>
      ))}
    </div>
  )
}

export const PrivacyPage = () => <LegalPage page="privacy" />
export const TermsPage = () => <LegalPage page="terms" />
