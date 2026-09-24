import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

const TABS = [
  { to: '/theory/chords', label: 'tabs.chords' },
  { to: '/theory/scales', label: 'tabs.scales' },
  { to: '/theory/symbols', label: 'tabs.symbols' },
  { to: '/theory/quiz', label: 'tabs.quiz' },
] as const

export function TheoryNav() {
  const { t } = useTranslation('theory')
  return (
    <nav aria-label={t('tabs.label')} className="mb-4">
      <ul className="flex gap-1 rounded-xl bg-muted p-1">
        {TABS.map(({ to, label }) => (
          <li key={to} className="flex-1">
            <Link
              to={to}
              className="flex min-h-11 items-center justify-center rounded-lg px-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground data-[status=active]:bg-card data-[status=active]:text-foreground data-[status=active]:shadow-sm"
            >
              {t(label)}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
