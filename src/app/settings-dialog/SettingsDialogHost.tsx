import { useNavigate, useRouterState } from '@tanstack/react-router'
import { lazy, Suspense, useEffect, type ComponentType, type ReactNode } from 'react'
import { LAPTOP, useMediaQuery } from '@/shared/lib'
import { opensInDialog, SettingsDialog } from '@/widgets/settings-screen'
import { backgroundHref, rememberBackground, SETTINGS_PARAM, withSettings } from './background'

const screens = () => import('../routes/settings-screens')
const adminScreens = () => import('../routes/admin-screens')

type Pane = () => ReactNode

/** A page loaded when the dialog first opens it, drawn by a pane made once, outside any render. */
function page<M>(load: () => Promise<M>, pick: (loaded: M) => ComponentType): Pane {
  const Page = lazy(() => load().then((loaded) => ({ default: pick(loaded) })))
  return () => <Page />
}

/** Each place the dialog opens, by its address: the same page its route shows on a phone. */
const PANES: Readonly<Record<string, Pane>> = {
  '/settings/general': page(screens, (loaded) => loaded.GeneralPage),
  '/settings/general/layouts': page(screens, (loaded) => loaded.PageLayoutsPage),
  '/settings/appearance': page(screens, (loaded) => loaded.AppearancePage),
  '/settings/storage': page(screens, (loaded) => loaded.StoragePage),
  '/settings/connect-piano': page(screens, (loaded) => loaded.MidiSettingsPage),
  '/settings/connect-piano/log': page(screens, (loaded) => loaded.MidiLogPage),
  '/settings/connect-piano/timing': page(screens, (loaded) => loaded.TimingCalibrationPage),
  '/settings/select-toolbar': page(screens, (loaded) => loaded.SelectToolbarPage),
  '/settings/swipe-actions': page(screens, (loaded) => loaded.SwipeActionsPage),
  '/settings/how-to-use': page(screens, (loaded) => loaded.HowToUsePage),
  '/settings/feedback': page(screens, (loaded) => loaded.FeedbackPage),
  '/settings/about': page(screens, (loaded) => loaded.AboutPage),
  '/settings/account': page(screens, (loaded) => loaded.AccountSettingsPage),
  '/settings/account/profile': page(screens, (loaded) => loaded.EditProfilePage),
  '/settings/account/email': page(screens, (loaded) => loaded.EmailPage),
  '/settings/account/password': page(screens, (loaded) => loaded.ChangePasswordPage),
  '/settings/privacy': page(screens, (loaded) => loaded.ProfilePrivacyPage),
  '/admin': page(adminScreens, (loaded) => loaded.AdminPage),
}
const ADMIN_SECTION = page(adminScreens, (loaded) => loaded.AdminSectionPage)

const paneOf = (path: string): Pane | null =>
  PANES[path] ?? (path.startsWith('/admin/') ? ADMIN_SECTION : null)

/**
 * The laptop's Settings dialog over the page it was opened from (claude.ai's, the board's SETDLG):
 * shown while the page's address holds a Settings place; × and Escape take it off. It keeps the page
 * behind remembered as the learner moves, so the next Settings opens over it. On a phone the place's
 * own page opens instead.
 */
export function SettingsDialogHost() {
  const location = useRouterState({ select: (state) => state.location })
  const navigate = useNavigate()
  const wide = useMediaQuery(LAPTOP)
  useEffect(() => {
    if (!opensInDialog(location.pathname)) rememberBackground(location.href)
  }, [location])
  const held = new URLSearchParams(location.searchStr).get(SETTINGS_PARAM)
  const path = held !== null && opensInDialog(held) ? held : null
  // On a phone the place's own page, in the dialog's place in history.
  useEffect(() => {
    if (path !== null && !wide) void navigate({ href: path, replace: true })
  }, [path, wide, navigate])
  if (path === null || !wide) return null
  const pane = paneOf(path)
  if (pane === null) return null
  return (
    <SettingsDialog
      path={path}
      onClose={() => void navigate({ href: withSettings(backgroundHref(), null), replace: true })}
    >
      <Suspense fallback={null}>{pane()}</Suspense>
    </SettingsDialog>
  )
}
