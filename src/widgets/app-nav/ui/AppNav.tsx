import { Link, useNavigate, useRouterState } from '@tanstack/react-router'
import {
  GraduationCap,
  Metronome,
  Music,
  PanelLeftClose,
  PanelLeftOpen,
  UserRound,
} from 'lucide-react'
import type { ComponentType } from 'react'
import { useTranslation } from 'react-i18next'
import { selectSidebar, useSettings, useSettingsStoreApi } from '@/entities/settings'
import { setSidebar } from '@/features/set-preference'
import { OPEN_PLAINLY, useMediaQuery } from '@/shared/lib'
import { useAccount, useLearnerProfile } from '@/shared/lib/account'
import { keyHint, useShortcutsPlatform, useShortcuts, type Combo } from '@/shared/lib/shortcuts'
import { Avatar } from '@/shared/ui'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui/primitives/tooltip'
import { useSearchPalette } from '@/widgets/search-palette'
import { SidebarAccount } from './SidebarAccount'
import { SidebarRecents } from './SidebarRecents'
import { SidebarSearch } from './SidebarSearch'

interface Place {
  readonly to: '/' | '/songs' | '/practice' | '/profile' | '/settings'
  readonly label: 'nav.learn' | 'nav.songs' | 'nav.practice' | 'nav.profile' | 'nav.settings'
  readonly icon: ComponentType<{ className?: string; 'aria-hidden'?: boolean }>
  readonly exact: boolean
  /**
   * Where else the place is the current one: Learn's lessons and courses (ADR 0053); the Profile's
   * Settings and account pages, opened from it.
   */
  readonly also?: readonly ('/lessons' | '/courses' | '/settings' | '/account')[]
  /** Where it is current only while the sidebar is not shown: Settings, the sidebar's own place. */
  readonly alsoWithoutSidebar?: readonly '/settings'[]
  /** The place's shortcut: Alt and its number. */
  readonly key?: Combo
}

/**
 * The learner's picture as the Profile's tab: their initial signed in, the figure of a person for a
 * guest (memory-palaces', Noji's).
 */
function ProfileIcon({ className }: { className?: string }) {
  const { account } = useAccount()
  const { state } = useLearnerProfile()
  const picture = state.kind === 'ready' ? state.profile.avatar : null
  return account ? (
    <Avatar name={account.name || account.email} picture={picture} size="icon" />
  ) : (
    <UserRound aria-hidden className={className} />
  )
}

/** The learner's place: the phone's last tab, the sidebar's foot (under Search and Settings). */
const PROFILE: Place = {
  to: '/profile',
  label: 'nav.profile',
  icon: ProfileIcon,
  exact: false,
  also: ['/account'],
  alsoWithoutSidebar: ['/settings'],
  key: { code: 'Digit4', alt: true },
}

/**
 * The four places (ADR 0053), each opened as it was left: Learn, Songs, Practice and the Profile
 * (Settings opens from it). The bar is monochrome but for the learner's picture: the screens above
 * it carry the colour.
 */
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
  PROFILE,
]
/** The sidebar, open or collapsed: the platform's modifier and B. */
const SIDEBAR_KEY: Combo = { code: 'KeyB', mod: true }
/** Where the navigation is the sidebar (the `lg` breakpoint), with Settings at its foot. */
const SIDEBAR_SHOWN = '(min-width: 64rem)'
/**
 * Search, at the sidebar's foot on a laptop: the palette over the screen (rule 27), on the
 * platform's modifier and K from anywhere (a phone has it in a place's bar).
 */
const SEARCH_KEY: Combo = { code: 'KeyK', mod: true }
/** Settings, the gear beside the learner at the sidebar's foot, on the modifier and a comma. */
const SETTINGS_KEY: Combo = { code: 'Comma', mod: true }

const PLACE_LINK =
  'flex h-14 flex-col items-center justify-center gap-0.5 rounded-control text-sm font-semibold text-muted-foreground choice focus-visible:-outline-offset-3 lg:h-11 lg:flex-row lg:justify-start lg:gap-3 lg:px-3 lg:text-base lg:group-data-[sidebar=collapsed]/nav:justify-center lg:group-data-[sidebar=collapsed]/nav:px-0'

/**
 * A place in the navigation: its icon over its name in the phone's bar, beside it in the sidebar,
 * alone (its name in a tooltip, and still its link's name) while the sidebar is collapsed.
 */
