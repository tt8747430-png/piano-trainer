import { useNavigate, useRouter, useRouterState } from '@tanstack/react-router'
import { useEffect, useRef, useState, type ComponentType } from 'react'
import { LAPTOP, useMediaQuery } from '@/shared/lib'
import { opensInDialog, SettingsDialog } from '@/widgets/settings-screen'
import { backgroundHref, rememberBackground } from './background'

const screens = () => import('../routes/settings-screens')
const adminScreens = () => import('../routes/admin-screens')

type Screens = Awaited<ReturnType<typeof screens>>
type AdminScreens = Awaited<ReturnType<typeof adminScreens>>

/** Each place the dialog opens, by its address: the same page its route shows on a phone. */
const PAGES: Readonly<Record<string, (loaded: Screens) => ComponentType>> = {
  '/settings/general': (loaded) => loaded.GeneralPage,
  '/settings/general/layouts': (loaded) => loaded.PageLayoutsPage,
  '/settings/appearance': (loaded) => loaded.AppearancePage,
  '/settings/storage': (loaded) => loaded.StoragePage,
  '/settings/connect-piano': (loaded) => loaded.MidiSettingsPage,
  '/settings/connect-piano/log': (loaded) => loaded.MidiLogPage,
  '/settings/connect-piano/timing': (loaded) => loaded.TimingCalibrationPage,
  '/settings/select-toolbar': (loaded) => loaded.SelectToolbarPage,
  '/settings/swipe-actions': (loaded) => loaded.SwipeActionsPage,
  '/settings/how-to-use': (loaded) => loaded.HowToUsePage,
  '/settings/feedback': (loaded) => loaded.FeedbackPage,
  '/settings/about': (loaded) => loaded.AboutPage,
  '/settings/account': (loaded) => loaded.AccountSettingsPage,
  '/settings/account/profile': (loaded) => loaded.EditProfilePage,
  '/settings/account/email': (loaded) => loaded.EmailPage,
  '/settings/account/password': (loaded) => loaded.ChangePasswordPage,
  '/settings/privacy': (loaded) => loaded.ProfilePrivacyPage,
}

/** Settings' and Administration's pages, each chunk once loaded: what the dialog draws from. */
type Loaded = { readonly screens?: Screens; readonly admin?: AdminScreens }

const isAdminPath = (path: string) => path === '/admin' || path.startsWith('/admin/')

/** The page a place shows, once its chunk is in; `undefined` while it is loading, `null` for none. */
function pageOf(path: string, loaded: Loaded): ComponentType | null | undefined {
  if (path in PAGES) return loaded.screens && PAGES[path]?.(loaded.screens)
  if (isAdminPath(path))
    return (
      loaded.admin && (path === '/admin' ? loaded.admin.AdminPage : loaded.admin.AdminSectionPage)
    )
  return null
}

/**
 * The laptop's Settings dialog over the page it was opened from (claude.ai's, the board's SETDLG):
 * shown while the history entry holds a Settings place (never the address); × and Escape take it off. It keeps the page
 * behind remembered as the learner moves, so the next Settings opens over it. On a phone the place's
 * own page opens instead.
 */
export function SettingsDialogHost() {
  const location = useRouterState({ select: (state) => state.location })
  const navigate = useNavigate()
  const { history } = useRouter()
  // Where in history the page under the dialog stands: opening Settings and each place opened in it
  // added an entry, so closing goes back past them all and Back then leaves the page, not Settings.
  const under = useRef<number | null>(null)
  const wide = useMediaQuery(LAPTOP)
  useEffect(() => {
    if (!opensInDialog(location.pathname)) rememberBackground(location.href)
  }, [location])
  const held = location.state.settings ?? null
  // A place's own address, on its way into the entry's state (a link in the dialog's nav), keeps the
  // dialog up showing that place: it is never taken down and opened again between two places.
  const passing = location.pathname === '/settings' ? '/settings/general' : location.pathname
  const path =
    held !== null && opensInDialog(held)
      ? held
      : wide && opensInDialog(location.pathname)
        ? passing
        : null
  // On a phone the place's own page, in the dialog's place in history.
  useEffect(() => {
    if (path !== null && !wide) void navigate({ href: path, replace: true })
  }, [path, wide, navigate])
  useEffect(() => {
    // A place's own address passes on its way into the dialog: still in Settings.
    if (path === null && !opensInDialog(location.pathname)) under.current = null
    else if (path !== null) under.current ??= history.location.state.__TSR_index - 1
  }, [path, history, location.pathname])
  // Settings' pages load with the laptop's first page, so the dialog opens with its place drawn,
  // never an empty shell that fills a few frames later; Administration's load once it is opened.
  const [loaded, setLoaded] = useState<Loaded>({})
  const wantsAdmin = path !== null && isAdminPath(path)
  useEffect(() => {
    if (wide && !loaded.screens)
      void screens().then((chunk) => setLoaded((was) => ({ ...was, screens: chunk })))
  }, [wide, loaded.screens])
  useEffect(() => {
    if (wantsAdmin && !loaded.admin)
      void adminScreens().then((chunk) => setLoaded((was) => ({ ...was, admin: chunk })))
  }, [wantsAdmin, loaded.admin])
  // While a place's chunk loads, the place shown before stays: the pane never goes blank.
  const [shown, setShown] = useState<{ path: string; Page: ComponentType } | null>(null)
  const Page = path === null || !wide ? null : pageOf(path, loaded)
  if (Page === null && shown !== null) setShown(null)
  if (path !== null && Page && (shown?.path !== path || shown.Page !== Page))
    setShown({ path, Page })
  if (Page === null || shown === null) return null
  const Pane = shown.Page
  return (
    <SettingsDialog
      path={shown.path}
      onClose={() => {
        const steps = history.location.state.__TSR_index - (under.current ?? -1)
        // Opened from a page in the app: back to it. Opened cold at a Settings address: the page.
        if (under.current !== null && under.current >= 0 && steps > 0) history.go(-steps)
        else void navigate({ href: backgroundHref(), replace: true })
      }}
    >
      <Pane />
    </SettingsDialog>
  )
}
