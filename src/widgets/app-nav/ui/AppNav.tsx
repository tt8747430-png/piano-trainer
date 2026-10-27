import { Link, useNavigate, useRouterState } from '@tanstack/react-router'
import {
  GraduationCap,
  Metronome,
  Music,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Settings,
  type LucideIcon,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { selectSidebar, useSettings, useSettingsStoreApi } from '@/entities/settings'
import { setSidebar } from '@/features/set-preference'
import { OPEN_PLAINLY } from '@/shared/lib'
import { keyHint, useShortcutsPlatform, useShortcuts, type Combo } from '@/shared/lib/shortcuts'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui/primitives/tooltip'

interface Place {
  readonly to: '/' | '/songs' | '/practice' | '/search' | '/settings'
  readonly label: 'nav.learn' | 'nav.songs' | 'nav.practice' | 'nav.search' | 'nav.settings'
  readonly icon: LucideIcon
  readonly exact: boolean
  /** Where else the place is the current one: Learn's lessons and courses (ADR 0053). */
  readonly also?: readonly ('/lessons' | '/courses')[]
  /** The place's shortcut: Alt and its number. */
  readonly key?: Combo
}

/** The three places (ADR 0053), each opened as it was left. The bar is monochrome: the screens above it carry the colour. */
const PLACES: readonly Place[] = [
  {
    to: '/',
    label: 'nav.learn',
    icon: GraduationCap,
    exact: true,
    also: ['/lessons', '/courses'],
    key: { code: 'Digit1', alt: true },
  },
  {
    to: '/songs',
    label: 'nav.songs',
    icon: Music,
    exact: false,
    key: { code: 'Digit2', alt: true },
  },
  {
    to: '/practice',
    label: 'nav.practice',
    icon: Metronome,
    exact: false,
    key: { code: 'Digit3', alt: true },
  },
]
/** The sidebar, open or collapsed: the platform's modifier and B. */
const SIDEBAR_KEY: Combo = { code: 'KeyB', mod: true }
/**
 * What sits at the sidebar's foot on a laptop, and in Learn's bar on a phone: Search, on the
 * platform's modifier and K from anywhere, and Settings.
 */
const FOOT: readonly Place[] = [
  {
    to: '/search',
    label: 'nav.search',
    icon: Search,
    exact: false,
    key: { code: 'KeyK', mod: true },
  },
  { to: '/settings', label: 'nav.settings', icon: Settings, exact: false },
]

const PLACE_LINK =
  'flex h-14 flex-col items-center justify-center gap-0.5 rounded-xl border border-transparent text-sm font-medium text-muted-foreground transition-colors duration-200 ease-out hover:bg-muted/60 hover:text-foreground focus-visible:-outline-offset-3 data-[status=active]:border-border data-[status=active]:bg-muted data-[status=active]:font-semibold data-[status=active]:text-foreground lg:h-11 lg:flex-row lg:justify-start lg:gap-3 lg:px-3 lg:text-base lg:group-data-[sidebar=collapsed]/nav:justify-center lg:group-data-[sidebar=collapsed]/nav:px-0'

/**
 * A place in the navigation: its icon over its name in the phone's bar, beside it in the sidebar,
 * alone (its name in a tooltip, and still its link's name) while the sidebar is collapsed.
 */
function PlaceLink({
  place: { to, label, icon: Icon, exact, also },
  collapsed,
}: {
  place: Place
  collapsed: boolean
}) {
  const { t } = useTranslation('common')
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  // The place is current under its other prefix too, as the router marks its own address.
  const current = also?.some((prefix) => pathname.startsWith(`${prefix}/`))
    ? ({ 'data-status': 'active', 'aria-current': 'page' } as const)
    : {}
  const content = (
    <>
      <Icon aria-hidden className="size-6 shrink-0 lg:size-5" />
      <span className="lg:group-data-[sidebar=collapsed]/nav:sr-only">{t(label)}</span>
    </>
  )
  if (!collapsed)
    return (
      <Link
        to={to}
        activeOptions={{ exact }}
        {...current}
        state={OPEN_PLAINLY}
        className={PLACE_LINK}
      >
        {content}
      </Link>
    )
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Link
            to={to}
            activeOptions={{ exact }}
            {...current}
            state={OPEN_PLAINLY}
            className={PLACE_LINK}
          />
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
 * to its icons and remembers it, with Search and Settings at its foot. From the computer's keys, Alt
 * and a place's number goes there, the platform's modifier with K opens Search, and with B collapses
 * or opens the sidebar.
 */
export function AppNav() {
  const { t } = useTranslation('common')
  const store = useSettingsStoreApi()
  const sidebar = useSettings(selectSidebar)
  const collapsed = sidebar === 'collapsed'
  const ToggleIcon = collapsed ? PanelLeftOpen : PanelLeftClose
  const navigate = useNavigate()
  const mac = useShortcutsPlatform()
  const toggle = () => setSidebar(store, collapsed ? 'open' : 'collapsed')
  const toggleLabel = t(collapsed ? 'nav.open' : 'nav.collapse')
  useShortcuts(
    t('shortcuts.app'),
    [
      ...[...PLACES, ...FOOT].flatMap(({ to, label, key }) =>
        key
          ? [{ label: t(label), combo: key, run: () => void navigate({ to, state: OPEN_PLAINLY }) }]
          : [],
      ),
      { label: t('shortcuts.sidebar'), combo: SIDEBAR_KEY, run: toggle },
    ],
    { scope: 'app' },
  )
  return (
    <nav
      aria-label={t('nav.label')}
      data-slot="app-nav"
      data-sidebar={sidebar}
      className="group/nav fixed inset-x-0 bottom-0 z-30 print:hidden border-t border-border bg-card pb-safe landscape-phone:inset-y-0 landscape-phone:right-auto landscape-phone:flex landscape-phone:w-rail landscape-phone:flex-col landscape-phone:justify-center landscape-phone:border-t-0 landscape-phone:border-r landscape-phone:pb-0 landscape-phone:pl-safe-left lg:inset-y-0 lg:right-auto lg:flex lg:w-64 lg:flex-col lg:border-t-0 lg:border-r lg:pb-0 lg:data-[sidebar=collapsed]:w-18"
    >
      <div className="hidden h-20 shrink-0 items-center gap-2 px-3 lg:flex lg:group-data-[sidebar=collapsed]/nav:justify-center">
        <p
          aria-hidden
          className="min-w-0 flex-1 pl-3 font-display text-2xl leading-tight font-semibold text-balance group-data-[sidebar=collapsed]/nav:hidden"
        >
          {t('appName')}
        </p>
        <button
          type="button"
          aria-label={toggleLabel}
          title={keyHint(toggleLabel, SIDEBAR_KEY, mac)}
          aria-expanded={!collapsed}
          onClick={toggle}
          className="grid size-11 shrink-0 place-items-center rounded-xl text-muted-foreground transition-colors duration-200 ease-out hover:bg-muted hover:text-foreground"
        >
          <ToggleIcon aria-hidden className="size-5" />
        </button>
      </div>
      <ul className="mx-auto flex max-w-md gap-1 px-2 pt-1.5 landscape-phone:mx-0 landscape-phone:w-full landscape-phone:flex-col landscape-phone:px-1 landscape-phone:pt-0 lg:mx-0 lg:max-w-none lg:flex-1 lg:flex-col lg:px-3 lg:pt-0">
        {PLACES.map((place) => (
          <li key={place.to} className="flex-1 landscape-phone:flex-none lg:flex-none">
            <PlaceLink place={place} collapsed={collapsed} />
          </li>
        ))}
        <li className="hidden lg:mt-auto lg:block lg:pb-4">
          <ul className="flex flex-col gap-1">
            {FOOT.map((place) => (
              <li key={place.to}>
                <PlaceLink place={place} collapsed={collapsed} />
              </li>
            ))}
          </ul>
        </li>
      </ul>
    </nav>
  )
}
