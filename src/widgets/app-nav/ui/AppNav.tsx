import { Link } from '@tanstack/react-router'
import { BookOpen, Metronome, Music, Route } from 'lucide-react'
import { useTranslation } from 'react-i18next'

/** The three places. The bar is monochrome: the screens above it carry the colour. */
const ITEMS = [
  { to: '/', label: 'nav.path', icon: Route, exact: true },
  { to: '/songs', label: 'nav.songs', icon: Music, exact: false },
  { to: '/theory', label: 'nav.theory', icon: BookOpen, exact: false },
  { to: '/practice', label: 'nav.practice', icon: Metronome, exact: false },
] as const

/** A bar docked along the bottom on phones; a titled sidebar from 1024px. */
export function AppNav() {
  const { t } = useTranslation('common')
  return (
    <nav
      aria-label={t('nav.label')}
      className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-card pb-safe lg:inset-y-0 lg:right-auto lg:w-60 lg:border-t-0 lg:border-r lg:pb-0"
    >
      <p
        aria-hidden
        className="hidden px-6 pt-8 pb-6 font-display text-2xl leading-none font-semibold lg:block"
      >
        {t('appName')}
      </p>
      <ul className="mx-auto flex max-w-md gap-1 px-2 pt-1.5 lg:max-w-none lg:flex-col lg:gap-1 lg:px-3 lg:pt-0">
        {ITEMS.map(({ to, label, icon: Icon, exact }) => (
          <li key={to} className="flex-1 lg:flex-none">
            <Link
              to={to}
              activeOptions={{ exact }}
              className="flex h-14 flex-col items-center justify-center gap-0.5 rounded-xl text-sm font-medium text-muted-foreground transition-colors duration-200 ease-out outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring data-[status=active]:bg-muted data-[status=active]:font-semibold data-[status=active]:text-foreground lg:h-11 lg:flex-row lg:justify-start lg:gap-3 lg:px-3 lg:text-base"
            >
              <Icon aria-hidden className="size-6 lg:size-5" />
              {t(label)}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
