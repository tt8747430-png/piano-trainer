import { useNavigate, useRouterState } from '@tanstack/react-router'
import { lazy, Suspense, useEffect, type ComponentType } from 'react'
import { LAPTOP, useMediaQuery } from '@/shared/lib'
import { opensInDialog, SettingsDialog } from '@/widgets/settings-screen'
import { backgroundHref, rememberBackground, SETTINGS_PARAM, withSettings } from './background'

const screens = () => import('../routes/settings-screens')
const adminScreens = () => import('../routes/admin-screens')

/** Each place the dialog opens, by its address: the same page its route shows on a phone. */
const PANES: Readonly<Record<string, ComponentType>> = {
  '/settings/general': lazy(() => screens().then((loaded) => ({ default: loaded.GeneralPage }))),
  '/settings/appearance': lazy(() =>
    screens().then((loaded) => ({ default: loaded.AppearancePage })),
  ),
  '/settings/storage': lazy(() => screens().then((loaded) => ({ default: loaded.StoragePage }))),
  '/settings/connect-piano': lazy(() =>
    screens().then((loaded) => ({ default: loaded.MidiSettingsPage })),
  ),
  '/settings/connect-piano/log': lazy(() =>
    screens().then((loaded) => ({ default: loaded.MidiLogPage })),
  ),
  '/settings/connect-piano/timing': lazy(() =>
    screens().then((loaded) => ({ default: loaded.TimingCalibrationPage })),
  ),
  '/settings/select-toolbar': lazy(() =>
    screens().then((loaded) => ({ default: loaded.SelectToolbarPage })),
  ),
  '/settings/swipe-actions': lazy(() =>
    screens().then((loaded) => ({ default: loaded.SwipeActionsPage })),
  ),
  '/settings/how-to-use': lazy(() =>
    screens().then((loaded) => ({ default: loaded.HowToUsePage })),
  ),
  '/settings/feedback': lazy(() => screens().then((loaded) => ({ default: loaded.FeedbackPage }))),
  '/settings/about': lazy(() => screens().then((loaded) => ({ default: loaded.AboutPage }))),
  '/settings/account': lazy(() =>
    screens().then((loaded) => ({ default: loaded.AccountSettingsPage })),
  ),
  '/settings/account/profile': lazy(() =>
    screens().then((loaded) => ({ default: loaded.EditProfilePage })),
  ),
  '/settings/account/email': lazy(() =>
    screens().then((loaded) => ({ default: loaded.EmailPage })),
  ),
  '/settings/account/password': lazy(() =>
    screens().then((loaded) => ({ default: loaded.ChangePasswordPage })),
  ),
  '/settings/privacy': lazy(() =>
    screens().then((loaded) => ({ default: loaded.ProfilePrivacyPage })),
  ),
  '/admin': lazy(() => adminScreens().then((loaded) => ({ default: loaded.AdminPage }))),
}
const ADMIN_SECTION = lazy(() =>
  adminScreens().then((loaded) => ({ default: loaded.AdminSectionPage })),
)

const paneOf = (path: string): ComponentType | null =>
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
  const Pane = paneOf(path)
  if (Pane === null) return null
  return (
    <SettingsDialog
      path={path}
      onClose={() => void navigate({ href: withSettings(backgroundHref(), null), replace: true })}
    >
      <Suspense fallback={null}>
        <Pane />
      </Suspense>
    </SettingsDialog>
  )
}
