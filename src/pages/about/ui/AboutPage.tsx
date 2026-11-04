import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { APP_BUILD, APP_VERSION } from '@/shared/config/build'
import { BackButton, ScreenHeader, SettingsGroup } from '@/shared/ui'

/** What the app is made with, each under its own licence (R29 B9): who made it and where it is from. */
const CREDITS = [
  { name: 'Verovio', what: 'scores', licence: 'LGPL-3.0' },
  {
    name: 'Salamander Grand Piano',
    what: 'piano',
    by: 'Alexander Holm',
    licence: 'CC BY 3.0',
  },
  { name: 'Splendid Grand Piano', what: 'lightPiano', by: 'AKAI', licence: 'publicDomain' },
  {
    name: 'Virtuosity Drums',
    what: 'drums',
    by: 'Versilian Studios, Karoryfer Samples',
    licence: 'CC0',
  },
  { name: 'Growlybass', what: 'bassElectric', by: 'Karoryfer Samples', licence: 'CC0' },
  { name: 'Meatbass', what: 'bassUpright', by: 'Karoryfer Samples', licence: 'CC0' },
  { name: 'Noto Sans, Noto Serif, Noto Music', what: 'fonts', licence: 'OFL-1.1' },
  { name: '«Боже, спасибо»', what: 'lessons', by: 'Надежда Боброва' },
  { name: 'Called to Play for Him', what: 'studies', by: 'A. Savchenko' },
] as const

/**
 * About (R29 B9, Help's last page): the app's version and build, its licence, and the credits for
 * everything it is made with, then its Terms and Privacy.
 */
export function AboutPage() {
  const { t } = useTranslation('settings')
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 pb-8">
      <ScreenHeader title={t('aboutPage.title')} back={<BackButton />} />
      <SettingsGroup flush>
        <dl className="flex flex-col divide-y divide-hairline">
          {[
            [t('about.version'), APP_VERSION],
            [t('aboutPage.build'), APP_BUILD],
            [t('aboutPage.licence'), t('aboutPage.allRights')],
          ].map(([term, value]) => (
            <div key={term} className="flex items-center justify-between gap-4 px-4 py-3">
              <dt>{term}</dt>
              <dd className="text-muted-foreground tabular-nums">{value}</dd>
            </div>
          ))}
        </dl>
      </SettingsGroup>
      <SettingsGroup flush title={t('aboutPage.credits')}>
        <ul className="flex flex-col divide-y divide-hairline">
          {CREDITS.map((credit) => (
            <li key={credit.name} className="flex flex-col gap-0.5 px-4 py-3">
              <span className="font-semibold">{credit.name}</span>
              <span className="text-sm text-muted-foreground">
                {[
                  t(`aboutPage.for.${credit.what}`),
                  'by' in credit ? credit.by : null,
                  'licence' in credit
                    ? credit.licence === 'publicDomain'
                      ? t('aboutPage.publicDomain')
                      : credit.licence
                    : null,
                ]
                  .filter(Boolean)
                  .join(' · ')}
              </span>
            </li>
          ))}
        </ul>
      </SettingsGroup>
      <nav className="flex gap-4 px-1">
        <Link to="/legal/terms" className="text-link underline-offset-2 hover:underline">
          {t('help.terms')}
        </Link>
        <Link to="/legal/privacy" className="text-link underline-offset-2 hover:underline">
          {t('help.privacy')}
        </Link>
      </nav>
    </div>
  )
}
