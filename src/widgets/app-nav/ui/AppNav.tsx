import { Link } from '@tanstack/react-router'
import {
  BookOpen,
  Metronome,
  Music,
  PanelLeftClose,
  PanelLeftOpen,
  Route,
  Settings,
  type LucideIcon,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { selectSidebar, useSettings, useSettingsStoreApi } from '@/entities/settings'
import { setSidebar } from '@/features/set-preference'
import { OPEN_PLAINLY } from '@/shared/lib'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui/primitives/tooltip'

interface Place {
  readonly to: '/' | '/songs' | '/learn' | '/practice' | '/settings'
  readonly label: 'nav.path' | 'nav.songs' | 'nav.learn' | 'nav.practice' | 'nav.settings'
  readonly icon: LucideIcon
  readonly exact: boolean
}

/** The four places, each opened as it was left. The bar is monochrome: the screens above it carry the colour. */
const PLACES: readonly Place[] = [
  { to: '/', label: 'nav.path', icon: Route, exact: true },
  { to: '/songs', label: 'nav.songs', icon: Music, exact: false },
  { to: '/learn', label: 'nav.learn', icon: BookOpen, exact: false },
  { to: '/practice', label: 'nav.practice', icon: Metronome, exact: false },
]
/** Settings: at the sidebar's foot on a laptop, behind the Path's gear on a phone. */
const SETTINGS: Place = { to: '/settings', label: 'nav.settings', icon: Settings, exact: false }

const PLACE_LINK =
  'flex h-14 flex-col items-center justify-center gap-0.5 rounded-xl border border-transparent text-sm font-medium text-muted-foreground transition-colors duration-200 ease-out hover:bg-muted/60 hover:text-foreground focus-visible:-outline-offset-3 data-[status=active]:border-border data-[status=active]:bg-muted data-[status=active]:font-semibold data-[status=active]:text-foreground lg:h-11 lg:flex-row lg:justify-start lg:gap-3 lg:px-3 lg:text-base lg:group-data-[sidebar=collapsed]/nav:justify-center lg:group-data-[sidebar=collapsed]/nav:px-0'

/**
 * A place in the navigation: its icon over its name in the phone's bar, beside it in the sidebar,
 * alone (its name in a tooltip, and still its link's name) while the sidebar is collapsed.
 */
function PlaceLink({
  place: { to, label, icon: Icon, exact },
  collapsed,
}: {
  place: Place
  collapsed: boolean
}) {
  const { t } = useTranslation('common')
  const content = (
    <>
      <Icon aria-hidden className="size-6 shrink-0 lg:size-5" />
      <span className="lg:group-data-[sidebar=collapsed]/nav:sr-only">{t(label)}</span>
    </>
  )
  if (!collapsed)
    return (
      <Link to={to} activeOptions={{ exact }} state={OPEN_PLAINLY} className={PLACE_LINK}>
        {content}
      </Link>
    )
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Link to={to} activeOptions={{ exact }} state={OPEN_PLAINLY} className={PLACE_LINK} />
        }
      >
        {content}
      </TooltipTrigger>
      <TooltipContent side="right" className="max-lg:hidden">
        {t(label)}
      </TooltipContent>
    </Tooltip>
  )
}

/**
 * The main navigation: a bar docked along the bottom on phones; from 1024px a sidebar that collapses
 * to its icons and remembers it, with Settings at its foot.
 */
export function AppNav() {
  const { t } = useTranslation('common')
  const store = useSettingsStoreApi()
  const sidebar = useSettings(selectSidebar)
  const collapsed = sidebar === 'collapsed'
  const ToggleIcon = collapsed ? PanelLeftOpen : PanelLeftClose
  return (
    <nav
      aria-label={t('nav.label')}
      data-slot="app-nav"
      data-sidebar={sidebar}
      className="group/nav fixed inset-x-0 bottom-0 z-30 border-t border-border bg-card pb-safe lg:inset-y-0 lg:right-auto lg:flex lg:w-64 lg:flex-col lg:border-t-0 lg:border-r lg:pb-0 lg:data-[sidebar=collapsed]:w-18"
    >
      <div className="hidden h-20 shrink-0 items-center gap-2 px-3 lg:flex lg:group-data-[sidebar=collapsed]/nav:justify-center">
        <p
          aria-hidden
          className="min-w-0 flex-1 truncate pl-3 font-display text-2xl leading-none font-semibold group-data-[sidebar=collapsed]/nav:hidden"
        >
          {t('appName')}
        </p>
        <button
          type="button"
          aria-label={t(collapsed ? 'nav.open' : 'nav.collapse')}
          aria-expanded={!collapsed}
          onClick={() => setSidebar(store, collapsed ? 'open' : 'collapsed')}
          className="grid size-11 shrink-0 place-items-center rounded-xl text-muted-foreground transition-colors duration-200 ease-out hover:bg-muted hover:text-foreground"
        >
          <ToggleIcon aria-hidden className="size-5" />
        </button>
      </div>
      <ul className="mx-auto flex max-w-md gap-1 px-2 pt-1.5 lg:mx-0 lg:max-w-none lg:flex-1 lg:flex-col lg:px-3 lg:pt-0">
        {PLACES.map((place) => (
          <li key={place.to} className="flex-1 lg:flex-none">
            <PlaceLink place={place} collapsed={collapsed} />
          </li>
        ))}
        <li className="hidden lg:mt-auto lg:block lg:pb-4">
          <PlaceLink place={SETTINGS} collapsed={collapsed} />
        </li>
      </ul>
    </nav>
  )
}
