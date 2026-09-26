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
    <nav aria-label={t('tabs.label')} className="mb-5">
      <ul className="flex gap-1 rounded-2xl border-2 border-border bg-card p-1 lg:max-w-xl">
        {TABS.map(({ to, label }) => (
          <li key={to} className="flex-1">
            <Link
              to={to}
              className="flex h-11 items-center justify-center rounded-lg px-2 font-display text-lg text-muted-foreground transition-colors duration-200 ease-out outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring data-[status=active]:bg-selected data-[status=active]:text-selected-foreground"
            >
              {t(label)}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
