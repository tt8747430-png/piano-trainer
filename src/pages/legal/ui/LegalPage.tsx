import { useTranslation } from 'react-i18next'
import { useLocale } from '@/shared/i18n'
import { SettingsScreen } from '@/widgets/settings-screen'

/** When either page last changed. */
const UPDATED = new Date(Date.UTC(2026, 10, 4))

/** Each page's sections, in their order. */
const PRIVACY = [
  'device',
  'account',
  'sync',
  'public',
  'errors',
  'where',
  'delete',
  'children',
  'contact',
] as const
const TERMS = ['use', 'account', 'publish', 'content', 'thirdParty', 'contact', 'changes'] as const

/**
 * The app's Privacy or Terms (ADR 0116), in one column: its title, when it last changed, then a heading
 * and a paragraph a section, a Settings page under About (R32: About marked beside it on a laptop).
 * Read signed in or not; Back returns to where it was opened (the sign-up form), else to About.
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
    <SettingsScreen title={t(`${page}.title`)} sub>
      <div className="flex flex-col gap-5">
        <p className="text-sm text-muted-foreground">{t('updated', { date })}</p>
        {sections.map(({ key, heading, text }) => (
          <section key={key} className="flex flex-col gap-1.5">
            <h2 className="font-display text-xl">{heading}</h2>
            <p className="text-pretty">{text}</p>
          </section>
        ))}
      </div>
    </SettingsScreen>
  )
}

export const PrivacyPage = () => <LegalPage page="privacy" />
export const TermsPage = () => <LegalPage page="terms" />
