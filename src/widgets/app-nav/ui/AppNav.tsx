import { Link } from '@tanstack/react-router'
import { BookOpen, Music, Route } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const ITEMS = [
  { to: '/', label: 'nav.path', icon: Route, exact: true },
  { to: '/songs', label: 'nav.songs', icon: Music, exact: false },
  { to: '/theory', label: 'nav.theory', icon: BookOpen, exact: false },
] as const

/** Bottom bar on phones, a left rail from 1024px. */
export function AppNav() {
  const { t } = useTranslation('common')
  return (
    <nav
      aria-label={t('nav.label')}
      className="fixed inset-x-0 bottom-0 z-10 border-t border-border bg-card pb-[env(safe-area-inset-bottom)] lg:top-0 lg:right-auto lg:w-24 lg:border-t-0 lg:border-r lg:pt-4"
    >
      <ul className="flex lg:flex-col lg:gap-2">
        {ITEMS.map(({ to, label, icon: Icon, exact }) => (
          <li key={to} className="flex-1 lg:flex-none">
            <Link
              to={to}
              activeOptions={{ exact }}
              className="flex min-h-14 flex-col items-center justify-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground data-[status=active]:text-primary"
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