function PlaceLink({
  place: { to, label, icon: Icon, exact, also = [], alsoWithoutSidebar = [] },
  collapsed,
}: {
  place: Place
  collapsed: boolean
}) {
  const { t } = useTranslation('common')
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  // The sidebar (a laptop's) has Settings of its own; a phone's bar has it in the Profile.
  const sidebar = useMediaQuery(SIDEBAR_SHOWN)
  // The place is current under its other prefix too, as the router marks its own address.
  const prefixes = sidebar ? also : [...also, ...alsoWithoutSidebar]
  const current = prefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  )
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
        activeOptions={{ exact, includeSearch: false }}
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
            activeOptions={{ exact, includeSearch: false }}
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
 * The main navigation: a bar docked along the bottom on phones (the four places, the Profile last);
 * from 1024px a sidebar as Claude's (R32): the name and its collapse toggle, Search as a field, the
 * places, Recents (the songs opened last), and the learner at its foot with Settings beside; it
 * collapses to a rail of icons and remembers it. From the computer's keys, Alt and a place's number
 * goes there, the modifier with K opens Search, with a comma Settings, with B collapses or opens it.
 */
export function AppNav() {
  const { t } = useTranslation('common')
  const store = useSettingsStoreApi()
  const sidebar = useSettings(selectSidebar)
  const collapsed = sidebar === 'collapsed'
  const ToggleIcon = collapsed ? PanelLeftOpen : PanelLeftClose
  const navigate = useNavigate()
  const palette = useSearchPalette()
  const mac = useShortcutsPlatform()
  const toggle = () => setSidebar(store, collapsed ? 'open' : 'collapsed')
  const toggleLabel = t(collapsed ? 'nav.open' : 'nav.collapse')
  useShortcuts(
    t('shortcuts.app'),
    [
      ...PLACES.flatMap(({ to, label, key }) =>
        key
          ? [{ label: t(label), combo: key, run: () => void navigate({ to, state: OPEN_PLAINLY }) }]
          : [],
      ),
      {
        label: t('nav.settings'),
        combo: SETTINGS_KEY,
        run: () => void navigate({ to: '/settings', state: OPEN_PLAINLY }),
      },
      { label: t('nav.search'), combo: SEARCH_KEY, run: () => palette.open() },
      { label: t('shortcuts.sidebar'), combo: SIDEBAR_KEY, run: toggle },
    ],
    { scope: 'app' },
  )
  // A phone's tab bar is the places' own (memory-palaces'): on what a place opens it steps away, Back
  // the way out, and the screen has the whole height.
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const away = !PLACES.some(({ to }) => to === pathname)
  // A laptop's sidebar puts the learner at its foot, under Search and Settings; a phone's bar keeps
  // the Profile as its last tab.
  const sidebarShown = useMediaQuery(SIDEBAR_SHOWN)
  return (
    <nav
      aria-label={t('nav.label')}
      data-slot="app-nav"
      data-sidebar={sidebar}
      data-away={away ? '' : undefined}
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
          className="grid size-11 shrink-0 place-items-center rounded-control text-muted-foreground transition-colors duration-200 ease-out hover:bg-muted hover:text-foreground"
        >
          <ToggleIcon aria-hidden className="size-5" />
        </button>
      </div>
      {sidebarShown ? (
        <div className="flex px-3 pb-3 group-data-[sidebar=collapsed]/nav:justify-center">
          <SidebarSearch collapsed={collapsed} combo={SEARCH_KEY} />
        </div>
      ) : null}
      <ul className="mx-auto flex max-w-md gap-1 px-2 pt-1.5 landscape-phone:mx-0 landscape-phone:w-full landscape-phone:flex-col landscape-phone:px-1 landscape-phone:pt-0 lg:mx-0 lg:max-w-none lg:flex-col lg:px-3 lg:pt-0">
        {(sidebarShown ? PLACES.filter((place) => place !== PROFILE) : PLACES).map((place) => (
          <li key={place.to} className="flex-1 landscape-phone:flex-none lg:flex-none">
            <PlaceLink place={place} collapsed={collapsed} />
          </li>
        ))}
      </ul>
      {sidebarShown ? (
        <div className="flex min-h-0 flex-1 flex-col justify-between gap-3 px-3 pb-4">
          {collapsed ? <span /> : <SidebarRecents />}
          <SidebarAccount collapsed={collapsed} />
        </div>
      ) : null}
    </nav>
  )
}
