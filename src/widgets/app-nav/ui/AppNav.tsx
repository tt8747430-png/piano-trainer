import { Link, useNavigate, useRouterState } from '@tanstack/react-router'
import {
  GraduationCap,
  Maximize,
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
import { cn, OPEN_PLAINLY, setFocusMode, useFocusMode, useMediaQuery } from '@/shared/lib'
import { useAccount, useLearnerProfile } from '@/shared/lib/account'
import { keyHint, useShortcutsPlatform, useShortcuts, type Combo } from '@/shared/lib/shortcuts'
import { Avatar } from '@/shared/ui'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui/primitives/tooltip'
import { useSearchPalette } from '@/widgets/search-palette'
import { SongsPlaces, useSongsPlaceShown } from '@/widgets/song-library'
import { SidebarAccount } from './SidebarAccount'
import { SidebarRecents } from './SidebarRecents'
import { SidebarSearch } from './SidebarSearch'
import { LearnTabIcon, PracticeTabIcon, ProfileTabIcon, SongsTabIcon } from './tab-icons'

interface Place {
  readonly to: '/' | '/songs' | '/practice' | '/profile' | '/settings'
  readonly label: 'nav.learn' | 'nav.songs' | 'nav.practice' | 'nav.profile' | 'nav.settings'
  readonly icon: ComponentType<{ className?: string; 'aria-hidden'?: boolean }>
  /** Its icon in the phone's tab bar, filled (the canvas's tab bar). */
  readonly tab: ComponentType<{ className?: string }>
  readonly exact: boolean
  /**
   * Where else the place is the current one: Learn's lessons and courses (ADR 0053); the Profile's
   * Settings and account pages, opened from it.
   */
  readonly also?: readonly (
    '/lessons' | '/courses' | '/settings' | '/account' | '/admin' | '/legal'
  )[]
  /**
   * Where it is current only while the sidebar is not shown: Settings and its pages (Administration,
   * the legal pages), the sidebar's own place.
   */
  readonly alsoWithoutSidebar?: readonly ('/settings' | '/admin' | '/legal')[]
  /** The place's shortcut: Alt and its number. */
  readonly key?: Combo
}

/**
 * The learner's picture as the Profile's tab: their initial signed in, the figure of a person for a
 * guest (memory-palaces', Noji's).
 */
function ProfileIcon({ className }: { className?: string }) {
  return <LearnerPicture className={className} guest={UserRound} />
}

/** The Profile's tab on a phone: the learner's picture, or the filled figure for a guest. */
function ProfileTab({ className }: { className?: string }) {
  return <LearnerPicture className={className} guest={ProfileTabIcon} />
}

function LearnerPicture({
  className,
  guest: Guest,
}: {
  className?: string | undefined
  guest: ComponentType<{ className?: string; 'aria-hidden'?: boolean }>
}) {
  const { account } = useAccount()
  const { state } = useLearnerProfile()
  const picture = state.kind === 'ready' ? state.profile.avatar : null
  return account ? (
    <span className={cn('place-items-center', className)}>
      <Avatar name={account.name || account.email} picture={picture} size="icon" />
    </span>
  ) : (
    <Guest aria-hidden className={className} />
  )
}

/** The learner's place: the phone's last tab, the sidebar's foot (under Search and Settings). */
const PROFILE: Place = {
  to: '/profile',
  label: 'nav.profile',
  icon: ProfileIcon,
  tab: ProfileTab,
  exact: false,
  also: ['/account'],
  alsoWithoutSidebar: ['/settings', '/admin', '/legal'],
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
    tab: LearnTabIcon,
    exact: true,
    also: ['/lessons', '/courses'],
    key: { code: 'Digit1', alt: true },
  },
  {
    to: '/songs',
    label: 'nav.songs',
    icon: Music,
    tab: SongsTabIcon,
    exact: false,
    key: { code: 'Digit2', alt: true },
  },
  {
    to: '/practice',
    label: 'nav.practice',
    icon: Metronome,
    tab: PracticeTabIcon,
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
  'flex h-13 flex-col items-center justify-center gap-[3px] rounded-[1.625rem] text-xs font-medium text-muted-foreground choice aria-[current=page]:font-bold landscape-phone:h-11 landscape-phone:flex-row landscape-phone:gap-1.5 landscape-phone:rounded-pill lg:rounded-menu-item lg:font-medium lg:text-nav-foreground lg:aria-[current=page]:font-semibold lg:aria-[current=page]:text-nav-current-foreground focus-visible:-outline-offset-3 lg:h-11 lg:flex-row lg:justify-start lg:gap-3 lg:px-3 lg:text-base lg:group-data-[sidebar=collapsed]/nav:justify-center lg:group-data-[sidebar=collapsed]/nav:px-0'

/**
 * A place in the navigation: its icon over its name in the phone's bar, beside it in the sidebar,
 * alone (its name in a tooltip, and still its link's name) while the sidebar is collapsed.
 */
function PlaceLink({
  place: { to, label, icon: Icon, tab: Tab, exact, also = [], alsoWithoutSidebar = [] },
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
      <Tab className="grid size-[25px] shrink-0 lg:hidden" />
      <Icon aria-hidden className="hidden size-5 shrink-0 lg:grid" />
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
  const chosen = useSettings(selectSidebar)
  const focus = useFocusMode()
  // Focus hides the sidebar; the learner's own open or collapsed comes back when it ends.
  const sidebar = focus ? 'focus' : chosen
  const collapsed = chosen === 'collapsed'
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
      // Esc leaves Focus, only while it is on: otherwise Esc stays the screen's own.
      ...(focus
        ? [{ label: t('nav.exitFocus'), combo: { key: 'Escape' }, run: () => setFocusMode(false) }]
        : []),
    ],
    { scope: 'app' },
  )
  // A phone's tab bar is the places' own (memory-palaces'): on what a place opens it steps away, Back
  // the way out, and the screen has the whole height.
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  // Explore is a page My songs opens (the Explore board: Back, its name, no tab bar), though its view
  // is written into the place's URL.
  const exploring = useRouterState({
    select: (state) => new URLSearchParams(state.location.searchStr).get('view') === 'explore',
  })
  const away = exploring || !PLACES.some(({ to }) => to === pathname)
  // A laptop's sidebar puts the learner at its foot, under Search and Settings; a phone's bar keeps
  // the Profile as its last tab.
  const sidebarShown = useMediaQuery(SIDEBAR_SHOWN)
  const songsOpen = pathname === '/songs' || pathname.startsWith('/songs/')
  const songsPlaceShown = useSongsPlaceShown()
  return (
    <nav
      aria-label={t('nav.label')}
      data-slot="app-nav"
      data-sidebar={sidebar}
      data-away={away ? '' : undefined}
      className="group/nav pointer-events-none fixed inset-x-0 bottom-0 z-30 print:hidden px-4 pb-(--tab-bar-foot) lg:border-border lg:pointer-events-auto lg:bg-card lg:px-0 lg:inset-y-0 lg:right-auto lg:flex lg:w-62 lg:flex-col lg:border-t-0 lg:border-r lg:pb-0 lg:data-[sidebar=collapsed]:w-18 lg:data-[sidebar=focus]:hidden"
    >
      <div className="mt-6 hidden h-11 shrink-0 items-center gap-0.5 px-4 lg:flex lg:group-data-[sidebar=collapsed]/nav:h-auto lg:group-data-[sidebar=collapsed]/nav:flex-col lg:group-data-[sidebar=collapsed]/nav:py-4">
        {/* The boards' name is 24 in a narrower serif; the app's at 20 takes the same width beside the capsule, never cut. */}
        <p
          aria-hidden
          className="min-w-0 flex-1 truncate pl-3 font-display text-xl leading-tight font-normal group-data-[sidebar=collapsed]/nav:hidden"
        >
          {t('appName')}
        </p>
        {/* The sidebar's two buttons in one glass capsule (lapwin.py's head). */}
        <div className="flex shrink-0 rounded-pill glass lg:group-data-[sidebar=collapsed]/nav:flex-col">
          <button
            type="button"
            aria-label={toggleLabel}
            title={keyHint(toggleLabel, SIDEBAR_KEY, mac)}
            aria-expanded={!collapsed}
            onClick={toggle}
            className="grid size-11 shrink-0 place-items-center rounded-pill text-foreground transition-colors duration-200 ease-out hover:bg-muted"
          >
            <ToggleIcon aria-hidden className="size-5" />
          </button>
          <button
            type="button"
            aria-label={t('nav.focus')}
            title={t('nav.focusTip')}
            onClick={() => setFocusMode(true)}
            className="grid size-11 shrink-0 place-items-center rounded-pill text-foreground transition-colors duration-200 ease-out hover:bg-muted"
          >
            <Maximize aria-hidden className="size-5" />
          </button>
        </div>
      </div>
      {sidebarShown ? (
        <div className="flex px-4 pt-4 pb-4 group-data-[sidebar=collapsed]/nav:justify-center">
          <SidebarSearch collapsed={collapsed} combo={SEARCH_KEY} />
        </div>
      ) : null}
      <ul className="pointer-events-auto mx-auto flex h-16 max-w-md gap-0.5 rounded-[2rem] p-1.5 glass landscape-phone:h-13 landscape-phone:w-110 landscape-phone:p-1 landscape-phone:rounded-[1.625rem] lg:h-auto lg:rounded-none lg:bg-transparent lg:p-0 lg:shadow-none lg:backdrop-filter-none lg:mx-0 lg:max-w-none lg:flex-col lg:gap-1.5 lg:px-4 lg:pt-0">
        {(sidebarShown ? PLACES.filter((place) => place !== PROFILE) : PLACES).map((place) => {
          // Songs' places under Songs while it is current (the board's SONGS_SUB); the one shown
          // wears the wash, Songs then only bold.
          const sub = place.to === '/songs' && sidebarShown && !collapsed && songsOpen
          return (
            <li
              key={place.to}
              className={cn(
                'flex-1 lg:flex-none',
                sub && songsPlaceShown && '[&>a[aria-current=page]]:bg-transparent!',
              )}
            >
              <PlaceLink place={place} collapsed={collapsed} />
              {sub ? <SongsPlaces /> : null}
            </li>
          )
        })}
      </ul>
      {sidebarShown ? (
        <div className="flex min-h-0 flex-1 flex-col justify-between gap-3 px-4 pb-6">
          {collapsed ? <span /> : <SidebarRecents />}
          <SidebarAccount collapsed={collapsed} />
        </div>
      ) : null}
    </nav>
  )
}
