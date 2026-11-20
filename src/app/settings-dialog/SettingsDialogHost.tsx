import { useNavigate, useRouter, useRouterState } from '@tanstack/react-router'
import { lazy, Suspense, useEffect, useRef, type ComponentType, type ReactNode } from 'react'
import { LAPTOP, useMediaQuery } from '@/shared/lib'
import { opensInDialog, SettingsDialog } from '@/widgets/settings-screen'
import { backgroundHref, rememberBackground, SETTINGS_PARAM, withSettings } from './background'

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

/**
 * The places' pages, loaded once as one: moving between them never suspends again, so a place
 * opened for the first time draws at once instead of leaving the pane blank for a few frames.
 */
const SettingsPane = lazy(() =>
  screens().then((loaded) => ({
    default: function SettingsPane({ path }: { path: string }) {
      const Page = PAGES[path]?.(loaded)
      return Page ? <Page /> : null
    },
  })),
)

/** Administration's overview and its sections, loaded once as one, as Settings' places are. */
const AdminPane = lazy(() =>
  adminScreens().then((loaded: AdminScreens) => ({
    default: function AdminPane({ path }: { path: string }) {
      const Page = path === '/admin' ? loaded.AdminPage : loaded.AdminSectionPage
      return <Page />
    },
  })),
)

const paneOf = (path: string): ReactNode =>
  path in PAGES ? (
    <SettingsPane path={path} />
  ) : path === '/admin' || path.startsWith('/admin/') ? (
    <AdminPane path={path} />
  ) : null

/**
 * The laptop's Settings dialog over the page it was opened from (claude.ai's, the board's SETDLG):
 * shown while the page's address holds a Settings place; × and Escape take it off. It keeps the page
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
  const held = new URLSearchParams(location.searchStr).get(SETTINGS_PARAM)
  // A place's own address, on its way to the dialog's param (a link in the dialog's nav), keeps the
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
  if (path === null || !wide) return null
  const pane = paneOf(path)
  if (pane === null) return null
  return (
    <SettingsDialog
      path={path}
      onClose={() => {
        const steps = history.location.state.__TSR_index - (under.current ?? -1)
        // Opened from a page in the app: back to it. Opened cold at a Settings address: the page.
        if (under.current !== null && under.current >= 0 && steps > 0) history.go(-steps)
        else void navigate({ href: withSettings(backgroundHref(), null), replace: true })
      }}
    >
      <Suspense fallback={null}>{pane}</Suspense>
    </SettingsDialog>
  )
}
