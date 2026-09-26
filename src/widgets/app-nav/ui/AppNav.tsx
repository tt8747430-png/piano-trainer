import { Link } from '@tanstack/react-router'
import { BookOpen, Music, Route } from 'lucide-react'
import { useTranslation } from 'react-i18next'

/** Each place in its own paint, as the book colours every building. */
const ITEMS = [
  { to: '/', label: 'nav.path', icon: Route, exact: true, paint: 'text-paint-grass-deep' },
  { to: '/songs', label: 'nav.songs', icon: Music, exact: false, paint: 'text-paint-yellow-deep' },
  {
    to: '/theory',
    label: 'nav.theory',
    icon: BookOpen,
    exact: false,
    paint: 'text-paint-sky-deep',
  },
] as const

/** A bar docked along the bottom on phones; a lettered sidebar from 1024px. */
export function AppNav() {
  const { t } = useTranslation('common')
  return (
    <nav
      aria-label={t('nav.label')}
      className="fixed inset-x-0 bottom-0 z-30 border-t-2 border-border bg-card pb-safe lg:inset-y-0 lg:right-auto lg:w-60 lg:border-t-0 lg:border-r-2 lg:pb-0"
    >
      <p aria-hidden className="hidden px-6 pt-8 pb-6 font-display text-3xl leading-none lg:block">
        {t('appName')}
      </p>
      <ul className="mx-auto flex max-w-md gap-1 px-2 pt-1.5 lg:max-w-none lg:flex-col lg:gap-1 lg:px-3 lg:pt-0">
        {ITEMS.map(({ to, label, icon: Icon, exact, paint }) => (
          <li key={to} className="flex-1 lg:flex-none">
            <Link
              to={to}
              activeOptions={{ exact }}
              className="group flex h-14 flex-col items-center justify-center gap-0.5 rounded-xl font-display text-base text-foreground transition-colors duration-200 ease-out outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring data-[status=active]:bg-selected data-[status=active]:text-selected-foreground lg:h-12 lg:flex-row lg:justify-start lg:gap-3 lg:px-3 lg:text-xl"
            >
              <Icon
                aria-hidden
                className={`size-6 ${paint} group-data-[status=active]:text-selected-foreground`}
              />
              {t(label)}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
