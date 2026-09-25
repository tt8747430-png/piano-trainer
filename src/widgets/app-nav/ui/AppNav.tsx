import { Link } from '@tanstack/react-router'
import { BookOpen, Music, Route } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const ITEMS = [
  { to: '/', label: 'nav.path', icon: Route, exact: true },
  { to: '/songs', label: 'nav.songs', icon: Music, exact: false },
  { to: '/theory', label: 'nav.theory', icon: BookOpen, exact: false },
] as const

/** A floating glass pill on phones; a left rail from 1024px. */
export function AppNav() {
  const { t } = useTranslation('common')
  return (
    <nav
      aria-label={t('nav.label')}
      className="fixed inset-x-0 bottom-safe z-30 flex justify-center px-4 lg:inset-y-0 lg:right-auto lg:left-0 lg:block lg:w-24 lg:px-0"
    >
      <ul className="flex gap-1 rounded-full bg-card/72 p-1.5 shadow-lg ring-1 ring-border backdrop-blur-xl lg:h-full lg:flex-col lg:gap-2 lg:rounded-none lg:bg-card lg:px-2 lg:pt-6 lg:shadow-none lg:ring-0 lg:backdrop-blur-none">
        {ITEMS.map(({ to, label, icon: Icon, exact }) => (
          <li key={to}>
            <Link
              to={to}
              activeOptions={{ exact }}
              className="flex h-14 w-24 flex-col items-center justify-center gap-0.5 rounded-full text-xs font-semibold text-foreground transition-colors duration-200 ease-out hover:text-primary data-[status=active]:bg-primary/12 data-[status=active]:text-primary lg:w-20 lg:rounded-2xl"
            >
              <Icon aria-hidden className="size-5" />
              {t(label)}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
