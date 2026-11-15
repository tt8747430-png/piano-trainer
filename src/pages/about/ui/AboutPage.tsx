import { Link } from '@tanstack/react-router'
import { ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { APP_BUILD, APP_VERSION } from '@/shared/config'
import { SettingsGroup } from '@/shared/ui'
import { SettingsScreen, UpdateRows } from '@/widgets/settings-screen'

/** What the app is made with, each under its own licence (R29 B9): who made it and where it is from. */
const CREDITS = [
  { name: 'Verovio', what: 'scores', licence: 'LGPL-3.0' },
  { name: 'three.js', what: 'threeD', by: 'three.js authors', licence: 'MIT' },
  { name: 'WebXR generic hand', what: 'hands', by: 'Amazon.com', licence: 'MIT' },
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

/** A Legal row (the board's link row): its name and a chevron, opening the page. */
function GroupLink({ title, to }: { title: string; to: '/legal/privacy' | '/legal/terms' }) {
  return (
    <Link
      to={to}
      className="flex min-h-13 items-center gap-3 px-4 py-2 transition-colors hover:bg-foreground/[0.04]"
    >
      <span className="flex-1">{title}</span>
      <ChevronRight aria-hidden className="size-5 text-muted-foreground" />
    </Link>
  )
}

/**
 * Settings › Support › About (R29 B9, R32; iOS's About, memory-palaces'): a Settings page like the
 * rest (the sidebar beside it on a laptop, Back on a phone). The app's tile, its version and build beside it;
 * Software update (where it stands, Check for updates) and the licence; Legal, the Privacy Policy and
 * the Terms of Service as full rows; then the acknowledgements for everything it is made with.
 */
export function AboutPage() {
  const { t } = useTranslation('settings')
  return (
    <SettingsScreen title={t('aboutPage.title')}>
      {/* The board's: the app's tile, its name and version beside it, on the page's left edge. */}
      <div className="flex items-center gap-4">
        <img
          src="/pwa-192x192.png"
          alt=""
          width={56}
          height={56}
          className="size-14 shrink-0 rounded-[14px]"
        />
        <div className="flex min-w-0 flex-col gap-0.5">
          <p className="text-xl font-bold">Piano Trainer</p>
          <p className="text-[0.9375rem] text-muted-foreground tabular-nums">
            {t('aboutPage.version', { version: APP_VERSION, build: APP_BUILD })}
          </p>
        </div>
      </div>
      <SettingsGroup flush title={t('about.update.label')}>
        <UpdateRows />
      </SettingsGroup>
      <SettingsGroup flush>
        <dl className="flex min-h-13 items-center justify-between gap-4 px-4 py-2">
          <dt>{t('aboutPage.licence')}</dt>
          <dd className="text-end text-muted-foreground">{t('aboutPage.allRights')}</dd>
        </dl>
      </SettingsGroup>
      <SettingsGroup flush title={t('aboutPage.legal')}>
        <GroupLink title={t('help.privacy')} to="/legal/privacy" />
        <GroupLink title={t('help.terms')} to="/legal/terms" />
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
    </SettingsScreen>
  )
}
