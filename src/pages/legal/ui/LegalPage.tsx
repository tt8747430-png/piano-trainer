import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useLocale } from '@/shared/i18n'
import { BackButton, RowLink, ScreenHeader, SettingsGroup } from '@/shared/ui'
import { formatLocale } from '@/shared/lib'

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
 * The app's Privacy Policy or Terms of Service (ADR 0116), one document a page (owner, 2026-11-17:
 * "the tabs in the legal are also bad"; the Legal board): its name in the bar, when it last changed,
 * then a heading and a paragraph a section, and the other document as one link row at its end. On a
 * laptop the page's width is used as a printed policy's: the contents a band of links at the top,
 * the text in two columns of a readable measure, so no side column runs out. Read signed in or not;
 * Back returns to where it was opened (the sign-up form), else to About.
 */
export function LegalPage({ page }: { page: 'privacy' | 'terms' }) {
  const { t } = useTranslation('legal')
  const locale = useLocale()
  const date = new Intl.DateTimeFormat(formatLocale(locale), { dateStyle: 'long' }).format(UPDATED)
  const other = page === 'privacy' ? 'terms' : 'privacy'
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
    <div className="flex flex-col">
      <ScreenHeader column="until-laptop" title={t(`${page}.title`)} back={<BackButton />} />
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-5 px-1 pt-1 pb-12 lg:mx-0 lg:max-w-none lg:gap-6 lg:pt-4 lg:pb-14">
        <p className="text-sm text-muted-foreground">{t('updated', { date })}</p>
        <nav
          aria-label={t('contents')}
          className="flex flex-wrap items-center gap-x-2 gap-y-1 max-lg:hidden"
        >
          <span className="pe-1 text-[0.8125rem] font-semibold text-muted-foreground">
            {t('contents')}
          </span>
          {sections.map(({ key, heading }) => (
            <a
              key={key}
              href={`#legal-${key}`}
              className="flex min-h-10 items-center rounded-pill bg-muted px-3 text-sm font-medium transition-colors duration-200 ease-out hover:bg-foreground/[0.08]"
            >
              {heading}
            </a>
          ))}
        </nav>
        <div className="flex flex-col gap-5 lg:block lg:columns-2 lg:gap-16">
          {sections.map(({ key, heading, text }) => (
            <section
              key={key}
              id={`legal-${key}`}
              className="flex scroll-mt-4 flex-col gap-2 lg:mb-6 lg:break-inside-avoid"
            >
              <h2 className="font-sans text-xl font-bold">{heading}</h2>
              <p className="max-w-[65ch] text-pretty leading-[1.55]">{text}</p>
            </section>
          ))}
        </div>
        <div className="lg:w-105">
          <SettingsGroup flush>
            <RowLink title={t(`tab.${other}`)} render={<Link to={`/legal/${other}`} replace />} />
          </SettingsGroup>
        </div>
      </div>
    </div>
  )
}

export const PrivacyPage = () => <LegalPage page="privacy" />
export const TermsPage = () => <LegalPage page="terms" />
